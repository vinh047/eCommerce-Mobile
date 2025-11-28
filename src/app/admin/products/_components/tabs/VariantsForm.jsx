"use client";

import { useState, useEffect } from "react";
import { useFormContext, useFieldArray, useWatch } from "react-hook-form";
import { Trash, RefreshCw, X, Image as ImageIcon, Check } from "lucide-react";

// --- Sub-component: Modal chọn ảnh cho Variant ---
const VariantImageSelector = ({
  isOpen,
  onClose,
  allImages,
  selectedImageIds,
  onSave,
}) => {
  // Local state để user tích chọn trước khi bấm Xong
  const [tempSelected, setTempSelected] = useState(selectedImageIds || []);

  useEffect(() => {
    if (isOpen) setTempSelected(selectedImageIds || []);
  }, [isOpen, selectedImageIds]);

  if (!isOpen) return null;

  const toggleImage = (imgUrl) => {
    setTempSelected((prev) =>
      prev.includes(imgUrl)
        ? prev.filter((id) => id !== imgUrl)
        : [...prev, imgUrl]
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-xl w-full max-w-2xl max-h-[80vh] flex flex-col">
        <div className="p-4 border-b flex justify-between items-center">
          <h3 className="font-semibold text-lg">Chọn ảnh cho phiên bản này</h3>
          <button onClick={onClose}>
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-4 overflow-y-auto flex-1">
          {allImages.length === 0 ? (
            <p className="text-gray-500 italic text-center">
              Chưa có ảnh nào. Vui lòng sang Tab "Hình ảnh" để upload trước.
            </p>
          ) : (
            <div className="grid grid-cols-4 gap-4">
              {allImages.map((img, idx) => {
                // img có dạng { url: '...', isPrimary: ... } từ MediaForm
                const isSelected = tempSelected.includes(img.url);
                return (
                  <div
                    key={idx}
                    onClick={() => toggleImage(img.url)}
                    className={`relative aspect-square cursor-pointer rounded-lg border-2 overflow-hidden group ${
                      isSelected ? "border-blue-600" : "border-gray-200"
                    }`}
                  >
                    <img
                      src={img.url}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                    {isSelected && (
                      <div className="absolute inset-0 bg-blue-500/20 flex items-center justify-center">
                        <div className="bg-blue-600 text-white rounded-full p-1">
                          <Check className="w-4 h-4" />
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
        <div className="p-4 border-t flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg hover:bg-gray-100"
          >
            Hủy
          </button>
          <button
            onClick={() => onSave(tempSelected)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
          >
            Xác nhận ({tempSelected.length})
          </button>
        </div>
      </div>
    </div>
  );
};

// --- Helper: Thuật toán Cartesian Product ---
function cartesian(args) {
  const r = [],
    max = args.length - 1;
  function helper(arr, i) {
    for (let j = 0, l = args[i].length; j < l; j++) {
      const a = arr.slice(0);
      a.push(args[i][j]);
      if (i === max) r.push(a);
      else helper(a, i + 1);
    }
  }
  helper([], 0);
  return r;
}

// --- Main Component ---
export default function VariantsForm({ template }) {
  const { register, control, watch, setValue } = useFormContext();
  const { fields, replace, remove, update } = useFieldArray({
    control,
    name: "variants",
  });

  // Lấy danh sách ảnh từ Tab Media để hiển thị trong popup
  const uploadedImages = useWatch({ control, name: "images" }) || [];

  const [draftAttributes, setDraftAttributes] = useState({});
  const [currentInput, setCurrentInput] = useState({});

  // State quản lý Modal chọn ảnh
  const [modalOpen, setModalOpen] = useState(false);
  const [currentVariantIndex, setCurrentVariantIndex] = useState(null);

  // --- Logic 1: Init attributes khi edit ---
  // (Giữ nguyên logic từ câu trả lời trước để fill data cũ vào ô nhập liệu)

  if (!template)
    return (
      <div className="text-gray-500 italic p-4">
        Vui lòng chọn Danh mục trước.
      </div>
    );

  // Lấy các spec dùng để tạo variant (isVariantKey = true hoặc do logic bạn quy định)
  // Schema của bạn: VariantSpec có trường `code` (color, storage...)
  const variantSpecs = template.variantSpecs || [];

  const handleKeyDown = (e, specCode) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const val = currentInput[specCode]?.trim();
      if (!val) return;

      setDraftAttributes((prev) => {
        const currentList = prev[specCode] || [];
        if (currentList.includes(val)) return prev;
        return { ...prev, [specCode]: [...currentList, val] };
      });
      setCurrentInput((prev) => ({ ...prev, [specCode]: "" }));
    }
  };

  const removeAttributeValue = (specCode, valueToRemove) => {
    setDraftAttributes((prev) => ({
      ...prev,
      [specCode]: prev[specCode].filter((v) => v !== valueToRemove),
    }));
  };

  const handleGenerate = () => {
    const arraysToCombine = [];
    const specCodes = [];

    // Duyệt qua TẤT CẢ các spec trong template (Color, RAM, Storage...)
    variantSpecs.forEach((spec) => {
      const values = draftAttributes[spec.code];
      if (values && values.length > 0) {
        arraysToCombine.push(values);
        specCodes.push(spec.code);
      }
    });

    if (arraysToCombine.length === 0) {
      alert("Vui lòng nhập ít nhất một thuộc tính để tạo biến thể.");
      return;
    }

    const combinations = cartesian(arraysToCombine);

    const newVariants = combinations.map((combo) => {
      const attributes = {};
      const nameParts = [];

      specCodes.forEach((code, index) => {
        attributes[code] = combo[index]; // Ví dụ: attributes.color = "Đỏ", attributes.ram = "8GB"
        nameParts.push(combo[index]);
      });

      return {
        // ID giả lập null để biết là mới tạo
        id: null,
        name: nameParts.join(" / "),
        attributes: attributes, // Quan trọng: Lưu object {color: "...", storage: "..."}
        price: 0,
        compareAtPrice: 0,
        stock: 0,
        sku: "",
        assignedImages: [], // Mảng chứa URL các ảnh được gán cho variant này
      };
    });

    replace(newVariants);
  };

  // Mở modal chọn ảnh
  const openImageModal = (index) => {
    setCurrentVariantIndex(index);
    setModalOpen(true);
  };

  // Lưu ảnh đã chọn vào variant
  const handleSaveImages = (selectedUrls) => {
    const variant = fields[currentVariantIndex];
    update(currentVariantIndex, { ...variant, assignedImages: selectedUrls });
    setModalOpen(false);
  };

  return (
    <div className="space-y-8">
      {/* 1. KHU VỰC NHẬP THUỘC TÍNH (Generate) */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold text-gray-900">
            1. Định nghĩa thuộc tính biến thể
          </h3>
          <button
            type="button"
            onClick={handleGenerate}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm font-medium"
          >
            <RefreshCw className="w-4 h-4" /> Tạo các phiên bản
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {variantSpecs.map((spec) => (
            <div
              key={spec.id}
              className="bg-gray-50 p-4 rounded-lg border border-gray-100"
            >
              <label className="font-medium text-sm mb-2 block text-gray-700">
                {spec.label}{" "}
                <span className="text-gray-400 font-normal text-xs">
                  ({spec.code})
                </span>
              </label>
              <input
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder={`Nhập ${spec.label}...`}
                value={currentInput[spec.code] || ""}
                onChange={(e) =>
                  setCurrentInput({
                    ...currentInput,
                    [spec.code]: e.target.value,
                  })
                }
                onKeyDown={(e) => handleKeyDown(e, spec.code)}
              />
              <div className="flex flex-wrap gap-2 mt-3 min-h-[30px]">
                {(draftAttributes[spec.code] || []).map((val, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1 bg-white border border-blue-200 text-blue-800 px-2 py-1 rounded text-xs font-medium shadow-sm"
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
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 2. BẢNG DANH SÁCH VARIANTS */}
      {fields.length > 0 && (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-gray-900">
              2. Chi tiết ({fields.length} phiên bản)
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
                  <th className="p-3 w-[100px]">Hình ảnh</th>
                  <th className="p-3 min-w-[120px]">Giá bán</th>
                  <th className="p-3 min-w-[100px]">Tồn kho</th>
                  <th className="p-3 min-w-[120px]">SKU</th>
                  <th className="p-3 w-10"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {fields.map((item, index) => (
                  <tr key={item.id} className="hover:bg-gray-50 group">
                    <td className="p-3">
                      {/* Hiển thị chi tiết từng thuộc tính */}
                      <div className="font-medium text-gray-900">
                        {item.name}
                      </div>
                      <div className="text-xs text-gray-500 mt-1 flex gap-2">
                        {/* Loop qua object attributes để hiển thị chi tiết: Color: Đỏ, Ram: 8GB */}
                        {Object.entries(item.attributes || {}).map(
                          ([key, val]) => (
                            <span
                              key={key}
                              className="bg-gray-100 px-1.5 py-0.5 rounded border"
                            >
                              {val}
                            </span>
                          )
                        )}
                      </div>
                    </td>

                    {/* Cột chọn ảnh */}
                    <td className="p-3">
                      <div className="flex -space-x-2 overflow-hidden mb-2">
                        {/* Preview ảnh nhỏ */}
                        {(item.assignedImages || [])
                          .slice(0, 3)
                          .map((imgUrl, i) => (
                            <img
                              key={i}
                              src={imgUrl}
                              className="inline-block h-8 w-8 rounded-full ring-2 ring-white object-cover"
                            />
                          ))}
                        {(item.assignedImages || []).length > 3 && (
                          <span className="inline-flex items-center justify-center h-8 w-8 rounded-full ring-2 ring-white bg-gray-100 text-xs text-gray-500">
                            +{item.assignedImages.length - 3}
                          </span>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => openImageModal(index)}
                        className="text-xs text-blue-600 hover:underline flex items-center gap-1"
                      >
                        <ImageIcon className="w-3 h-3" /> Chọn ảnh
                      </button>
                    </td>

                    <td className="p-3">
                      <input
                        type="number"
                        {...register(`variants.${index}.price`)}
                        className="w-full border-gray-300 rounded px-2 py-1.5 focus:ring-1 focus:ring-blue-500"
                        placeholder="Giá..."
                      />
                    </td>
                    <td className="p-3">
                      <input
                        type="number"
                        {...register(`variants.${index}.stock`)}
                        className="w-full border-gray-300 rounded px-2 py-1.5 focus:ring-1 focus:ring-blue-500"
                        placeholder="SL"
                      />
                    </td>
                    <td className="p-3">
                      <input
                        type="text"
                        {...register(`variants.${index}.sku`)}
                        className="w-full border-gray-300 rounded px-2 py-1.5 uppercase font-mono"
                        placeholder="SKU"
                      />
                    </td>
                    <td className="p-3">
                      <button
                        type="button"
                        onClick={() => remove(index)}
                        className="text-gray-400 hover:text-red-500 p-1"
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

      {/* Modal Selector */}
      <VariantImageSelector
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        allImages={uploadedImages}
        selectedImageIds={
          currentVariantIndex !== null
            ? fields[currentVariantIndex]?.assignedImages
            : []
        }
        onSave={handleSaveImages}
      />
    </div>
  );
}
