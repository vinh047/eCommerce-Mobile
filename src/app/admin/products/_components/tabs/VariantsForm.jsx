// app/admin/products/_components/tabs/VariantsForm.jsx
"use client";

import { useState } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { Plus, Edit, Trash2, AlertCircle } from "lucide-react";
import VariantModal from "../../../variants/_components/VariantModal"; // Import Modal cũ

export default function VariantsForm({ template }) {
  const { control } = useFormContext();

  // Quản lý mảng variants trong form
  const { fields, append, remove, update } = useFieldArray({
    control,
    name: "variants",
  });

  // State cho Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null); // null = create, number = edit

  // Hàm mở modal thêm mới
  const handleOpenCreate = () => {
    setEditingIndex(null);
    setIsModalOpen(true);
  };

  // Hàm mở modal sửa
  const handleOpenEdit = (index) => {
    setEditingIndex(index);
    setIsModalOpen(true);
  };

  // Hàm lưu từ Modal (Callback)
  const handleSaveVariant = (variantData) => {
    if (editingIndex !== null) {
      // Cập nhật biến thể cũ
      update(editingIndex, variantData);
    } else {
      // Thêm biến thể mới
      // Tạo fake ID tạm thời để làm key nếu cần
      append({
        ...variantData,
        tempId: Date.now(),
      });
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Empty State hoặc Header */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">
          Danh sách phiên bản ({fields.length})
        </h3>
        <button
          type="button"
          onClick={handleOpenCreate}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium shadow-sm transition-all"
        >
          <Plus className="w-4 h-4 mr-2" />
          Thêm biến thể
        </button>
      </div>

      {!template && (
        <div className="bg-yellow-50 text-yellow-800 p-4 rounded-lg flex items-center gap-2 border border-yellow-200">
          <AlertCircle className="w-5 h-5" />
          <span>
            Vui lòng chọn <strong>Danh mục</strong> ở Tab 1 để tải cấu hình
            thông số biến thể.
          </span>
        </div>
      )}

      {/* Table Danh sách Variants */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50 text-gray-500 font-medium border-b">
            <tr>
              <th className="px-6 py-3">Hình ảnh</th>
              <th className="px-6 py-3">Màu sắc / Tên</th>
              <th className="px-6 py-3">Giá bán</th>
              <th className="px-6 py-3">Tồn kho</th>
              <th className="px-6 py-3 text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {fields.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="px-6 py-8 text-center text-gray-500 italic"
                >
                  Chưa có biến thể nào được tạo.
                </td>
              </tr>
            ) : (
              fields.map((field, index) => {
                // Lấy ảnh đại diện để hiển thị preview
                const previewImg =
                  field.MediaVariant?.find((m) => m.Media?.isPrimary)?.Media
                    ?.url || field.MediaVariant?.[0]?.Media?.url;

                return (
                  <tr key={field.id} className="hover:bg-gray-50 group">
                    <td className="px-6 py-3">
                      <div className="w-10 h-10 rounded bg-gray-100 border flex items-center justify-center overflow-hidden">
                        {previewImg ? (
                          // Xử lý hiển thị cả URL nội bộ và URL blob (nếu mới upload)
                          <img
                            src={
                              previewImg.startsWith("blob:")
                                ? previewImg
                                : `${process.env.NEXT_PUBLIC_URL_IMAGE}${previewImg}`
                            }
                            alt=""
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-xs text-gray-400">No img</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-3 font-medium text-gray-900">
                      {field.color}
                      <div className="text-xs text-gray-400 font-normal">
                        {field.sku}
                      </div>
                    </td>
                    <td className="px-6 py-3">
                      {new Intl.NumberFormat("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      }).format(field.price)}
                    </td>
                    <td className="px-6 py-3">
                      <span
                        className={`${
                          field.stock <= (field.lowStockThreshold || 5)
                            ? "text-red-600 font-bold"
                            : "text-gray-700"
                        }`}
                      >
                        {field.stock}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-right">
                      <div className="flex justify-end gap-2 group-hover:opacity-100 transition-opacity">
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(index)}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"
                          title="Sửa"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => remove(index)}
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded"
                          title="Xóa"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* MODAL TÁI SỬ DỤNG */}
      {isModalOpen && (
        <VariantModal
          mode={editingIndex !== null ? "edit" : "create"}
          variant={editingIndex !== null ? fields[editingIndex] : {}}
          variantSpecs={template?.variantSpecs || []}   
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveVariant}
        />
      )}
    </div>
  );
}
