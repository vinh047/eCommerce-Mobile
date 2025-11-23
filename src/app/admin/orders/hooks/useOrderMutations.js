import { useCallback, useState } from "react";
import { toast } from "sonner";
import ordersApi from "@/lib/api/ordersApi";

export function useOrderMutations(refetchData, selectedItems, deselectAll) {
  const [isMutating, setIsMutating] = useState(false);

  // DELETE
  const deleteOrder = useCallback(
    async (id) => {
      if (!confirm("Bạn có chắc muốn xóa/hủy đơn hàng này?")) return;
      setIsMutating(true);
      try {
        await ordersApi.deleteOrder(id);
        toast.success("Đã xóa đơn hàng thành công.");
        refetchData();
      } catch {
        toast.error("Xóa thất bại.");
      } finally {
        setIsMutating(false);
      }
    },
    [refetchData]
  );

  // SAVE (Create/Update)
  const saveOrder = useCallback(
    async (data, mode, selectedOrder) => {
      setIsMutating(true);
      try {
        if (mode === "create") {
          await ordersApi.createOrder(data);
          toast.success("Tạo đơn hàng thành công");
        } else {
          await ordersApi.updateOrder(selectedOrder.id, data);
          toast.success("Cập nhật đơn hàng thành công");
        }
        refetchData();
      } catch (err) {
        console.error(err);
        toast.error(err.message || "Lưu thất bại");
      } finally {
        setIsMutating(false);
      }
    },
    [refetchData]
  );

  // BULK ACTION
  const handleBulkAction = useCallback(
    async (action) => {
      if (selectedItems.size === 0)
        return toast.warning("Chưa chọn đơn hàng nào.");

      setIsMutating(true);
      try {
        await ordersApi.bulkAction(Array.from(selectedItems), action);
        toast.success(`Đã cập nhật trạng thái: ${action}`);
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
    deleteOrder,
    saveOrder,
    handleBulkAction,
  };
}