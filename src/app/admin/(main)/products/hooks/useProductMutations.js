import { useCallback, useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import productsApi from "@/lib/api/productApi";

export function useProductMutations() {
  const router = useRouter();
  const [isMutating, setIsMutating] = useState(false);

  // 1. Hàm tạo
  const createProduct = useCallback(async (data) => {
    setIsMutating(true);
    const toastId = toast.loading("Đang tạo sản phẩm...");
    try {
      await productsApi.createProduct(data);
      toast.success("Tạo sản phẩm thành công!", { id: toastId });
      router.push("/admin/products");
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Tạo thất bại.", { id: toastId });
    } finally {
      setIsMutating(false);
    }
  }, [router]);

  // 2. Hàm sửa
  const updateProduct = useCallback(async (id, data) => {
    setIsMutating(true);
    const toastId = toast.loading("Đang cập nhật...");
    try {
      await productsApi.updateProduct(id, data);
      toast.success("Cập nhật thành công!", { id: toastId });
      router.refresh();
    } catch (err) {
      console.error(err);
      toast.error("Cập nhật thất bại.", { id: toastId });
    } finally {
      setIsMutating(false);
    }
  }, [router]);

  // 3. Hàm xóa (MỚI THÊM ĐỂ DÙNG CHO TRANG LIST)
  const deleteProduct = useCallback(async (id, onSuccess) => {
    if (!confirm("Bạn có chắc muốn xóa sản phẩm này?")) return;
    
    setIsMutating(true);
    const toastId = toast.loading("Đang xóa...");
    try {
      await productsApi.deleteProduct(id);
      toast.success("Đã xóa sản phẩm", { id: toastId });
      router.refresh(); // Reload lại data server
      if (onSuccess) onSuccess(id); // Callback để update state ở Client
    } catch (err) {
      console.error(err);
      toast.error("Xóa thất bại.", { id: toastId });
    } finally {
      setIsMutating(false);
    }
  }, [router]);

  return {
    isMutating,
    createProduct,
    updateProduct,
    deleteProduct, // Xuất hàm này ra
  };
}