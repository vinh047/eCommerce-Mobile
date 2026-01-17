import { useCallback, useState } from "react";
import { toast } from "sonner";
import variantsApi from "@/lib/api/variantsApi";

export function useVariantMutations(refetchData, selectedItems, deselectAll) {
  const [isMutating, setIsMutating] = useState(false);

  // DELETE
  const deleteVariant = useCallback(
    async (id) => {
      if (!confirm("Bạn có chắc muốn xóa biến thể này?")) return;
      setIsMutating(true);
      try {
        await variantsApi.deleteVariant(id);
        toast.success("Đã xóa biến thể thành công.");
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
  const saveVariant = useCallback(
    async (data, mode, selectedVariant) => {
      setIsMutating(true);
      try {
        if (mode === "create") {
          await variantsApi.createVariant(data);
          toast.success("Tạo biến thể thành công");
        } else {
          await variantsApi.updateVariant(selectedVariant.id, data);
          toast.success("Cập nhật biến thể thành công");
        }
        refetchData();
      } catch (err) {
        console.error(err);
        toast.error("Lưu thất bại");
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
        return toast.warning("Chưa chọn biến thể nào.");
      
      setIsMutating(true);
      try {
        await variantsApi.bulkAction(Array.from(selectedItems), action);
        
        let actionText = action === "delete" ? "Xóa" : action === "active" ? "Hiện" : "Ẩn";
        toast.success(`Đã ${actionText} ${selectedItems.size} biến thể.`);
        
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
    deleteVariant,
    saveVariant,
    handleBulkAction,
  };
}