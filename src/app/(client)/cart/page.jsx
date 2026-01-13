"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ShoppingBag, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/form/Button"; 

// Import Framer Motion
import { motion, AnimatePresence } from "framer-motion";

import CartItem from "@/components/Cart/CartItem";
import CartSummary from "@/components/Cart/CartSummary";
import CartMobileCheckout from "@/components/Cart/CartMobileCheckout";
import HeaderLayout from "@/components/Layout/HeaderLayout";
import {
  LoadingState,
  EmptyState,
  ErrorState,
} from "@/components/Cart/CartStates";
import { formatPrice } from "@/utils/format";
import { getCart, removeItem, updateItemQuantity } from "@/lib/api/cartsApi";
import "./CartStyles.css";

import { ROUTES } from "@/config/routes";

export default function CartPage() {
  const router = useRouter();
  const [cartState, setCartState] = useState("loading");
  const [cartData, setCartData] = useState({ items: [], shipping: 0 });
  const [selectedItems, setSelectedItems] = useState([]);

  useEffect(() => {
    loadCart();
  }, []);

  useEffect(() => {
    if (cartData.items.length > 0) {
      setSelectedItems(cartData.items.map((item) => item.id));
    }
  }, [cartData.items.length]);

  const isAllSelected =
    cartData.items.length > 0 && selectedItems.length === cartData.items.length;

  const loadCart = async () => {
    try {
      setCartState("loading");
      const data = await getCart();
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
    if (isAllSelected) setSelectedItems([]);
    else setSelectedItems(cartData.items.map((item) => item.id));
  };

  const handleSelectItem = (id) => {
    if (selectedItems.includes(id))
      setSelectedItems((prev) => prev.filter((itemId) => itemId !== id));
    else setSelectedItems((prev) => [...prev, id]);
  };

  const handleUpdateQuantity = async (itemId, change) => {
    // ... (Giữ nguyên logic cũ)
    try {
      setCartData((prev) => {
        const updatedItems = prev.items.map((item) => {
          if (item.id === itemId) {
            const newQuantity = Math.max(1, item.quantity + change);
            return { ...item, quantity: newQuantity };
          }
          return item;
        });
        return { ...prev, items: updatedItems };
      });

      const currentItem = cartData.items.find((i) => i.id === itemId);
      if (!currentItem) return;
      const newQuantity = currentItem.quantity + change;

      if (newQuantity >= 1) await updateItemQuantity(itemId, newQuantity);
    } catch (error) {
      console.error("Error updating quantity:", error);
      toast.error("Cập nhật số lượng thất bại");
      loadCart();
    }
  };

  // --- SỬA LOGIC XÓA ĐỂ TƯƠNG THÍCH FRAMER MOTION ---
  const handleRemoveItem = async (itemId, options = { silent: false }) => {
    try {
      // 1. Gọi API xóa ngầm
      await removeItem(itemId);

      // 2. Cập nhật State NGAY LẬP TỨC
      // (AnimatePresence sẽ giữ element lại trong DOM để chạy animation exit rồi mới xóa thật)
      setCartData((prev) => {
        const updatedItems = prev.items.filter((item) => item.id !== itemId);
        if (updatedItems.length === 0) setCartState("empty");
        return { ...prev, items: updatedItems };
      });
      setSelectedItems((prev) => prev.filter((id) => id !== itemId));

      if (!options.silent) toast.success("Đã xóa sản phẩm");
    } catch (error) {
      console.error("Error removing item:", error);
      toast.error("Xóa sản phẩm thất bại");
    }
  };
  // ----------------------------------------------------

  const subtotal = cartData.items
    .filter((item) => selectedItems.includes(item.id))
    .reduce((total, item) => total + item.price * item.quantity, 0);

  const total = formatPrice(Math.max(0, subtotal + cartData.shipping));

  const handleCheckout = async () => {
    // ... (Giữ nguyên logic cũ)
    if (selectedItems.length === 0) {
      toast.error("Vui lòng chọn sản phẩm để thanh toán");
      return;
    }
    const checkoutItems = cartData.items.filter((item) =>
      selectedItems.includes(item.id)
    );
    const cartItemIds = checkoutItems.map((it) => it.id);

    try {
      const res = await fetch("/api/cart/check-stock", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cartItemIds }),
      });
      const data = await res.json();

      if (!res.ok) {
        toast.error(data?.message || "Lỗi kiểm tra tồn kho");
        return;
      }

      const { outOfStock = [], notEnough = [] } = data;

      if (outOfStock.length > 0) {
        for (const item of outOfStock) {
          await handleRemoveItem(item.cartItemId, { silent: true });
        }
        toast.error("Một số sản phẩm đã hết hàng và bị xóa khỏi giỏ");
        return;
      }

      if (notEnough.length > 0) {
        // Logic update quantity khi thiếu hàng (giữ nguyên)
        for (const item of notEnough) {
          await updateItemQuantity(item.cartItemId, item.available);
        }
        setCartData((prev) => ({
          ...prev,
          items: prev.items.map((it) => {
            const match = notEnough.find((n) => n.cartItemId === it.id);
            return match ? { ...it, quantity: match.available } : it;
          }),
        }));
        toast.warning(
          "Số lượng sản phẩm đã được cập nhật theo tồn kho thực tế"
        );
        return;
      }

      const payload = {
        items: checkoutItems.map((item) => ({ ...item, cartItemId: item.id })),
        createdAt: new Date().toISOString(),
      };
      sessionStorage.setItem("checkoutItems", JSON.stringify(payload));
      router.push(ROUTES.CHECKOUT);
    } catch (err) {
      console.error("Checkout error:", err);
      toast.error("Có lỗi xảy ra, vui lòng thử lại");
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen pb-20 lg:pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="flex items-center gap-2 mb-6">
          <div className="lg:hidden">
            <Button as={Link} href={ROUTES.HOME} ghost iconOnly size="sm">
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </Button>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <ShoppingBag className="w-6 h-6 text-blue-600" />
            Giỏ hàng
            <span className="text-base font-normal text-gray-500">
              ({cartData.items.length} sản phẩm)
            </span>
          </h1>
        </div>

        {cartState === "loading" && <LoadingState />}

        {/* Animation cho Empty State */}
        {cartState === "empty" && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <EmptyState />
          </motion.div>
        )}

        {cartState === "error" && <ErrorState onRetry={loadCart} />}

        {cartState === "success" && (
          <div className="flex flex-col lg:flex-row gap-8 items-start">
            {/* --- LEFT COLUMN --- */}
            <div className="flex-1 w-full space-y-4">
              {/* Selection Bar */}
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white px-5 py-3 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between sticky top-[70px] lg:static z-10"
              >
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="selectAll"
                    checked={isAllSelected}
                    onChange={handleSelectAll}
                    className="w-5 h-5 accent-blue-600 rounded cursor-pointer"
                  />
                  <label
                    htmlFor="selectAll"
                    className="text-sm font-medium text-gray-700 cursor-pointer select-none"
                  >
                    Chọn tất cả ({cartData.items.length})
                  </label>
                </div>
                {selectedItems.length > 0 && (
                  <Button
                    ghost
                    danger
                    size="sm"
                    className="text-red-600! hover:text-red-700! hover:bg-red-50! font-medium!"
                    onClick={() =>
                      selectedItems.forEach((id) => handleRemoveItem(id))
                    }
                  >
                    Xóa ({selectedItems.length})
                  </Button>
                )}
              </motion.div>

              {/* List Items với Animation */}
              <div className="space-y-3">
                <AnimatePresence mode="popLayout" initial={false}>
                  {cartData.items.map((item) => (
                    <motion.div
                      key={item.id}
                      layout // MAGIC PROP: Tự động trượt lên lấp chỗ trống khi item trên bị xóa
                      initial={{ opacity: 0, x: -20 }} // Hiện ra: Từ trái sang
                      animate={{ opacity: 1, x: 0 }}
                      exit={{
                        opacity: 0,
                        x: -100, // Biến mất: Trượt sang trái
                        height: 0,
                        marginBottom: 0,
                        overflow: "hidden",
                      }}
                      transition={{
                        type: "spring",
                        stiffness: 500,
                        damping: 30,
                        opacity: { duration: 0.2 },
                      }}
                    >
                      <CartItem
                        item={item}
                        isSelected={selectedItems.includes(item.id)}
                        onToggleSelect={() => handleSelectItem(item.id)}
                        onUpdateQuantity={handleUpdateQuantity}
                        onRemove={handleRemoveItem}
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>

            {/* --- RIGHT COLUMN --- */}
            <motion.div
              className="w-full lg:w-[380px] shrink-0 lg:sticky lg:top-24"
              initial={{ opacity: 0, x: 20 }} // Hiện ra: Từ phải sang
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <CartSummary
                subtotal={subtotal}
                shipping={cartData.shipping}
                onCheckout={handleCheckout}
                isDisabled={selectedItems.length === 0}
                itemCount={selectedItems.length}
              />
            </motion.div>
          </div>
        )}
      </div>

      {/* Mobile Sticky Footer */}
      {cartState === "success" && (
        <motion.div
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          className="fixed bottom-0 left-0 right-0 z-40" // Cần wrapper để animate
        >
          <CartMobileCheckout
            total={total}
            onCheckout={handleCheckout}
            itemCount={selectedItems.length}
            disabled={selectedItems.length === 0}
          />
        </motion.div>
      )}
    </div>
  );
}
