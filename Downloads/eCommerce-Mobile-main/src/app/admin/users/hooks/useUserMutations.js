import { useCallback, useState } from "react";
import { toast } from "sonner";
import usersApi from "@/lib/api/usersApi";

// Hook này CHỈ xử lý các thao tác GHI (Write/Mutation)
export function useUserMutations(refetchData, selectedItems, deselectAll) {
  const [isMutating, setIsMutating] = useState(false);

  // XÓA MỘT MỤC
  const deleteUser = useCallback(
    async (id) => {
      if (!confirm("Bạn có chắc muốn xóa người dùng này?")) return;
      setIsMutating(true);
      try {
        await usersApi.deleteUser(id);
        toast.success("Đã xóa người dùng thành công.");
        refetchData(); // <-- Gọi hàm refetch được truyền từ bên ngoài
      } catch {
        toast.error("Xóa thất bại.");
      } finally {
        setIsMutating(false);
      }
    },
    [refetchData] // Chỉ phụ thuộc vào hàm refetch
  );

  // LƯU (Tạo/Cập nhật)
  const saveUser = useCallback(
    async (data, mode, selectedUser) => {
      setIsMutating(true);
      try {
        if (mode === "create") {
          await usersApi.createUser(data);
          toast.success("Tạo người dùng thành công");
        } else {
          await usersApi.updateUser(selectedUser.id, data);
          toast.success("Cập nhật người dùng thành công");
        }
        refetchData(); // Fetch lại sau khi lưu
      } catch (err) {
        console.error(err);
        toast.error("Lưu thất bại");
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
        return toast.warning("Chưa chọn người dùng nào.");
      // ... (logic confirm)

      setIsMutating(true);
      try {
        await usersApi.bulkAction(Array.from(selectedItems), action);
        toast.success(`Đã ${action} ${selectedItems.size} người dùng.`);
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
    deleteUser,
    saveUser,
    handleBulkAction,
  };
}
