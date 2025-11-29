"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import usersApi from "@/lib/api/usersApi";
import { getPaymentMethod } from "@/lib/api/paymentMethodApi";
import { validateCoupon } from "@/lib/api/couponApi";

/**
 * CheckoutPage (text inputs for district/ward; do NOT block or validate saved addresses' province)
 *
 * - Province field shown but fixed to "Hồ Chí Minh" for new input (you can change if needed)
 * - District and Ward are plain text inputs (user types freely)
 * - Existing saved addresses are shown and selectable without client-side province checks
 *
 * Paste this file into your project (e.g., src/app/checkout/page.tsx or similar).
 */

const HCMC_PROVINCE = "Hồ Chí Minh";

export default function CheckoutPage() {
  const router = useRouter();

  // UI / flow states
  const [loading, setLoading] = useState(true);
  const [missing, setMissing] = useState(false);
  const [step, setStep] = useState(1);
  const [showOthers, setShowOthers] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [showReviewItems, setShowReviewItems] = useState(false);

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
    province: HCMC_PROVINCE,
    isDefault: false,
  });

  // customer
  const [customer, setCustomer] = useState({ name: "", phone: "", email: "" });

  // payment
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [selectedPaymentMethodId, setSelectedPaymentMethodId] = useState(null);
  const [note, setNote] = useState("");

  // VietQR state (auto-generate when method is bank_transfer)
  const [qrUrl, setQrUrl] = useState(null);
  const [orderCode, setOrderCode] = useState(null);
  const [isPaid, setIsPaid] = useState(false);
  const [generatingQr, setGeneratingQr] = useState(false);

  // coupon states
  const [couponInput, setCouponInput] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponError, setCouponError] = useState(null);

  // address saving state
  const [savingAddress, setSavingAddress] = useState(false);

  // shipping
  const [shippingFee, setShippingFee] = useState(0);
  const [estimatingShipping, setEstimatingShipping] = useState(false);

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

    if (!payload || !Array.isArray(payload.items) || payload.items.length === 0) {
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

  const subtotal = useMemo(
    () => items.reduce((s, it) => s + it.price * it.quantity, 0),
    [items]
  );

  // compute discount from appliedCoupon (use coupon computedDiscount if provided by API)
  const discount = useMemo(() => {
    if (!appliedCoupon) return 0;
    const cd = Number(appliedCoupon.computedDiscount ?? 0);
    return Math.max(0, Math.floor(cd || 0));
  }, [appliedCoupon]);

  const total = Math.max(0, subtotal + (Number(shippingFee) || 0) - discount);

  // Create VietQR via API and save qrUrl + orderCode into state
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

  // When selected payment method becomes bank_transfer, auto-create VietQR (call API)
  useEffect(() => {
    async function autoGenerate() {
      try {
        const method = paymentMethods.find(
          (m) => m.id === selectedPaymentMethodId
        );
        if (!method) return;

        if (method.code !== "bank_transfer") {
          // clear any previous QR when switching away
          setQrUrl(null);
          setOrderCode(null);
          setIsPaid(false);
          return;
        }

        // choose first account
        const account =
          method.accounts && method.accounts.length > 0
            ? method.accounts[0]
            : null;
        if (!account) {
          console.warn("No account for bank_transfer method");
          return;
        }

        // if qr already generated for current total/account, skip
        if (qrUrl && orderCode) return;

        // call server to generate qr + orderCode
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

  // Derived values for disabling place order
  const selectedPaymentMethod = paymentMethods.find(
    (m) => m.id === selectedPaymentMethodId
  );
  const requiresPaymentConfirmation =
    selectedPaymentMethod && selectedPaymentMethod.code === "bank_transfer";
  const placeOrderDisabled =
    submitting || (requiresPaymentConfirmation && !isPaid);

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

  function validateStep1() {
    if (!customer.name || !customer.phone) {
      showToast("Vui lòng nhập họ tên và số điện thoại", "error");
      return false;
    }
    // For new address require province/district/line; but we do NOT block saved addresses outside HCMC
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

  // ---------- Address save helper ----------
  async function saveAddress() {
    // client-side validation
    if (!addressForm.line || !addressForm.district || !addressForm.province) {
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

      // update addresses list and select saved address
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

  // ---------- Shipping estimate ----------
  async function estimateShippingFor(addressSnapshot) {
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
        body: JSON.stringify({ items: itemsForApi, subtotal, address: addressSnapshot }),
      });

      if (!res.ok) {
        setShippingFee(0);
        return;
      }

      const data = await res.json();
      setShippingFee(Number(data.shippingFee || 0));
    } catch (err) {
      console.error("estimateShipping error", err);
      setShippingFee(0);
    } finally {
      setEstimatingShipping(false);
    }
  }

  // call estimate when address or subtotal/items change
  useEffect(() => {
    const chosenAddress =
      selectedAddressId === "new"
        ? addressForm
        : addresses.find((a) => a.id === selectedAddressId) || null;

    const addrSnapshot = chosenAddress
      ? { province: chosenAddress.province, district: chosenAddress.district, ward: chosenAddress.ward }
      : null;

    // estimate only when we have items
    if (items.length > 0) {
      estimateShippingFor(addrSnapshot);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedAddressId, addressForm.province, addressForm.district, addressForm.ward, subtotal, JSON.stringify(items)]);

  // ---------- Coupon logic ----------
  async function handleApplyCoupon() {
    const code = (couponInput || "").trim();
    setCouponError(null);
    setCouponLoading(true);
    setAppliedCoupon(null);

    if (!code) {
      setCouponError("Vui lòng nhập mã giảm giá");
      setCouponLoading(false);
      return;
    }

    try {
      const itemsForApi = items.map((it) => ({
        price: it.price,
        quantity: it.quantity,
        categoryId: it.categoryId ?? null,
        brandId: it.brandId ?? null,
      }));

      // validateCoupon calls POST /api/coupons/validate
      const resp = await validateCoupon(code, { items: itemsForApi, subtotal });

      if (!resp) {
        setCouponError("Mã giảm giá không hợp lệ");
        return;
      }

      if (!resp.ok) {
        const reason =
          resp.raw?.error ||
          resp.reason ||
          "Mã không hợp lệ hoặc không áp dụng cho giỏ hàng";
        setCouponError(
          typeof reason === "string"
            ? reason
            : "Mã không hợp lệ hoặc không áp dụng cho giỏ hàng"
        );
        return;
      }

      const matched = resp.coupon;
      if (!matched) {
        setCouponError(
          "Mã giảm giá không hợp lệ hoặc không áp dụng cho giỏ hàng"
        );
        return;
      }

      const computed = Number(resp.computedDiscount || 0);

      setAppliedCoupon({
        ...matched,
        computedDiscount: computed,
        eligibleAmount: Number(resp.eligibleAmount || 0),
      });

      setCouponError(null);
      showToast(
        `Áp dụng mã ${matched.code} — tiết kiệm ${new Intl.NumberFormat(
          "vi-VN",
          {
            style: "currency",
            currency: "VND",
            minimumFractionDigits: 0,
          }
        ).format(computed)}`,
        "success"
      );
    } catch (err) {
      console.error("handleApplyCoupon error:", err);
      setCouponError("Không thể kiểm tra mã. Vui lòng thử lại");
    } finally {
      setCouponLoading(false);
    }
  }

  function handleRemoveCoupon() {
    setAppliedCoupon(null);
    setCouponInput("");
    setCouponError(null);
  }

  // ---------- End coupon logic ----------

  async function handleContinueToPayment() {
    if (!validateStep1()) return;
    setStep(2);
    showToast("Chuyển sang bước Thanh toán", "success");
  }

  // ---------- Place order (calls /api/checkout/create) ----------
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
      if (!isPaid) {
        showToast(
          "Vui lòng xác nhận bạn đã thanh toán bằng nút 'Tôi đã thanh toán' trước khi đặt hàng",
          "error"
        );
        return;
      }
    }

    setSubmitting(true);
    try {
      const chosenAddress =
        selectedAddressId === "new"
          ? addressForm
          : addresses.find((a) => a.id === selectedAddressId) || addressForm;

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

      // idempotency key to reduce duplicate orders (optional)
      const idempotencyKey = `order-${Date.now()}-${Math.random().toString(36).slice(2,9)}`;

      const payload = {
        subtotal,
        // client estimate (server will recompute)
        shippingFee,
        discount: appliedCoupon ? Number(appliedCoupon.computedDiscount || 0) : 0,
        total: Math.max(0, subtotal + (Number(shippingFee) || 0) - (appliedCoupon ? Number(appliedCoupon.computedDiscount || 0) : 0)),
        addressSnapshot: {
          customer: { name: customer.name, phone: customer.phone, email: customer.email },
          address: chosenAddress,
        },
        items: itemsPayload,
        paymentMethodId: selectedPaymentMethodId,
        note,
        couponCode: appliedCoupon ? appliedCoupon.code : undefined,
        paymentMeta: {
          idempotencyKey,
          ...(selectedPaymentMethod && selectedPaymentMethod.code === "bank_transfer" ? { qrUrl, orderCode } : {}),
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
        // handle known server responses
        if (data?.reason) {
          // coupon invalid reason
          showToast(`Coupon lỗi: ${data.reason}`, "error");
          if (String(data.reason).toLowerCase().includes("coupon") || String(data.reason).toLowerCase().includes("min_order") || String(data.reason).toLowerCase().includes("usage")) {
            handleRemoveCoupon();
          }
        } else if (data?.error && String(data.error).toLowerCase().includes("insufficient stock")) {
          showToast(data.error, "error");
        } else if (res.status === 401) {
          showToast("Vui lòng đăng nhập để đặt hàng", "error");
          router.replace("/login?redirect=/checkout");
        } else {
          showToast(data?.error || "Đặt hàng thất bại. Vui lòng thử lại", "error");
        }
        setSubmitting(false);
        return;
      }

      // success
      sessionStorage.removeItem("checkoutItems");
      showToast("Đặt hàng thành công", "success");
      if (data && data.orderId) {
        router.replace(`/order/${data.orderId}`);
      } else {
        router.replace("/order/thank-you");
      }
    } catch (err) {
      console.error("Place order error:", err);
      showToast("Đặt hàng thất bại. Vui lòng thử lại", "error");
    } finally {
      setSubmitting(false);
    }
  }

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

  const firstItem = items[0];
  const otherItems = items.slice(1);

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-3 mb-8">
          <div className="flex items-center gap-2">
            <div
              className={`w-8 h-8 rounded-full ${
                step === 1
                  ? "bg-blue-600 text-white"
                  : "bg-gray-300 text-gray-700"
              } flex items-center justify-center font-semibold`}
            >
              1
            </div>
            <span
              className={`font-medium ${
                step === 1 ? "text-gray-900" : "text-gray-500"
              }`}
            >
              Thông tin
            </span>
          </div>
          <div className="w-12 h-0.5 bg-gray-300" />
          <div className="flex items-center gap-2">
            <div
              className={`w-8 h-8 rounded-full ${
                step === 2
                  ? "bg-blue-600 text-white"
                  : "bg-gray-300 text-gray-700"
              } flex items-center justify-center font-semibold`}
            >
              2
            </div>
            <span
              className={`font-medium ${
                step === 2 ? "text-gray-900" : "text-gray-500"
              }`}
            >
              Thanh toán
            </span>
          </div>
        </div>

        {/* Step 1 */}
        {step === 1 && (
          <div className="space-y-6">
            {/* Products */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Sản phẩm
              </h2>
              {firstItem ? (
                <>
                  <div className="flex items-start gap-4 border-b border-gray-200 pb-4">
                    <div className="w-20 h-20 bg-gray-50 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0">
                      {firstItem.image ? (
                        <img
                          src={`/assets/products/${firstItem.image}`}
                          alt={firstItem.name}
                          className="w-20 h-20 object-cover"
                        />
                      ) : (
                        <div className="text-gray-400">No image</div>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">
                        <a
                          href={`/product/${firstItem.slug}`}
                          className="hover:underline"
                        >
                          {firstItem.name}
                        </a>{" "}
                        {[firstItem.variantName || "", ...(firstItem.specs || [])]
                          .filter(Boolean)
                          .join(" - ")}
                      </div>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-lg font-bold text-red-600">
                          {new Intl.NumberFormat("vi-VN", {
                            style: "currency",
                            currency: "VND",
                            minimumFractionDigits: 0,
                          }).format(firstItem.price)}
                        </span>
                        <span className="text-sm text-gray-600">
                          Số lượng: {firstItem.quantity}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-between">
                    <div className="text-sm text-gray-600">
                      {otherItems.length > 0
                        ? `và ${otherItems.length} sản phẩm khác`
                        : "Chỉ 1 sản phẩm trong giỏ hàng"}
                    </div>
                    {otherItems.length > 0 && (
                      <button
                        onClick={() => setShowOthers((s) => !s)}
                        className="text-sm px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-md border border-gray-200"
                      >
                        {showOthers ? "Thu gọn" : "Hiện thêm"}
                      </button>
                    )}
                  </div>

                  {showOthers && otherItems.length > 0 && (
                    <div className="mt-4 space-y-3 border-t pt-4">
                      {otherItems.map((it) => (
                        <div key={it.id} className="flex items-start gap-3">
                          <div className="w-14 h-14 bg-gray-50 rounded-md flex items-center justify-center overflow-hidden">
                            {it.image ? (
                              <img
                                src={`/assets/products/${it.image}`}
                                alt={it.name}
                                className="w-14 h-14 object-cover"
                              />
                            ) : (
                              <div className="text-gray-400">No image</div>
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="text-sm font-medium text-gray-900">
                              <a
                                href={`/product/${it.slug}`}
                                className="hover:underline"
                              >
                                {it.name}
                              </a>{" "}
                              {[it.variantName || "", ...(it.specs || [])]
                                .filter(Boolean)
                                .join(" - ")}
                            </div>
                            <div className="text-sm text-gray-600">
                              Số lượng: {it.quantity} •{" "}
                              {new Intl.NumberFormat("vi-VN", {
                                style: "currency",
                                currency: "VND",
                                minimumFractionDigits: 0,
                              }).format(it.price)}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <div className="text-gray-600">Không có sản phẩm</div>
              )}
            </div>

            {/* Customer */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Thông tin khách hàng
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field
                  label="Họ tên"
                  value={customer.name}
                  onChange={(v) => setCustomer({ ...customer, name: v })}
                />
                <Field
                  label="Số điện thoại"
                  value={customer.phone}
                  onChange={(v) => setCustomer({ ...customer, phone: v })}
                />
                <Field
                  label="Email"
                  value={customer.email}
                  onChange={(v) => setCustomer({ ...customer, email: v })}
                  className="md:col-span-2"
                />
              </div>
              <p className="text-xs text-gray-500 mt-2">
                (*) Hóa đơn VAT sẽ được gửi qua email này
              </p>
            </div>

            {/* Address selection */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Thông tin nhận hàng
              </h2>

              {addresses.length === 0 ? (
                // No addresses -> show form immediately
                <>
                  <div className="text-sm text-gray-700 font-medium mb-2">
                    Nhập địa chỉ
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Province input (fixed value but editable if you want) */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tỉnh/Thành phố
                      </label>
                      <input
                        value={addressForm.province}
                        onChange={(e) => setAddressForm({ ...addressForm, province: e.target.value })}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-white"
                      />
                    </div>

                    {/* District text input */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Quận/Huyện
                      </label>
                      <input
                        value={addressForm.district}
                        onChange={(e) => setAddressForm({ ...addressForm, district: e.target.value })}
                        placeholder="Nhập quận/huyện"
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-white"
                      />
                    </div>

                    {/* Ward text input */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phường/Xã
                      </label>
                      <input
                        value={addressForm.ward}
                        onChange={(e) => setAddressForm({ ...addressForm, ward: e.target.value })}
                        placeholder="Nhập phường/xã"
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-white"
                      />
                    </div>

                    <Field
                      label="Địa chỉ (số nhà, đường)"
                      value={addressForm.line}
                      onChange={(v) =>
                        setAddressForm({ ...addressForm, line: v })
                      }
                      className="md:col-span-2"
                    />
                  </div>

                  <div className="mt-3 flex gap-3">
                    <button
                      className="px-4 py-2 bg-green-600 text-white rounded"
                      onClick={saveAddress}
                      disabled={savingAddress}
                    >
                      {savingAddress ? "Đang lưu..." : "Lưu địa chỉ"}
                    </button>

                    <button
                      className="px-4 py-2 bg-gray-100 rounded"
                      onClick={() => {
                        setSelectedAddressId("new");
                        setAddressForm({
                          line: "",
                          ward: "",
                          district: "",
                          province: HCMC_PROVINCE,
                          isDefault: addresses.length === 0,
                        });
                      }}
                    >
                      Hủy
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div className="mb-4">
                    <div className="text-sm text-gray-700 font-medium mb-2">
                      Địa chỉ đã lưu
                    </div>
                    <ul className="space-y-2">
                      {addresses.map((ad) => (
                        <li
                          key={ad.id}
                          className="p-3 border rounded-lg bg-white flex items-start gap-3"
                        >
                          <input
                            type="radio"
                            name="selectedAddress"
                            checked={selectedAddressId === ad.id}
                            onChange={() => {
                              setSelectedAddressId(ad.id);
                              setAddressForm({
                                line: ad.line || "",
                                ward: ad.ward || "",
                                district: ad.district || "",
                                province: ad.province || HCMC_PROVINCE,
                                isDefault: !!ad.isDefault,
                              });
                            }}
                            className="mt-1"
                          />
                          <div className="flex-1">
                            <div className="text-sm font-medium text-gray-900">
                              {ad.line}
                            </div>
                            <div className="text-sm text-gray-600">
                              {[ad.ward, ad.district, ad.province]
                                .filter(Boolean)
                                .join(", ")}
                            </div>
                          </div>
                        </li>
                      ))}
                      <li className="p-3 border rounded-lg cursor-pointer bg-white flex items-start gap-3">
                        <input
                          type="radio"
                          name="selectedAddress"
                          checked={selectedAddressId === "new"}
                          onChange={() => {
                            setSelectedAddressId("new");
                            setAddressForm({
                              line: "",
                              ward: "",
                              district: "",
                              province: HCMC_PROVINCE,
                              isDefault: false,
                            });
                          }}
                          className="mt-1"
                        />
                        <div className="flex-1">
                          <div className="text-sm font-medium text-gray-900">
                            Nhập địa chỉ mới
                          </div>
                          <div className="text-sm text-gray-600">
                            Bạn có thể nhập địa chỉ mới để giao hàng
                          </div>
                        </div>
                      </li>
                    </ul>
                  </div>

                  {selectedAddressId === "new" && (
                    <>
                      <div className="text-sm text-gray-700 font-medium mb-2">
                        Nhập địa chỉ
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Tỉnh/Thành phố
                          </label>
                          <input
                            value={addressForm.province}
                            onChange={(e) => setAddressForm({ ...addressForm, province: e.target.value })}
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-white"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Quận/Huyện
                          </label>
                          <input
                            value={addressForm.district}
                            onChange={(e) => setAddressForm({ ...addressForm, district: e.target.value })}
                            placeholder="Nhập quận/huyện"
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-white"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Phường/Xã
                          </label>
                          <input
                            value={addressForm.ward}
                            onChange={(e) => setAddressForm({ ...addressForm, ward: e.target.value })}
                            placeholder="Nhập phường/xã"
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-white"
                          />
                        </div>

                        <Field
                          label="Địa chỉ (số nhà, đường)"
                          value={addressForm.line}
                          onChange={(v) =>
                            setAddressForm({ ...addressForm, line: v })
                          }
                          className="md:col-span-2"
                        />
                      </div>

                      <div className="mt-3 flex gap-3">
                        <button
                          className="px-4 py-2 bg-green-600 text-white rounded"
                          onClick={saveAddress}
                          disabled={savingAddress}
                        >
                          {savingAddress ? "Đang lưu..." : "Lưu địa chỉ"}
                        </button>

                        <button
                          className="px-4 py-2 bg-gray-100 rounded"
                          onClick={() => {
                            const defaultAddr =
                              addresses.find((a) => a.isDefault) || addresses[0];
                            if (defaultAddr) {
                              setSelectedAddressId(defaultAddr.id);
                              setAddressForm({
                                line: defaultAddr.line || "",
                                ward: defaultAddr.ward || "",
                                district: defaultAddr.district || "",
                                province: defaultAddr.province || HCMC_PROVINCE,
                                isDefault: !!defaultAddr.isDefault,
                              });
                            } else {
                              setSelectedAddressId("new");
                              setAddressForm({
                                line: "",
                                ward: "",
                                district: "",
                                province: HCMC_PROVINCE,
                                isDefault: addresses.length === 0,
                              });
                            }
                          }}
                        >
                          Hủy
                        </button>
                      </div>
                    </>
                  )}
                </>
              )}
            </div>

            {/* Summary + actions */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex-1">
                  <div className="text-sm text-gray-700">Tổng tiền tạm tính</div>
                  <div className="mt-2">
                    <span className="text-2xl font-bold text-red-600">
                      {new Intl.NumberFormat("vi-VN", {
                        style: "currency",
                        currency: "VND",
                        minimumFractionDigits: 0,
                      }).format(total)}
                    </span>
                    <div className="text-sm text-gray-500 mt-1">
                      Phí vận chuyển sẽ được tính khi chọn địa chỉ
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setShowReviewItems((s) => !s)}
                    className="px-4 py-2 border rounded-md text-sm bg-white hover:bg-gray-50"
                  >
                    {showReviewItems ? "Ẩn kiểm tra sản phẩm" : "Kiểm tra lại sản phẩm"}
                  </button>
                  <button
                    onClick={handleContinueToPayment}
                    className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-md"
                  >
                    Tiếp tục
                  </button>
                </div>
              </div>

              {showReviewItems && (
                <div className="mt-4 border-t pt-4">
                  <h3 className="text-sm font-semibold text-gray-900 mb-3">
                    Sản phẩm trong đơn
                  </h3>
                  <div className="space-y-3">
                    {items.map((it) => (
                      <div
                        key={it.id || `${it.variantId}-${it.name}`}
                        className="flex items-center gap-4 p-3 rounded-md border bg-gray-50"
                      >
                        <div className="w-16 h-16 bg-white rounded overflow-hidden flex-shrink-0 flex items-center justify-center">
                          {it.image ? (
                            <img
                              src={`/assets/products/${it.image}`}
                              alt={it.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="text-gray-400 text-xs">No image</div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-gray-900 truncate">
                            {it.name} {it.variantName ? `— ${it.variantName}` : ""}
                          </div>
                          <div className="text-xs text-gray-600 mt-1">
                            {[...(it.specs || [])].join(" • ")}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-gray-700">
                            Số lượng: <span className="font-medium">{it.quantity}</span>
                          </div>
                          <div className="text-sm text-gray-900 font-bold mt-1">
                            {new Intl.NumberFormat("vi-VN", {
                              style: "currency",
                              currency: "VND",
                              minimumFractionDigits: 0,
                            }).format(it.price)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Step 2: Payment */}
        {step === 2 && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Phương thức thanh toán
                </h2>
                <div className="space-y-3">
                  {paymentMethods.map((m) => (
                    <label
                      key={m.id}
                      className={`flex items-start gap-3 p-3 border rounded-lg cursor-pointer transition ${
                        selectedPaymentMethodId === m.id
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 bg-white"
                      }`}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        checked={selectedPaymentMethodId === m.id}
                        onChange={() => {
                          setSelectedPaymentMethodId(m.id);
                          setQrUrl(null);
                          setOrderCode(null);
                          setIsPaid(false);
                        }}
                        className="mt-1"
                      />
                      <div className="flex-1">
                        <div className="font-medium text-gray-900">{m.name}</div>
                        <div className="text-sm text-gray-600">{m.description}</div>
                        {m.accounts?.length > 0 && (
                          <div className="mt-3">
                            <div className="text-sm font-medium text-gray-700 mb-2">
                              Tài khoản nhận tiền:
                            </div>
                            <ul className="space-y-2">
                              {m.accounts.map((acc) => (
                                <li key={acc.id} className="text-sm text-gray-700">
                                  <span className="font-medium">{acc.accountName}</span> • {acc.bankName ? `${acc.bankName} - ${acc.bankBranch || ""}` : "Ví/khác"} • <span className="font-mono">{acc.accountNumber}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </label>
                  ))}
                </div>

                {/* Bank transfer UI (auto QR created) */}
                {paymentMethods &&
                  selectedPaymentMethodId &&
                  (() => {
                    const method = paymentMethods.find(
                      (m) => m.id === selectedPaymentMethodId
                    );
                    if (!method) return null;
                    if (method.code === "bank_transfer") {
                      const account =
                        method.accounts && method.accounts.length > 0
                          ? method.accounts[0]
                          : null;
                      return (
                        <div className="bg-white rounded-lg shadow-sm p-4 mt-4">
                          <div className="font-medium mb-2">Chuyển khoản ngân hàng</div>
                          {account ? (
                            <div className="text-sm text-gray-700 mb-3">
                              <div><strong>{account.accountName}</strong></div>
                              <div>Số tài khoản: <span className="font-mono">{account.accountNumber}</span></div>
                              <div>Ngân hàng: {account.bankName} {account.bankBranch ? `- ${account.bankBranch}` : ""}</div>
                            </div>
                          ) : <div className="text-sm text-gray-500 mb-3">Không có tài khoản nhận tiền.</div>}

                          <div className="flex items-center gap-3">
                            {generatingQr ? <div className="text-sm text-gray-600">Đang tạo mã QR…</div> : null}
                            {qrUrl && (
                              <button onClick={() => setIsPaid(true)} className={`px-4 py-2 ${isPaid ? "bg-green-600 text-white" : "bg-gray-100"} rounded-md`}>
                                {isPaid ? "Đã xác nhận thanh toán" : "Tôi đã thanh toán"}
                              </button>
                            )}
                          </div>

                          {qrUrl && (
                            <div className="mt-4">
                              <div className="text-sm text-gray-600 mb-2">
                                Quét mã QR để chuyển khoản (số tiền: {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND", minimumFractionDigits: 0 }).format(total)})
                              </div>
                              <img src={qrUrl} alt="VietQR" className="w-full h-auto object-contain border rounded" />
                              <div className="text-xs text-gray-500 mt-2">Mã giao dịch: {orderCode}</div>
                            </div>
                          )}
                        </div>
                      );
                    }
                    return null;
                  })()}
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Ghi chú đơn hàng (tuỳ chọn)</label>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  rows={3}
                  placeholder="Ví dụ: Giao trong giờ hành chính, liên hệ trước khi giao…"
                />
              </div>
            </div>

            {/* Order summary + coupon box */}
            <div className="space-y-4">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Tóm tắt đơn hàng</h3>

                <div className="space-y-3">
                  <SummaryRow label="Tạm tính" value={new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND", minimumFractionDigits: 0 }).format(subtotal)} />
                  <SummaryRow
                    label="Phí vận chuyển"
                    value={estimatingShipping ? "Đang ước tính..." : new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND", minimumFractionDigits: 0 }).format(shippingFee)}
                  />

                  {/* Coupon input */}
                  <div className="pt-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Mã giảm giá</label>
                    <div className="flex gap-2">
                      <input
                        value={couponInput}
                        onChange={(e) => setCouponInput(e.target.value)}
                        className="flex-1 px-3 py-2 border rounded-md"
                        placeholder="Nhập mã giảm giá (nếu có)"
                      />
                      <button
                        onClick={handleApplyCoupon}
                        disabled={couponLoading}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md"
                      >
                        {couponLoading ? "Đang kiểm tra..." : "Áp dụng"}
                      </button>
                    </div>
                    {couponError && <div className="text-sm text-red-600 mt-2">{couponError}</div>}
                    {appliedCoupon && (
                      <div className="text-sm text-green-600 mt-2">
                        Đã áp dụng: <strong>{appliedCoupon.code}</strong> • Tiết kiệm {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND", minimumFractionDigits: 0 }).format(Number(appliedCoupon.computedDiscount || 0))}{" "}
                        <button onClick={handleRemoveCoupon} className="ml-2 text-sm text-blue-600">Bỏ</button>
                      </div>
                    )}
                  </div>

                  <SummaryRow label="Giảm giá" value={new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND", minimumFractionDigits: 0 }).format(discount)} />
                  <div className="h-px bg-gray-200 my-2" />
                  <SummaryRow label="Tổng cộng" value={new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND", minimumFractionDigits: 0 }).format(total)} strong />
                </div>
              </div>

              <button
                disabled={placeOrderDisabled}
                onClick={handlePlaceOrder}
                className={`w-full ${placeOrderDisabled ? "bg-gray-400 cursor-not-allowed" : "bg-red-600 hover:bg-red-700"} text-white font-semibold py-3.5 px-6 rounded-lg`}
              >
                {submitting ? "Đang xử lý..." : requiresPaymentConfirmation && !isPaid ? "Xác nhận thanh toán để đặt hàng" : "Đặt hàng"}
              </button>

              {requiresPaymentConfirmation && !isPaid && (
                <div className="text-sm text-gray-500 mt-2">
                  Vui lòng quét mã VietQR và nhấn "Tôi đã thanh toán" sau khi chuyển khoản để tiếp tục đặt hàng.
                </div>
              )}

              <button onClick={() => setStep(1)} className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3.5 px-6 rounded-lg mt-2">
                Quay lại nhập thông tin
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* UI helpers */

function Field({ label, value, onChange, className = "" }) {
  return (
    <div className={className}>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <input
        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

function SummaryRow({ label, value, strong }) {
  return (
    <div className="flex justify-between text-sm">
      <span className={`text-gray-700 ${strong ? "font-semibold" : "font-medium"}`}>
        {label}
      </span>
      <span className={`text-gray-900 ${strong ? "font-bold text-base" : ""}`}>
        {value}
      </span>
    </div>
  );
}
