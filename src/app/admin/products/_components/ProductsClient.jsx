"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ProductsToolbar from "./ProductsToolbar";
import ProductsTable from "./ProductsTable";
import PageHeader from "@/components/common/PageHeader";
import { useProductMutations } from "../hooks/useProductMutations";

export default function ProductsClient({ initialData, categories, brands }) {
  const router = useRouter();
  const [products, setProducts] = useState(initialData?.data || []);

  // Gọi hook ra
  const { deleteProduct, isMutating } = useProductMutations();

  useEffect(() => {
    setProducts(initialData?.data || []);
  }, [initialData]);

  const handleCreate = () => {
    router.push("/admin/products/create");
  };

  // Hàm xóa giờ chỉ còn 1 dòng gọi hook
  const handleDelete = (id) => {
    deleteProduct(id, (deletedId) => {
      // Callback này chạy khi xóa thành công
      setProducts((prev) => prev.filter((p) => p.id !== deletedId));
    });
  };

  return (
    <div className="overflow-auto px-8 py-6">
      <PageHeader
        title="Danh sách Sản phẩm"
        createLabel="Thêm Sản phẩm"
        onCreate={handleCreate}
      />

      <ProductsToolbar categories={categories} brands={brands} />

      <ProductsTable products={products} onDelete={handleDelete} totalItems={initialData.pagination.totalItems}/>
    </div>
  );
}
