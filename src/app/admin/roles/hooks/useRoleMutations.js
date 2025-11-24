import { useCallback, useState } from "react";
import { toast } from "sonner";
import rolesApi from "@/lib/api/rolesApi"; // Giả định bạn đã tạo file này

export function useRoleMutations(refetchData, selectedItems, deselectAll) {
  const [isMutating, setIsMutating] = useState(false);

  // XÓA MỘT ROLE
  const deleteRole = useCallback(
    async (id) => {
      if (!confirm("Bạn có chắc muốn xóa vai trò này? Các nhân viên thuộc vai trò này sẽ mất quyền truy cập.")) return;
      setIsMutating(true);
      try {
        await rolesApi.deleteRole(id);
        toast.success("Đã xóa vai trò thành công.");
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

  // LƯU (Tạo/Cập nhật)
  const saveRole = useCallback(
    async (data, mode, selectedRole) => {
      setIsMutating(true);
      try {
        if (mode === "create") {
          await rolesApi.createRole(data);
          toast.success("Tạo vai trò thành công");
        } else {
          await rolesApi.updateRole(selectedRole.id, data);
          toast.success("Cập nhật vai trò thành công");
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

  // (Tuỳ chọn) BULK ACTION cho Role (Thường ít dùng cho Role nhưng cứ giữ structure nếu cần)
  const handleBulkAction = useCallback(async (action) => {
      toast.info("Chức năng thao tác hàng loạt chưa khả dụng cho Role.");
  }, []);

  return {
    isMutating,
    deleteRole,
    saveRole,
    handleBulkAction,
  };
}