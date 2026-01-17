import { useCallback, useState } from "react";
import { toast } from "sonner";
import rmasApi from "@/lib/api/rmasApi";

export function useRmaMutations(refetchData, selectedItems, deselectAll) {
  const [isMutating, setIsMutating] = useState(false);

  const deleteRma = useCallback(
    async (id) => {
      if (!confirm("Xóa yêu cầu này? Dữ liệu sẽ mất vĩnh viễn.")) return;
      setIsMutating(true);
      try {
        await rmasApi.deleteRma(id);
        toast.success("Đã xóa yêu cầu RMA.");
        refetchData();
      } catch {
        toast.error("Xóa thất bại.");
      } finally {
        setIsMutating(false);
      }
    },
    [refetchData]
  );

  const saveRma = useCallback(
    async (data, mode, selectedRma) => {
      setIsMutating(true);
      try {
        if (mode === "create") {
          await rmasApi.createRma(data);
          toast.success("Đã tạo RMA");
        } else {
          await rmasApi.updateRma(selectedRma.id, data);
          toast.success("Đã cập nhật trạng thái RMA");
        }
        refetchData();
      } catch (err) {
        console.error(err);
        toast.error("Cập nhật thất bại");
      } finally {
        setIsMutating(false);
      }
    },
    [refetchData]
  );

  const handleBulkAction = useCallback(
    async (action) => {
      if (selectedItems.size === 0) return toast.warning("Chưa chọn mục nào.");
      setIsMutating(true);
      try {
        await rmasApi.bulkAction(Array.from(selectedItems), action);
        toast.success(`Thao tác thành công.`);
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

  return { isMutating, deleteRma, saveRma, handleBulkAction };
}
