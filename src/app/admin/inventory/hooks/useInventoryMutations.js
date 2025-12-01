import { useCallback, useState } from "react";
import { toast } from "sonner";
import inventoryApi from "@/lib/api/inventoryApi";

export function useInventoryMutations(refetchData) {
  const [isMutating, setIsMutating] = useState(false);

  const createTransaction = useCallback(
    async (data, onSuccess) => {
      setIsMutating(true);
      try {
        await inventoryApi.createTransaction(data);
        toast.success(
          data.type === "in" ? "Đã nhập kho thành công" : "out"? "Đã xuất kho thành công" : "Kiểm kê thành công"
        );
        refetchData(); // Load lại bảng dữ liệu
        if (onSuccess) onSuccess();
      } catch (err) {
        console.error(err);
        toast.error(err.message || "Tạo phiếu thất bại");
      } finally {
        setIsMutating(false);
      }
    },
    [refetchData]
  );

  return {
    isMutating,
    createTransaction,
  };
}