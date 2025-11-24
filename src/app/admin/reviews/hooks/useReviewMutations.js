import { useCallback, useState } from "react";
import { toast } from "sonner";
import reviewsApi from "@/lib/api/reviewsApi";

export function useReviewMutations(refetchData, selectedItems, deselectAll) {
  const [isMutating, setIsMutating] = useState(false);

  const deleteReview = useCallback(
    async (id) => {
      if (!confirm("Bạn có chắc muốn xóa đánh giá này vĩnh viễn?")) return;
      setIsMutating(true);
      try {
        await reviewsApi.deleteReview(id);
        toast.success("Đã xóa đánh giá.");
        refetchData();
      } catch {
        toast.error("Xóa thất bại.");
      } finally {
        setIsMutating(false);
      }
    },
    [refetchData]
  );

  const saveReview = useCallback(
    async (data, mode, selectedReview) => {
      setIsMutating(true);
      try {
        // Reviews thường không có mode "create" từ admin
        await reviewsApi.updateReview(selectedReview.id, data);
        toast.success("Cập nhật đánh giá thành công");
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

  const handleBulkAction = useCallback(
    async (action) => {
      if (selectedItems.size === 0) return toast.warning("Chưa chọn mục nào.");

      setIsMutating(true);
      try {
        await reviewsApi.bulkAction(Array.from(selectedItems), action);
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

  return { isMutating, deleteReview, saveReview, handleBulkAction };
}