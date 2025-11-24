"use client";

import { useState } from "react";
import { useFormContext, useFieldArray } from "react-hook-form";
import { Trash, Plus, RefreshCw, X } from "lucide-react";

// Hàm thuật toán sinh tổ hợp (Cartesian Product)
// Input: [[Đỏ, Xanh], [S, M]]
// Output: [[Đỏ, S], [Đỏ, M], [Xanh, S], [Xanh, M]]
function cartesian(args) {
  const r = [],
    max = args.length - 1;
  function helper(arr, i) {
    for (let j = 0, l = args[i].length; j < l; j++) {
      const a = arr.slice(0); // clone arr
      a.push(args[i][j]);
      if (i === max) r.push(a);
      else helper(a, i + 1);
    }
  }
  helper([], 0);
  return r;
}

export default function VariantsForm({ template }) {
  const { register, control } = useFormContext();
  const { fields, replace, remove } = useFieldArray({
    control,
    name: "variants", // Tên field trong form data
  });

  // State lưu giá trị admin đang nhập (chưa generate)
  // Dạng: { "color_code": ["Đỏ", "Xanh"], "size_code": ["S", "M"] }
  const [draftAttributes, setDraftAttributes] = useState({});

  // State quản lý input text hiện tại
  const [currentInput, setCurrentInput] = useState({});

  if (!template)
    return (
      <div className="text-gray-500 italic p-4">
        Vui lòng chọn Danh mục ở Tab 1 trước.
      </div>
    );

  const variantSpecs = template.variantSpecs || [];

  // Hàm xử lý khi nhấn Enter để thêm tag giá trị
  const handleKeyDown = (e, specCode) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const val = currentInput[specCode]?.trim();
      if (!val) return;

      setDraftAttributes((prev) => {
        const currentList = prev[specCode] || [];
        if (currentList.includes(val)) return prev; // Không trùng
        return { ...prev, [specCode]: [...currentList, val] };
      });

      // Reset input
      setCurrentInput((prev) => ({ ...prev, [specCode]: "" }));
    }
  };

  // Hàm xóa tag giá trị
  const removeAttributeValue = (specCode, valueToRemove) => {
    setDraftAttributes((prev) => ({
      ...prev,
      [specCode]: prev[specCode].filter((v) => v !== valueToRemove),
    }));
  };

  // HÀM QUAN TRỌNG: Sinh danh sách biến thể
  const handleGenerate = () => {
    // 1. Chuẩn bị dữ liệu cho thuật toán
    // Cần đảm bảo thứ tự đúng với variantSpecs
    const arraysToCombine = [];
    const specCodes = [];

    variantSpecs.forEach((spec) => {
      const values = draftAttributes[spec.code];
      if (values && values.length > 0) {
        arraysToCombine.push(values);
        specCodes.push(spec.code);
      }
    });

    if (arraysToCombine.length === 0) {
      alert("Vui lòng nhập ít nhất một thuộc tính (ví dụ: Màu sắc)");
      return;
    }

    // 2. Chạy thuật toán
    const combinations = cartesian(arraysToCombine);

    // 3. Map kết quả thành object variants form
    const newVariants = combinations.map((combo) => {
      // combo là mảng [Giá trị 1, Giá trị 2...] tương ứng với specCodes
      const specsObj = {};
      let nameParts = [];

      specCodes.forEach((code, index) => {
        specsObj[code] = combo[index];
        nameParts.push(combo[index]);
      });

      return {
        name: nameParts.join(" / "), // Tên hiển thị: Đỏ / S
        attributes: specsObj, // Dữ liệu lưu DB: { color: "Đỏ", size: "S" }
        price: 0,
        compareAtPrice: 0,
        stock: 0,
        sku: "",
      };
    });

    // 4. Đẩy vào Form
    replace(newVariants);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* PHẦN 1: INPUT ATTRIBUTES */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold text-gray-900">
            1. Định nghĩa phiên bản
          </h3>
          <button
            type="button"
            onClick={handleGenerate}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm font-medium transition-colors"
          >
            <RefreshCw className="w-4 h-4" /> Tạo danh sách phiên bản
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {variantSpecs.map((spec) => (
            <div
              key={spec.id}
              className="bg-gray-50 p-4 rounded-lg border border-gray-100"
            >
              <label className="font-medium text-sm mb-2 block text-gray-700">
                {spec.label} ({spec.code})
              </label>

              {/* Input nhập giá trị + Enter */}
              <input
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                placeholder={`Nhập ${spec.label} rồi nhấn Enter...`}
                value={currentInput[spec.code] || ""}
                onChange={(e) =>
                  setCurrentInput({
                    ...currentInput,
                    [spec.code]: e.target.value,
                  })
                }
                onKeyDown={(e) => handleKeyDown(e, spec.code)}
              />

              {/* Danh sách các tag đã nhập */}
              <div className="flex flex-wrap gap-2 mt-3">
                {(draftAttributes[spec.code] || []).map((val, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium"
                  >
                    {val}
                    <button
                      type="button"
                      onClick={() => removeAttributeValue(spec.code, val)}
                    >
                      <X className="w-3 h-3 hover:text-red-600" />
                    </button>
                  </span>
                ))}
                {(draftAttributes[spec.code] || []).length === 0 && (
                  <span className="text-xs text-gray-400 italic">
                    Chưa có giá trị nào
                  </span>
                )}
              </div>
            </div>
          ))}
          {variantSpecs.length === 0 && (
            <p className="text-sm text-gray-500">
              Mẫu này không có biến thể nào.
            </p>
          )}
        </div>
      </div>

      {/* PHẦN 2: TABLE EDIT */}
      {fields.length > 0 && (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-gray-900">
              2. Chi tiết {fields.length} phiên bản
            </h3>
            <button
              type="button"
              onClick={() => replace([])}
              className="text-sm text-red-600 hover:underline"
            >
              Xóa tất cả
            </button>
          </div>

          <div className="overflow-x-auto border rounded-lg">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 text-gray-500 font-medium uppercase text-xs">
                <tr>
                  <th className="p-3 min-w-[150px]">Phiên bản</th>
                  <th className="p-3 min-w-[120px]">Giá bán (VND)</th>
                  <th className="p-3 min-w-[120px]">Giá gốc</th>
                  <th className="p-3 min-w-[100px]">Tồn kho</th>
                  <th className="p-3 min-w-[120px]">Mã SKU</th>
                  <th className="p-3 w-10"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {fields.map((item, index) => (
                  <tr key={item.id} className="hover:bg-gray-50 group">
                    <td className="p-3 font-medium text-gray-900">
                      {/* Lấy tên từ object attributes đã lưu trong field array */}
                      {item.name ||
                        Object.values(item.attributes || {}).join(" / ")}
                    </td>
                    <td className="p-3">
                      <input
                        type="number"
                        {...register(`variants.${index}.price`, {
                          valueAsNumber: true,
                        })}
                        className="w-full border-gray-300 rounded px-2 py-1.5 text-sm focus:ring-1 focus:ring-blue-500"
                        placeholder="0"
                      />
                    </td>
                    <td className="p-3">
                      <input
                        type="number"
                        {...register(`variants.${index}.compareAtPrice`, {
                          valueAsNumber: true,
                        })}
                        className="w-full border-gray-300 rounded px-2 py-1.5 text-sm focus:ring-1 focus:ring-blue-500"
                        placeholder="0"
                      />
                    </td>
                    <td className="p-3">
                      <input
                        type="number"
                        {...register(`variants.${index}.stock`, {
                          valueAsNumber: true,
                        })}
                        className="w-full border-gray-300 rounded px-2 py-1.5 text-sm focus:ring-1 focus:ring-blue-500"
                        placeholder="0"
                      />
                    </td>
                    <td className="p-3">
                      <input
                        type="text"
                        {...register(`variants.${index}.sku`)}
                        className="w-full border-gray-300 rounded px-2 py-1.5 text-sm uppercase font-mono focus:ring-1 focus:ring-blue-500"
                        placeholder="AUTO-GEN"
                      />
                    </td>
                    <td className="p-3 text-center">
                      <button
                        type="button"
                        onClick={() => remove(index)}
                        className="text-gray-400 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <Trash className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
