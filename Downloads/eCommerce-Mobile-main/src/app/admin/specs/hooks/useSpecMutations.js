import { useCallback, useState } from "react";
import { toast } from "sonner";
import specsApi from "@/lib/api/specsApi";

export function useSpecMutations(refetchData, selectedItems, deselectAll) {
  const [isMutating, setIsMutating] = useState(false);

  const deleteSpec = useCallback(
    async (id) => {
      if (
        !confirm(
          "Bạn có chắc muốn xóa mẫu này? Tất cả cấu hình bên trong sẽ bị mất."
        )
      )
        return;
      setIsMutating(true);
      try {
        await specsApi.deleteSpec(id);
        toast.success("Đã xóa mẫu thành công.");
        refetchData();
      } catch {
        toast.error("Xóa thất bại.");
      } finally {
        setIsMutating(false);
      }
    },
    [refetchData]
  );

  const saveSpec = useCallback(
    async (data, mode, selectedSpec) => {
      setIsMutating(true);
      try {
        if (mode === "create") {
          await specsApi.createSpec(data);
          toast.success("Tạo mẫu thành công");
        } else {
          await specsApi.updateSpec(selectedSpec.id, data);
          toast.success("Cập nhật thông tin thành công");
        }
        refetchData();
      } catch (err) {
        console.error(err);
        toast.error("Lưu thất bại.");
      } finally {
        setIsMutating(false);
      }
    },
    [refetchData]
  );

  const saveSpecConfig = useCallback(
    async (id, nestedData) => {
      setIsMutating(true);

      const toastId = toast.loading("Đang lưu cấu hình...");
      try {
        await specsApi.updateSpecConfig(id, nestedData);
        toast.success("Đã lưu cấu hình chi tiết!", { id: toastId });
        refetchData();
      } catch (err) {
        console.error(err);
        toast.error("Lưu cấu hình thất bại.", { id: toastId });
      } finally {
        setIsMutating(false);
      }
    },
    [refetchData]
  );

  const handleBulkAction = useCallback(
    async (action) => {
      if (selectedItems.size === 0) return;
      if (!confirm("Xác nhận thực hiện thao tác hàng loạt?")) return;

      setIsMutating(true);
      try {
        await specsApi.bulkAction(Array.from(selectedItems), action);
        toast.success("Thao tác thành công.");
        deselectAll();
        refetchData();
      } catch (err) {
        toast.error("Lỗi thao tác hàng loạt.");
      } finally {
        setIsMutating(false);
      }
    },
    [selectedItems, deselectAll, refetchData]
  );

  return {
    isMutating,
    deleteSpec,
    saveSpec,
    saveSpecConfig,
    handleBulkAction,
  };
}
