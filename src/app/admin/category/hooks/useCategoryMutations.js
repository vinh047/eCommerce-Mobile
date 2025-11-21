import categoryApi from "@/lib/api/categoryApi";
import { useCallback, useState } from "react";
import { toast } from "sonner";

export function useCategoryMutations(refetchData, selectedItems, deselectAll) {
  const [isMutating, setIsMutating] = useState(false);

  // XÓA MỘT MỤC
  const deleteCategory = useCallback(
    async (id) => {
      if (!confirm("Bạn có chắc muốn xóa danh mục này?")) return;
      setIsMutating(true);
      try {
        await categoryApi.deleteCategory(id);
        toast.success("Đã xóa danh mục thành công.");
        refetchData();
      } catch (error) {
        console.error(error);
        toast.error("Xóa thất bại. Có thể danh mục đang chứa sản phẩm.");
      } finally {
        setIsMutating(false);
      }
    },
    [refetchData]
  );

  // LƯU (Tạo/Cập nhật)
  const saveCategory = useCallback(
    async (data, mode, selectedCategory) => {
      setIsMutating(true);
      try {
        if (mode === "create") {
          await categoryApi.createCategory(data);
          toast.success("Tạo danh mục thành công");
        } else {
          await categoryApi.updateCategory(selectedCategory.id, data);
          toast.success("Cập nhật danh mục thành công");
        }
        refetchData();
      } catch (err) {
        console.error(err);
        toast.error("Lưu thất bại. Vui lòng kiểm tra lại thông tin.");
      } finally {
        setIsMutating(false);
      }
    },
    [refetchData]
  );

  // HÀNH ĐỘNG HÀNG LOẠT
  const handleBulkAction = useCallback(
    async (action) => {
      if (selectedItems.size === 0)
        return toast.warning("Chưa chọn danh mục nào.");
      
      if (!confirm(`Bạn có chắc muốn thực hiện hành động này cho các mục đã chọn?`)) return;

      setIsMutating(true);
      try {
        await categoryApi.bulkAction(Array.from(selectedItems), action);
        toast.success(`Thao tác thành công trên ${selectedItems.size} danh mục.`);
        deselectAll();
        refetchData();
      } catch (err) {
        console.error(err);
        toast.error("Thao tác hàng loạt thất bại.");
      } finally {
        setIsMutating(false);
      }
    },
    [selectedItems, deselectAll, refetchData]
  );

  return {
    isMutating,
    deleteCategory,
    saveCategory,
    handleBulkAction,
  };
}