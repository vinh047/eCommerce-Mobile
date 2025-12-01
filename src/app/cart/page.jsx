"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
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
import { getCart, removeItem, updateItemQuantity } from "@/lib/api/cartsApi";
import "./CartStyles.css";
import { toast } from "sonner";

export default function CartPage() {
  const router = useRouter();

  const [cartState, setCartState] = useState("loading"); // loading, empty, error, success
  const [cartData, setCartData] = useState({
    items: [],
    shipping: 0,
  });

  const [selectedItems, setSelectedItems] = useState([]);

  useEffect(() => {
    loadCart();
  }, []);

  useEffect(() => {
    if (cartData.items.length > 0) {
      setSelectedItems(cartData.items.map((item) => item.id));
    }
  }, [cartData.items]);

  const isAllSelected =
    cartData.items.length > 0 && selectedItems.length === cartData.items.length;

  const loadCart = async () => {
    try {
      setCartState("loading");
      const data = await getCart(); // gọi API
      if (!data || !data.items || data.items.length === 0) {
        setCartState("empty");
      } else {
        setCartData(data);
        setCartState("success");
      }
    } catch (err) {
      console.error("Error loading cart:", err);
      setCartState("error");
    }
  };

  const handleSelectAll = () => {
    if (isAllSelected) {
      setSelectedItems([]);
    } else {
      setSelectedItems(cartData.items.map((item) => item.id));
    }
  };

  const handleSelectItem = (id) => {
    if (selectedItems.includes(id)) {
      setSelectedItems((prev) => prev.filter((itemId) => itemId !== id));
    } else {
      setSelectedItems((prev) => [...prev, id]);
    }
  };

  const handleUpdateQuantity = async (itemId, change) => {
    try {
      setCartData((prev) => {
        const updatedItems = prev.items.map((item) => {
          if (item.id === itemId) {
            const newQuantity = item.quantity + change;
            if (newQuantity < 1) return item;
            return { ...item, quantity: newQuantity };
          }
          return item;
        });
        return { ...prev, items: updatedItems };
      });

      // Lấy số lượng mới từ state sau khi thay đổi
      const currentItem = cartData.items.find((i) => i.id === itemId);
      if (!currentItem) return;
      const newQuantity = currentItem.quantity + change;

      if (newQuantity >= 1) {
        await updateItemQuantity(itemId, newQuantity);
      }
    } catch (error) {
      console.error("Error updating quantity:", error);
      showNotification("Cập nhật số lượng thất bại", "error");
    }
  };

  // 👇 sửa: thêm options.silent để dùng cho trường hợp xoá tự động vì hết hàng
  const handleRemoveItem = async (itemId, options = { silent: false }) => {
    try {
      // gọi API xóa
      await removeItem(itemId);

      // hiệu ứng xoá trên UI
      const itemElement = document.querySelector(`[data-item-id="${itemId}"]`);
      itemElement?.classList.add("removing");

      setTimeout(() => {
        setCartData((prev) => {
          const updatedItems = prev.items.filter((item) => item.id !== itemId);
          if (updatedItems.length === 0) setCartState("empty");
          return { ...prev, items: updatedItems };
        });
        setSelectedItems((prev) => prev.filter((id) => id !== itemId));

        // chỉ show toast khi user tự xoá
        if (!options.silent) {
          showNotification("Đã xóa sản phẩm khỏi giỏ hàng", "success");
        }
      }, 300);
    } catch (error) {
      console.error("Error removing item:", error);
      showNotification("Xóa sản phẩm thất bại", "error");
    }
  };

  const subtotal = cartData.items
    .filter((item) => selectedItems.includes(item.id))
    .reduce((total, item) => total + item.price * item.quantity, 0);

  const total = formatPrice(Math.max(0, subtotal + cartData.shipping));

  const handleCheckout = async () => {
    if (selectedItems.length === 0) {
      toast.error("Vui lòng chọn ít nhất một sản phẩm để thanh toán");
      return;
    }

    // ======= LẤY DANH SÁCH CART ITEM ĐƯỢC CHỌN =======
    const checkoutItems = cartData.items.filter((item) =>
      selectedItems.includes(item.id)
    );

    const cartItemIds = checkoutItems.map((it) => it.id);

    // ======= GỌI API CHECK STOCK =======
    try {
      const res = await fetch("/api/cart/check-stock", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ cartItemIds }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data?.message || "Không kiểm tra được tồn kho");
        return;
      }

      const { outOfStock = [], notEnough = [] } = data;

      // ====== HANDLE HẾT SẠCH HÀNG: XÓA KHỎI CART ======
      if (outOfStock.length > 0) {
        for (const item of outOfStock) {
          try {
            // xoá nhưng không hiện toast "Đã xóa sản phẩm khỏi giỏ hàng"
            await handleRemoveItem(item.cartItemId, { silent: true });
          } catch (e) {
            console.error("removeItem error:", e);
          }
        }

        // thông báo rõ lý do
        outOfStock.forEach((item) => {
          toast.error(
            `"${item.name}" hiện đã hết hàng và đã được xóa khỏi giỏ`
          );
        });

        // dừng, không cho đi tiếp
        return;
      }

      // ====== HANDLE KHÔNG ĐỦ HÀNG: GIẢM SỐ LƯỢNG VỀ MỨC CÒN LẠI ======
      if (notEnough.length > 0) {
        for (const item of notEnough) {
          try {
            await updateItemQuantity(item.cartItemId, item.available);
          } catch (e) {
            console.error("updateItemQuantity error:", e);
          }
        }

        // update state trên FE
        setCartData((prev) => {
          const updatedItems = prev.items.map((it) => {
            const match = notEnough.find((n) => n.cartItemId === it.id);
            if (!match) return it;
            return { ...it, quantity: match.available };
          });
          return { ...prev, items: updatedItems };
        });

        notEnough.forEach((item) => {
          toast.error(
            `"${item.name}" chỉ còn ${item.available} sản phẩm, đã tự động cập nhật lại từ ${item.requested}`
          );
        });

        // dừng, yêu cầu user xem lại rồi bấm thanh toán lại
        return;
      }
    } catch (err) {
      console.error("check stock error:", err);
      toast.error("Không thể kiểm tra tồn kho. Vui lòng thử lại");
      return;
    }

    // ====== OK → LƯU CHECKOUT & CHUYỂN TRANG ======
    try {
      const payload = {
        items: checkoutItems.map((item) => ({
          ...item,
          cartItemId: item.id,
        })),
        createdAt: new Date().toISOString(),
      };

      sessionStorage.setItem("checkoutItems", JSON.stringify(payload));

      toast.success("Chuyển đến trang thanh toán...");

      router.push("/checkout");
    } catch (err) {
      console.error("checkout error:", err);
      toast.error("Không thể chuyển đến trang thanh toán");
    }
  };

  return (
    <div className="bg-gray-50">
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
              {/* --- CHECKBOX CHỌN TẤT CẢ --- */}
              <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="selectAll"
                    checked={isAllSelected}
                    onChange={handleSelectAll}
                    className="w-5 h-5 accent-blue-600 rounded-md border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150 ease-in-out cursor-pointer"
                  />
                  <label
                    htmlFor="selectAll"
                    className="ml-3 text-sm font-medium text-gray-700 cursor-pointer select-none"
                  >
                    Chọn tất cả ({cartData.items.length} sản phẩm)
                  </label>
                </div>
                <button
                  onClick={() => {
                    selectedItems.forEach((id) => handleRemoveItem(id));
                  }}
                  disabled={selectedItems.length === 0}
                  className="text-sm text-red-600 hover:text-red-800 disabled:text-gray-400 cursor-pointer"
                >
                  Xóa đã chọn
                </button>
              </div>

              {cartData.items.map((item) => (
                <CartItem
                  key={item.id}
                  item={item}
                  isSelected={selectedItems.includes(item.id)}
                  onToggleSelect={() => handleSelectItem(item.id)}
                  onUpdateQuantity={handleUpdateQuantity}
                  onRemove={handleRemoveItem}
                />
              ))}

              {/* Continue Shopping */}
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
              shipping={cartData.shipping}
              onCheckout={handleCheckout}
              isDisabled={selectedItems.length === 0}
            />
          </div>
        )}
      </main>

      {cartState === "success" && (
        <CartMobileCheckout
          total={total}
          onCheckout={handleCheckout}
          disabled={selectedItems.length === 0}
        />
      )}
    </div>
  );
}
