"use client";

import { useState, useEffect } from "react";
// *** MODIFIED: Import axiosClient ***
// (Hãy đảm bảo đường dẫn này đúng với cấu trúc dự án của bạn)
import axiosClient from "@/lib/api/axiosClient"; // Giả sử file ở /lib/axiosClient.js
// ---
import CartHeader from "@/components/Cart/CartHeader";
import CartBreadcrumb from "@/components/Cart/CartBreadcrumb";
import CartItem from "@/components/Cart/CartItem";
import CartSummary from "@/components/Cart/CartSummary";
import CartMobileCheckout from "@/components/Cart/CartMobileCheckout";
import {
  LoadingState,
  EmptyState,
  ErrorState,
} from "@/components/Cart/CartStates";
import { formatPrice, showNotification } from "@/utils/format";
import "./CartStyles.css";

export default function CartPage() {
  const [cartState, setCartState] = useState("loading"); // loading, empty, error, success
  const [cartData, setCartData] = useState({
    items: [],
    coupon: null,
    discount: 0,
    shipping: 0,
  });

  useEffect(() => {
    loadCart();
  }, []);

  // *** MODIFIED: Kết nối API để tải giỏ hàng ***
  const loadCart = async () => {
    setCartState("loading");
    try {
      // 1. GỌI API ĐỂ LẤY GIỎ HÀNG
      const response = await axiosClient.get("/cart"); // URL API của bạn
      const initialData = response.data;

      if (initialData.items.length === 0) {
        setCartState("empty");
      } else {
        setCartData(initialData);
        setCartState("success");
      }
    } catch (error) {
      console.error("Failed to load cart:", error);
      setCartState("error");
    }
  };

  // *** MODIFIED: Kết nối API để cập nhật số lượng ***
  const handleUpdateQuantity = async (itemId, change) => {
    const originalItems = [...cartData.items];
    let newQuantity = 0;

    // 1. Cập nhật UI trước (Optimistic Update)
    setCartData((prev) => {
      const updatedItems = prev.items.map((item) => {
        if (item.id === itemId) {
          newQuantity = item.quantity + change;
          if (newQuantity < 1) return item; // Không giảm dưới 1
          if (newQuantity > 10) {
            showNotification("Số lượng tối đa là 10", "error");
            return item;
          }
          return { ...item, quantity: newQuantity };
        }
        return item;
      });
      return { ...prev, items: updatedItems };
    });

    // Nếu số lượng không hợp lệ, không gọi API
    if (newQuantity < 1 || newQuantity > 10) return;

    try {
      // 2. GỌI API ĐỂ CẬP NHẬT
      const response = await axiosClient.post("/cart/update", {
        itemId,
        quantity: newQuantity,
      });

      // 3. Đồng bộ lại state với dữ liệu trả về từ server (để đảm bảo chính xác)
      setCartData(response.data);
      showNotification("Đã cập nhật số lượng", "success");
    } catch (error) {
      console.error("Failed to update quantity:", error);
      // 4. NẾU LỖI: Khôi phục lại trạng thái ban đầu
      setCartData((prev) => ({ ...prev, items: originalItems }));
      showNotification("Lỗi cập nhật số lượng", "error");
    }
  };

  // *** MODIFIED: Kết nối API để xóa sản phẩm ***
  const handleRemoveItem = async (itemId) => {
    const itemElement = document.querySelector(`[data-item-id="${itemId}"]`);
    const originalItems = [...cartData.items]; // Lưu lại để khôi phục nếu lỗi

    try {
      // 1. GỌI API ĐỂ XÓA
      const response = await axiosClient.post("/cart/remove", { itemId });

      // 2. Bắt đầu hiệu ứng (nếu API thành công)
      itemElement?.classList.add("removing");

      // 3. Đợi hiệu ứng kết thúc rồi cập nhật UI từ data của server
      setTimeout(() => {
        setCartData(response.data); // Đồng bộ state với server
        if (response.data.items.length === 0) {
          setCartState("empty");
        }
        showNotification("Đã xóa sản phẩm khỏi giỏ hàng", "success");
      }, 300); // 300ms khớp với CSS transition
    } catch (error) {
      console.error("Failed to remove item:", error);
      showNotification("Lỗi xóa sản phẩm", "error");
      // Nếu lỗi, đảm bảo item không bị xóa khỏi UI
      itemElement?.classList.remove("removing");
      setCartData((prev) => ({ ...prev, items: originalItems }));
    }
  };

  // *** MODIFIED: Kết nối API để áp dụng mã giảm giá ***
  const handleApplyCoupon = async (event) => {
    event.preventDefault();
    const couponInput = document.getElementById("couponInput");
    const couponCode = couponInput.value.trim().toUpperCase();
    const errorDiv = document.getElementById("couponError");
    const successDiv = document.getElementById("couponSuccess");

    errorDiv.classList.add("hidden");
    successDiv.classList.add("hidden");

    if (!couponCode) {
      errorDiv.textContent = "Vui lòng nhập mã giảm giá";
      errorDiv.classList.remove("hidden");
      return;
    }

    try {
      // 1. GỌI API ĐỂ ÁP DỤNG MÃ
      const response = await axiosClient.post("/cart/apply-coupon", {
        couponCode,
      });
      const data = response.data; // { cart: newCartData, message: 'Áp dụng thành công!' }

      // 2. Cập nhật toàn bộ giỏ hàng với dữ liệu mới (giảm giá, phí ship...)
      setCartData(data.cart);

      // 3. Hiển thị thông báo thành công từ API
      successDiv.textContent = data.message;
      successDiv.classList.remove("hidden");
      couponInput.value = "";
      couponInput.classList.add("success-animation");
      setTimeout(() => couponInput.classList.remove("success-animation"), 600);
    } catch (error) {
      console.error("Failed to apply coupon:", error);
      // 4. Hiển thị lỗi từ server (nếu có)
      const message =
        error.response?.data?.message || "Mã giảm giá không hợp lệ";
      errorDiv.textContent = message;
      errorDiv.classList.remove("hidden");
      couponInput.classList.add("error-shake");
      setTimeout(() => couponInput.classList.remove("error-shake"), 500);
    }
  };

  // *** MODIFIED: Kết nối API để checkout ***
  const handleCheckout = async () => {
    const items = Array.isArray(cartData.items) ? cartData.items : [];
    if (!items.length) {
      showNotification?.("Giỏ hàng trống", "error");
      return;
    }
    try {
      const res = await axiosClient.post("/api/checkout/create-session");
      const url = res?.data?.checkoutUrl;
      if (!url) {
        showNotification?.("Không tạo được phiên thanh toán", "error");
        return;
      }
      window.location.href = url; // vd: /checkout/ORD-XXXXXXX
    } catch (e) {
      console.error("create-session failed:", e);
      showNotification?.("Có lỗi xảy ra, không thể thanh toán", "error");
    }
  };

  // (Phần còn lại của file giữ nguyên)
  const subtotal = cartData.items.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
  const total = formatPrice(subtotal - cartData.discount + cartData.shipping);

  return (
    <div className="bg-gray-50">
      <CartHeader />
      <CartBreadcrumb />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-32 lg:pb-6">
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            Giỏ hàng của bạn
          </h1>
          <p className="text-gray-600 mt-1">
            Xem lại và chỉnh sửa đơn hàng trước khi thanh toán
          </p>
        </div>

        {cartState === "loading" && <LoadingState />}
        {cartState === "empty" && <EmptyState />}
        {cartState === "error" && <ErrorState onRetry={loadCart} />}
        {cartState === "success" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              {cartData.items.map((item) => (
                <CartItem
                  key={item.id}
                  item={item}
                  onUpdateQuantity={handleUpdateQuantity}
                  onRemove={handleRemoveItem}
                />
              ))}

              <div className="pt-4">
                <a
                  href="/"
                  className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium focus-ring rounded"
                >
                  <svg
                    className="w-4 h-4 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15 19l-7-7 7-7"
                    ></path>
                  </svg>
                  Tiếp tục mua sắm
                </a>
              </div>
            </div>

            <CartSummary
              subtotal={subtotal}
              discount={cartData.discount}
              shipping={cartData.shipping}
              onApplyCoupon={handleApplyCoupon}
              onCheckout={handleCheckout}
            />
          </div>
        )}
      </main>

      {cartState === "success" && (
        <CartMobileCheckout total={total} onCheckout={handleCheckout} />
      )}
    </div>
  );
}
