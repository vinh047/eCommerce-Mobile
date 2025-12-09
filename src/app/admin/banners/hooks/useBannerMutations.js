import bannersApi from "@/lib/api/bannerApi";
import { useCallback, useState } from "react";
import { toast } from "sonner";

export function useBannerMutations(refetchData, selectedItems, deselectAll) {
  const [isMutating, setIsMutating] = useState(false);

  // DELETE
  const deleteBanner = useCallback(
    async (id) => {
      if (!confirm("Bạn có chắc muốn xóa banner này?")) return;
      setIsMutating(true);
      try {
        await bannersApi.deleteBanner(id);
        toast.success("Đã xóa banner thành công.");
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
  const saveBanner = useCallback(
    async (data, mode, selectedBanner) => {
      setIsMutating(true);
      try {
        if (mode === "create") {
          await bannersApi.createBanner(data);
          toast.success("Tạo banner thành công");
        } else {
          await bannersApi.updateBanner(selectedBanner.id, data);
          toast.success("Cập nhật banner thành công");
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
        return toast.warning("Chưa chọn banner nào.");

      setIsMutating(true);
      try {
        await bannersApi.bulkAction(Array.from(selectedItems), action);
        toast.success(`Đã thực hiện thao tác thành công.`);
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
    deleteBanner,
    saveBanner,
    handleBulkAction,
  };
}