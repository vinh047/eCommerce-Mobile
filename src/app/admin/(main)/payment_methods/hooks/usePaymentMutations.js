import { useCallback, useState } from "react";
import { toast } from "sonner";
import paymentApi from "@/lib/api/paymentApi";

export function usePaymentMutations(refetchData) {
  const [isMutating, setIsMutating] = useState(false);

  // --- Xử lý Method (Cha) ---
  const saveMethod = useCallback(
    async (data, mode, selectedId) => {
      setIsMutating(true);
      try {
        if (mode === "create") {
          await paymentApi.createMethod(data);
          toast.success("Tạo phương thức thành công");
        } else {
          await paymentApi.updateMethod(selectedId, data);
          toast.success("Cập nhật phương thức thành công");
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

  const deleteMethod = useCallback(
    async (id) => {
      if (!confirm("Bạn chắc chắn muốn xóa phương thức này?")) return;
      setIsMutating(true);
      try {
        await paymentApi.deleteMethod(id);
        toast.success("Đã xóa phương thức.");
        refetchData();
      } catch {
        toast.error("Xóa thất bại.");
      } finally {
        setIsMutating(false);
      }
    },
    [refetchData]
  );

  // --- Xử lý Account (Con) ---
  const saveAccount = useCallback(
    async (data, methodId, accountId = null) => {
      setIsMutating(true);
      try {
        if (!accountId) {
          // Create mode
          await paymentApi.createAccount(methodId, data);
          toast.success("Thêm tài khoản thành công");
        } else {
          // Update mode
          await paymentApi.updateAccount(accountId, data);
          toast.success("Cập nhật tài khoản thành công");
        }
        refetchData(); // Load lại data để cập nhật list account mới
      } catch (err) {
        console.error(err);
        toast.error("Lưu tài khoản thất bại");
      } finally {
        setIsMutating(false);
      }
    },
    [refetchData]
  );

  const deleteAccount = useCallback(
    async (accountId) => {
      if (!confirm("Xóa tài khoản nhận tiền này?")) return;
      setIsMutating(true);
      try {
        await paymentApi.deleteAccount(accountId);
        toast.success("Đã xóa tài khoản.");
        refetchData();
      } catch {
        toast.error("Xóa tài khoản thất bại.");
      } finally {
        setIsMutating(false);
      }
    },
    [refetchData]
  );

  return {
    isMutating,
    saveMethod,
    deleteMethod,
    saveAccount,
    deleteAccount
  };
}