"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import usersApi from "@/lib/api/usersApi";
import { getPaymentMethod } from "@/lib/api/paymentMethodApi";
// ❌ Bỏ validateCoupon vì không còn nhập mã tay nữa
// import { validateCoupon } from "@/lib/api/couponApi";
import CheckoutStep2 from "./CheckoutStep2/CheckoutStep2";
import CheckoutStep1 from "./CheckoutStep1/CheckoutStep1";
import { removeItem as removeCartItem } from "@/lib/api/cartsApi";
import CheckoutStepper from "./CheckoutStep1/_components/CheckoutStepper";
import OrderSummary from "./CheckoutStep1/_components/OrderSummary";

const HCMC_PROVINCE = "Hồ Chí Minh";

export default function CheckoutPage() {
  const router = useRouter();

  // UI / flow states
  const [loading, setLoading] = useState(true);
  const [missing, setMissing] = useState(false);
  const [step, setStep] = useState(1);
  const [showReviewItems, setShowReviewItems] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // checkout items
  const [items, setItems] = useState([]);

  // user / addresses
  const [user, setUser] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [addressForm, setAddressForm] = useState({
    line: "",
    ward: "",
    district: "",
    phone: "",
    province: HCMC_PROVINCE,
    isDefault: false,
  });

  // customer
  const [customer, setCustomer] = useState({ name: "", phone: "", email: "" });

  // payment
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [selectedPaymentMethodId, setSelectedPaymentMethodId] = useState(null);
  const [note, setNote] = useState("");

  // VietQR state
  const [qrUrl, setQrUrl] = useState(null);
  const [orderCode, setOrderCode] = useState(null);
  const [isPaid, setIsPaid] = useState(false);
  const [generatingQr, setGeneratingQr] = useState(false);

  // ✅ coupon states (tự apply best)
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [allCoupons, setAllCoupons] = useState([]); // các mã hợp lệ khác

  // address saving state
  const [savingAddress, setSavingAddress] = useState(false);

  // shipping
  const [shippingFee, setShippingFee] = useState(0);
  const [estimatingShipping, setEstimatingShipping] = useState(false);

  const [deliveryMethod, setDeliveryMethod] = useState("shipping");

  const shippingRequestIdRef = useRef(0);

  // ================== LOAD DỮ LIỆU BAN ĐẦU ==================
  useEffect(() => {
    const raw =
      typeof window !== "undefined"
        ? sessionStorage.getItem("checkoutItems")
        : null;
    if (!raw) {
      setMissing(true);
      setLoading(false);
      setTimeout(() => router.replace("/cart"), 800);
      return;
    }

    let payload = null;
    try {
      payload = JSON.parse(raw);
    } catch (e) {
      console.error("Invalid checkoutItems payload", e);
      setMissing(true);
      setLoading(false);
      setTimeout(() => router.replace("/cart"), 800);
      return;
    }

    if (
      !payload ||
      !Array.isArray(payload.items) ||
      payload.items.length === 0
    ) {
      setMissing(true);
      setLoading(false);
      setTimeout(() => router.replace("/cart"), 800);
      return;
    }

    setItems(
      payload.items.map((it) => ({
        ...it,
        price: Number(it.price) || 0,
        quantity: Number(it.quantity) || 1,
      }))
    );

    (async () => {
      try {
        let fetchedUser = null;
        try {
          const res = await usersApi.getCurrentUser();
          if (res && res.ok === false && res.status === 401) {
            router.replace("/login?redirect=/checkout");
            return;
          }
          if (res && res.data) fetchedUser = res.data;
          else if (res && res.id) fetchedUser = res;
        } catch (e) {
          console.error("usersApi.getCurrentUser error", e);
        }

        if (fetchedUser) {
          const safeUser = { ...fetchedUser };
          delete safeUser.passwordHash;
          setUser(safeUser);
          setCustomer((prev) => ({
            ...prev,
            name: safeUser.name || prev.name,
            phone: safeUser.phone || prev.phone,
            email: safeUser.email || prev.email,
          }));

          const userAddresses = Array.isArray(safeUser.addresses)
            ? safeUser.addresses
            : [];
          setAddresses(userAddresses);

          if (userAddresses.length > 0) {
            const defaultAddr =
              userAddresses.find((a) => a.isDefault) || userAddresses[0];
            setSelectedAddressId(defaultAddr.id);
            setAddressForm({
              line: defaultAddr.line || "",
              ward: defaultAddr.ward || "",
              district: defaultAddr.district || "",
              province: defaultAddr.province || HCMC_PROVINCE,
              phone: defaultAddr.phone || "",
              isDefault: !!defaultAddr.isDefault,
            });
          } else {
            // No addresses -> show new address form and mark as default
            setSelectedAddressId("new");
            setAddressForm({
              line: "",
              ward: "",
              district: "",
              province: HCMC_PROVINCE,
              phone: "",
              isDefault: true,
            });
          }
        }

        try {
          const pmRes = await getPaymentMethod();
          const pmData = pmRes && pmRes.data ? pmRes.data : pmRes;
          if (Array.isArray(pmData)) {
            setPaymentMethods(pmData);
            if (pmData.length > 0) setSelectedPaymentMethodId(pmData[0].id);
          }
        } catch (err) {
          console.error("getPaymentMethod error", err);
        }
      } catch (err) {
        console.error("Error loading checkout meta", err);
      } finally {
        setLoading(false);
      }
    })();
  }, [router]);

  // ================== TÍNH TOÁN TỔNG TIỀN ==================
  const subtotal = useMemo(
    () => items.reduce((s, it) => s + it.price * it.quantity, 0),
    [items]
  );

  const discount = useMemo(() => {
    if (!appliedCoupon) return 0;
    const d = Number(
      appliedCoupon.discountAmount ?? appliedCoupon.computedDiscount ?? 0
    );
    return Math.max(0, Math.floor(d || 0));
  }, [appliedCoupon]);

  const total = Math.max(0, subtotal + (Number(shippingFee) || 0) - discount);

  const selectedPaymentMethod = paymentMethods.find(
    (m) => m.id === selectedPaymentMethodId
  );
  const requiresPaymentConfirmation =
    selectedPaymentMethod && selectedPaymentMethod.code === "bank_transfer";
  const placeOrderDisabled = submitting;

  // ================== TOAST ĐƠN GIẢN ==================
  function showToast(msg, type = "info") {
    const colors = {
      info: "bg-blue-600",
      success: "bg-green-600",
      error: "bg-red-600",
    };
    const el = document.createElement("div");
    el.className = `fixed top-4 right-4 ${colors[type]} text-white px-5 py-2 rounded shadow z-50`;
    el.textContent = msg;
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 2500);
  }

  // ================== VIETQR ==================
  async function generateVietQrForAccount(accountNumber) {
    try {
      if (!accountNumber) return;
      setGeneratingQr(true);
      setQrUrl(null);
      setOrderCode(null);

      const res = await fetch("/api/payments/vietqr", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: total,
          accountNumber: String(accountNumber),
        }),
      });

      if (!res.ok) {
        const txt = await res.text();
        throw new Error(txt || "Failed to create QR");
      }

      const data = await res.json();
      if (data.qrUrl) setQrUrl(data.qrUrl);
      if (data.orderCode) setOrderCode(data.orderCode);
      setIsPaid(false);
    } catch (err) {
      console.error("generateVietQrForAccount error:", err);
      showToast("Tạo mã VietQR thất bại", "error");
      setQrUrl(null);
      setOrderCode(null);
      setIsPaid(false);
    } finally {
      setGeneratingQr(false);
    }
  }

  // Auto tạo QR khi chọn bank_transfer
  useEffect(() => {
    async function autoGenerate() {
      try {
        const method = paymentMethods.find(
          (m) => m.id === selectedPaymentMethodId
        );
        if (!method) return;

        if (method.code !== "bank_transfer") {
          setQrUrl(null);
          setOrderCode(null);
          setIsPaid(false);
          return;
        }

        const account =
          method.accounts && method.accounts.length > 0
            ? method.accounts[0]
            : null;
        if (!account) {
          console.warn("No account for bank_transfer method");
          return;
        }

        if (qrUrl && orderCode) return;

        await generateVietQrForAccount(account.accountNumber);
      } catch (err) {
        console.error("autoGenerate VietQR error:", err);
        showToast("Tạo mã VietQR thất bại", "error");
        setQrUrl(null);
        setOrderCode(null);
        setIsPaid(false);
      }
    }

    if (paymentMethods.length > 0 && selectedPaymentMethodId) {
      autoGenerate();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedPaymentMethodId, paymentMethods]);

  function getCurrentAddressPhone() {
    if (selectedAddressId === "new") return addressForm.phone;
    const addr = addresses.find((a) => a.id === selectedAddressId);
    return addr?.phone || "";
  }

  // ================== VALIDATE BƯỚC 1 ==================
  function validateStep1() {
    if (!customer.name) {
      showToast("Vui lòng nhập họ tên", "error");
      return false;
    }

    // ✅ Nếu nhận tại cửa hàng: chỉ cần SĐT liên hệ (customer.phone)
    if (deliveryMethod === "pickup") {
      return true;
    }

    // ✅ Nếu giao hàng: dùng phone từ địa chỉ
    const phone = getCurrentAddressPhone();
    if (!phone) {
      showToast("Vui lòng nhập số điện thoại nhận hàng", "error");
      return false;
    }

    if (selectedAddressId === "new") {
      if (!addressForm.province) {
        showToast("Vui lòng nhập tỉnh/thành", "error");
        return false;
      }
      if (!addressForm.district) {
        showToast("Vui lòng nhập quận/huyện", "error");
        return false;
      }
      if (!addressForm.line) {
        showToast("Vui lòng nhập địa chỉ (số nhà, đường)", "error");
        return false;
      }
    }

    return true;
  }

  // ================== LƯU ĐỊA CHỈ ==================
  async function saveAddress() {
    if (
      !addressForm.line ||
      !addressForm.district ||
      !addressForm.province ||
      !addressForm.phone
    ) {
      showToast(
        "Vui lòng điền đầy đủ: tỉnh/thành, quận/huyện và địa chỉ",
        "error"
      );
      return;
    }

    const payload = {
      line: addressForm.line,
      ward: addressForm.ward || null,
      district: addressForm.district,
      province: addressForm.province,
      phone: addressForm.phone || null,
      isDefault: addresses.length === 0 ? true : !!addressForm.isDefault,
    };

    setSavingAddress(true);
    try {
      const res = await fetch("/api/addresses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        let text = "Lưu địa chỉ thất bại";
        try {
          const json = await res.json();
          if (json && json.message) text = json.message;
        } catch {
          try {
            text = await res.text();
          } catch {}
        }
        throw new Error(text);
      }

      const saved = await res.json();

      setAddresses((prev) => [saved, ...prev]);
      setSelectedAddressId(saved.id);
      setAddressForm({
        line: saved.line || "",
        ward: saved.ward || "",
        district: saved.district || "",
        province: saved.province || HCMC_PROVINCE,
        isDefault: !!saved.isDefault,
      });

      showToast("Lưu địa chỉ thành công", "success");
    } catch (err) {
      console.error("saveAddress error:", err);
      showToast(err?.message || "Lưu địa chỉ thất bại", "error");
    } finally {
      setSavingAddress(false);
    }
  }

  // ================== ƯỚC TÍNH PHÍ SHIP ==================
  async function estimateShippingFor(addressSnapshot) {
    // Tăng request id mỗi lần gọi
    const requestId = ++shippingRequestIdRef.current;

    try {
      setEstimatingShipping(true);

      const itemsForApi = items.map((it) => ({
        price: it.price,
        quantity: it.quantity,
        categoryId: it.categoryId ?? null,
        brandId: it.brandId ?? null,
      }));

      const res = await fetch("/api/shipping/estimate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: itemsForApi,
          subtotal,
          address: addressSnapshot,
        }),
      });

      // Nếu trong lúc chờ mà đã có request khác mới hơn => bỏ qua
      if (requestId !== shippingRequestIdRef.current) return;

      if (!res.ok) {
        setShippingFee(0);
        return;
      }

      const data = await res.json();

      setShippingFee(Number(data.shippingFee || 0));
    } catch (err) {
      console.error("estimateShipping error", err);
      // chỉ set 0 nếu vẫn là request mới nhất
      if (requestId === shippingRequestIdRef.current) {
        setShippingFee(0);
      }
    } finally {
      // chỉ tắt loading nếu vẫn là request mới nhất
      if (requestId === shippingRequestIdRef.current) {
        setEstimatingShipping(false);
      }
    }
  }

  useEffect(() => {
    // ⭐ Nếu nhận tại cửa hàng -> huỷ request cũ + reset ship + tắt loading
    if (deliveryMethod === "pickup") {
      shippingRequestIdRef.current++; // invalidate tất cả request đang chờ
      setShippingFee(0);
      setEstimatingShipping(false); // ⬅️ thêm dòng này
      return;
    }

    const chosenAddress =
      selectedAddressId === "new"
        ? addressForm
        : addresses.find((a) => a.id === selectedAddressId) || null;

    const addrSnapshot = chosenAddress
      ? {
          line: chosenAddress.line,
          province: chosenAddress.province,
          district: chosenAddress.district,
          ward: chosenAddress.ward,
        }
      : null;

    if (items.length > 0) {
      estimateShippingFor(addrSnapshot);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    deliveryMethod,
    selectedAddressId,
    addressForm.province,
    addressForm.district,
    addressForm.ward,
    subtotal,
    JSON.stringify(items),
  ]);

  // ================== COUPON: AUTO APPLY BEST ==================
  async function fetchBestCoupon() {
    try {
      const itemsForApi = items.map((it) => ({
        price: it.price,
        quantity: it.quantity,
        categoryId: it.categoryId ?? null,
        brandId: it.brandId ?? null,
      }));

      const res = await fetch("/api/coupons/apply-best", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: itemsForApi, subtotal }),
      });

      if (!res.ok) {
        setAppliedCoupon(null);
        setAllCoupons([]);
        return;
      }

      const data = await res.json();

      setAppliedCoupon(data.appliedCoupon || null);
      setAllCoupons(data.allCoupons || []);

      if (data.appliedCoupon) {
        const saved = Number(
          data.appliedCoupon.discountAmount ??
            data.appliedCoupon.computedDiscount ??
            0
        );
        if (saved > 0) {
          showToast(
            `Đã tự áp dụng mã ${
              data.appliedCoupon.code
            } — tiết kiệm ${new Intl.NumberFormat("vi-VN", {
              style: "currency",
              currency: "VND",
              minimumFractionDigits: 0,
            }).format(saved)}`,
            "success"
          );
        }
      }
    } catch (err) {
      console.error("fetchBestCoupon error:", err);
      setAppliedCoupon(null);
      setAllCoupons([]);
    }
  }

  // Gọi auto apply coupon khi vào Step 2 hoặc khi subtotal/items đổi
  useEffect(() => {
    if (step !== 2) return;
    if (items.length === 0 || subtotal <= 0) return;
    fetchBestCoupon();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step, subtotal, JSON.stringify(items)]);

  function handleSelectCoupon(coupon) {
    setAppliedCoupon(coupon);
  }

  function handleRemoveCoupon() {
    setAppliedCoupon(null);
  }

  // ================== ĐIỀU HƯỚNG STEP ==================
  function handleContinueToPayment() {
    if (!validateStep1()) return;
    setStep(2);
    showToast("Chuyển sang bước Thanh toán", "success");
  }

  // ================== PLACE ORDER ==================
  async function handlePlaceOrder() {
    if (!selectedPaymentMethodId) {
      showToast("Vui lòng chọn phương thức thanh toán", "error");
      return;
    }

    if (requiresPaymentConfirmation) {
      if (!qrUrl || !orderCode) {
        showToast("Vui lòng chờ tạo mã VietQR trước khi đặt hàng", "error");
        return;
      }
    }

    setSubmitting(true);
    try {
      // ✅ Xác định address theo deliveryMethod
      let chosenAddress;
      let addressPhone = "";

      if (deliveryMethod === "pickup") {
        chosenAddress = {
          line: "Nhận tại cửa hàng",
          ward: "P. Chợ Quán",
          district: "Q.5",
          province: "TP.HCM",
        };
        addressPhone = customer.phone || "";
      } else {
        // shipping như cũ
        chosenAddress =
          selectedAddressId === "new"
            ? addressForm
            : addresses.find((a) => a.id === selectedAddressId) || addressForm;

        addressPhone =
          selectedAddressId === "new"
            ? addressForm.phone
            : chosenAddress.phone || addressForm.phone || "";
      }

      const itemsPayload = items.map((it) => ({
        variantId: it.variantId,
        quantity: it.quantity,
        price: it.price,
        nameSnapshot: `${it.name} ${[it.variantName, ...(it.specs || [])]
          .filter(Boolean)
          .join(" - ")}`,
        categoryId: it.categoryId ?? null,
        brandId: it.brandId ?? null,
      }));

      const idempotencyKey = `order-${Date.now()}-${Math.random()
        .toString(36)
        .slice(2, 9)}`;

      const payload = {
        subtotal,
        shippingFee: deliveryMethod === "pickup" ? 0 : shippingFee, // ✅ pickup thì ship = 0
        discount,
        total,
        deliveryMethod, // ✅ gửi lên backend luôn
        addressSnapshot: {
          customer: {
            name: customer.name,
            phone: addressPhone,
            email: customer.email,
          },
          address: chosenAddress,
        },
        items: itemsPayload,
        paymentMethodId: selectedPaymentMethodId,
        note,
        couponCode: appliedCoupon ? appliedCoupon.code : undefined,
        paymentMeta: {
          idempotencyKey,
          ...(selectedPaymentMethod &&
          selectedPaymentMethod.code === "bank_transfer"
            ? { qrUrl, orderCode }
            : {}),
        },
      };

      const res = await fetch("/api/checkout/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data?.reason) {
          showToast(`Coupon lỗi: ${data.reason}`, "error");
          const reasonStr = String(data.reason).toLowerCase();
          if (
            reasonStr.includes("coupon") ||
            reasonStr.includes("min_order") ||
            reasonStr.includes("usage")
          ) {
            handleRemoveCoupon();
          }
        } else if (
          data?.error &&
          String(data.error).toLowerCase().includes("insufficient stock")
        ) {
          showToast(data.error, "error");
        } else if (res.status === 401) {
          showToast("Vui lòng đăng nhập để đặt hàng", "error");
          router.replace("/login?redirect=/checkout");
        } else {
          showToast(
            data?.error || "Đặt hàng thất bại. Vui lòng thử lại",
            "error"
          );
        }
        setSubmitting(false);
        return;
      }

      // ✅ Đến đây là ĐẶT HÀNG THÀNH CÔNG

      // 1) Gọi API xoá các CartItem tương ứng sản phẩm đã mua
      try {
        const itemsWithCartId = items.filter((it) => it.cartItemId);
        if (itemsWithCartId.length > 0) {
          await Promise.all(
            itemsWithCartId.map((it) => removeCartItem(it.cartItemId))
          );
        }
      } catch (clearErr) {
        console.error("Clear cart after checkout error:", clearErr);
        // Không chặn flow, chỉ log cho dev xem
      }

      // 2) Clear checkoutItems trên FE
      sessionStorage.removeItem("checkoutItems");

      // 3) Thông báo + điều hướng
      showToast("Đặt hàng thành công", "success");
      router.replace("/profile/orders");
    } catch (err) {
      console.error("Place order error:", err);
      showToast("Đặt hàng thất bại. Vui lòng thử lại", "error");
    } finally {
      setSubmitting(false);
    }
  }

  // ================== LOADING / MISSING ==================
  if (loading)
    return (
      <div className="min-h-screen bg-gray-50 grid place-items-center p-6">
        <div className="text-gray-600">Đang tải...</div>
      </div>
    );
  if (missing)
    return (
      <div className="min-h-screen bg-gray-50 grid place-items-center p-6">
        <div className="text-gray-600">
          Không có sản phẩm để thanh toán. Đang chuyển hướng tới giỏ hàng…
        </div>
      </div>
    );

  const chosenAddress = (() => {
    if (deliveryMethod === "pickup") {
      return {
        line: "Nhận tại cửa hàng",
        ward: "P. Chợ Quán",
        district: "Q.5",
        province: "TP.HCM",
        phone: customer.phone || "",
      };
    }

    const addr =
      selectedAddressId === "new"
        ? addressForm
        : addresses.find((a) => a.id === selectedAddressId) || null;

    if (!addr) return null;

    return {
      ...addr,
      phone: addr.phone || customer.phone || "",
    };
  })();

  // ================== RENDER ==================
  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* --- PHẦN CHUNG: STEPPER --- */}
        <CheckoutStepper currentStep={step} />

        {/* --- PHẦN RIÊNG: SWITCH LAYOUT --- */}
        <div className="mt-8">
          {step === 1 ? (
            <CheckoutStep1
              // Truyền tất cả props cần thiết cho Step 1
              items={items}
              customer={customer}
              onChangeCustomer={setCustomer}
              addresses={addresses}
              selectedAddressId={selectedAddressId}
              onSelectAddressId={setSelectedAddressId}
              addressForm={addressForm}
              onChangeAddressForm={setAddressForm}
              onSaveAddress={saveAddress}
              savingAddress={savingAddress}
              subtotal={subtotal}
              total={total}
              shippingFee={shippingFee}
              estimatingShipping={estimatingShipping}
              deliveryMethod={deliveryMethod}
              onChangeDeliveryMethod={setDeliveryMethod}
              onContinue={handleContinueToPayment}
            />
          ) : (
            <CheckoutStep2
              items={items}
              subtotal={subtotal}
              shippingFee={shippingFee}
              total={total}
              estimatingShipping={estimatingShipping}
              paymentMethods={paymentMethods}
              selectedPaymentMethodId={selectedPaymentMethodId}
              onSelectPaymentMethodId={setSelectedPaymentMethodId}
              note={note}
              onChangeNote={setNote}
              // ✅ truyền props coupon mới
              appliedCoupon={appliedCoupon}
              allCoupons={allCoupons}
              onSelectCoupon={handleSelectCoupon}
              onRemoveCoupon={handleRemoveCoupon}
              requiresPaymentConfirmation={requiresPaymentConfirmation}
              qrUrl={qrUrl}
              orderCode={orderCode}
              isPaid={isPaid}
              generatingQr={generatingQr}
              setIsPaid={setIsPaid}
              placeOrderDisabled={placeOrderDisabled}
              submitting={submitting}
              onPlaceOrder={handlePlaceOrder}
              onBackToInfo={() => setStep(1)}
              customer={customer}
              chosenAddress={chosenAddress}
            />
          )}
        </div>
      </div>
    </div>
  );
}
