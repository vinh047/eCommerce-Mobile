import { useCallback, useState } from "react";
import { toast } from "sonner";
import staffApi from "@/lib/api/staffApi";

export function useStaffMutations(refetchData, selectedItems, deselectAll) {
  const [isMutating, setIsMutating] = useState(false);

  // DELETE
  const deleteStaff = useCallback(
    async (id) => {
      if (!confirm("Bạn có chắc muốn xóa nhân viên này?")) return;
      setIsMutating(true);
      try {
        await staffApi.deleteStaff(id);
        toast.success("Đã xóa nhân viên thành công.");
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
  const saveStaff = useCallback(
    async (data, mode, selectedStaff) => {
      setIsMutating(true);
      try {
        if (mode === "create") {
          await staffApi.createStaff(data);
          toast.success("Tạo nhân viên thành công");
        } else {
          await staffApi.updateStaff(selectedStaff.id, data);
          toast.success("Cập nhật nhân viên thành công");
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
        return toast.warning("Chưa chọn nhân viên nào.");

      setIsMutating(true);
      try {
        await staffApi.bulkAction(Array.from(selectedItems), action);
        toast.success(`Đã thực hiện ${action} thành công.`);
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
    deleteStaff,
    saveStaff,
    handleBulkAction,
  };
}