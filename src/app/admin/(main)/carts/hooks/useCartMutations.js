import { useCallback, useState } from "react";
import { toast } from "sonner";
import cartsApi from "@/lib/api/cartsApi";

export function useCartMutations(refetchData, selectedItems, deselectAll) {
  const [isMutating, setIsMutating] = useState(false);

  // XÓA MỘT GIỎ HÀNG
  const deleteCart = useCallback(
    async (id) => {
      if (!confirm("Bạn có chắc chắn muốn xóa giỏ hàng này không? Hành động này không thể hoàn tác.")) return;
      
      setIsMutating(true);
      try {
        await cartsApi.deleteCart(id);
        toast.success("Đã xóa giỏ hàng thành công.");
        refetchData(); 
      } catch (err) {
        console.error(err);
        toast.error("Xóa thất bại.");
      } finally {
        setIsMutating(false);
      }
    },
    [refetchData]
  );

  // HÀNH ĐỘNG HÀNG LOẠT (BULK ACTION)
  const handleBulkAction = useCallback(
    async (action) => {
      if (selectedItems.size === 0)
        return toast.warning("Chưa chọn giỏ hàng nào.");

      if (action === 'delete') {
         if (!confirm(`Bạn có chắc muốn xóa ${selectedItems.size} giỏ hàng đã chọn?`)) return;
      }

      setIsMutating(true);
      try {
        await cartsApi.bulkAction(Array.from(selectedItems), action);
        toast.success("Thao tác thành công.");
        deselectAll();
        refetchData();
      } catch (err) {
        console.error(err);
        toast.error("Thao tác thất bại.");
      } finally {
        setIsMutating(false);
      }
    },
    [selectedItems, deselectAll, refetchData]
  );

  return {
    isMutating,
    deleteCart,
    handleBulkAction,
  };
}