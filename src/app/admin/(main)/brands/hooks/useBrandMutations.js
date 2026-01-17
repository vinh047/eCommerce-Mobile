import { useCallback, useState } from "react";
import { toast } from "sonner";
import brandsApi from "@/lib/api/brandsApi";

export function useBrandMutations(refetchData, selectedItems, deselectAll) {
  const [isMutating, setIsMutating] = useState(false);

  const deleteBrand = useCallback(
    async (id) => {
      if (!confirm("Bạn có chắc muốn xóa thương hiệu này?")) return;
      setIsMutating(true);
      try {
        await brandsApi.deleteBrand(id);
        toast.success("Đã xóa thương hiệu thành công.");
        refetchData();
      } catch {
        toast.error("Xóa thất bại. Có thể thương hiệu đang chứa sản phẩm.");
      } finally {
        setIsMutating(false);
      }
    },
    [refetchData]
  );

  const saveBrand = useCallback(
    async (data, mode, selectedBrand) => {
      setIsMutating(true);
      try {
        if (mode === "create") {
          await brandsApi.createBrand(data);
          toast.success("Tạo thương hiệu thành công");
        } else {
          await brandsApi.updateBrand(selectedBrand.id, data);
          toast.success("Cập nhật thương hiệu thành công");
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

  const handleBulkAction = useCallback(
    async (action) => {
      if (selectedItems.size === 0)
        return toast.warning("Chưa chọn thương hiệu nào.");

      if (
        !confirm(
          `Bạn có chắc muốn thực hiện hành động "${action}" cho các mục đã chọn?`
        )
      )
        return;

      setIsMutating(true);
      try {
        await brandsApi.bulkAction(Array.from(selectedItems), action);
        toast.success(
          `Thao tác thành công trên ${selectedItems.size} thương hiệu.`
        );
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
    deleteBrand,
    saveBrand,
    handleBulkAction,
  };
}
