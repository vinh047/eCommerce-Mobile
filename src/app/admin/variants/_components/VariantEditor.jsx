// components/variants/VariantEditor.jsx
"use client";

import { useState } from "react";
import {
  Box,
  DollarSign,
  Settings,
  Image as ImageIcon,
  Plus,
  Trash2,
  Star,
  ChevronRight,
  Info,
  GripHorizontal,
} from "lucide-react";
import Image from "next/image";
import ProductSelector from "./ProductSelector";

// --- DND Kit Imports ---
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

// --- Component con: Sortable Image Item ---
function SortableImageItem({ item, index, onRemove, onSetPrimary }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id }); // item.id là key duy nhất

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : "auto",
  };

  const isPrimary = item.Media?.isPrimary;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group relative aspect-square bg-gray-100 dark:bg-gray-900 rounded-lg overflow-hidden border transition-shadow duration-200 
        ${isDragging ? "opacity-50 shadow-xl ring-2 ring-blue-400" : ""}
        ${
          isPrimary
            ? "border-blue-500 ring-2 ring-blue-500/20 shadow-md"
            : "border-gray-200 dark:border-gray-700 hover:border-blue-300"
        }
      `}
    >
      <Image
        src={`${process.env.NEXT_PUBLIC_URL_IMAGE || ""}${
          item.Media?.url || item.url || ""
        }`}
        alt="variant"
        fill
        className="object-cover transition-transform duration-500 group-hover:scale-110 pointer-events-none"
      />

      {/* Overlay Actions */}
      <div
        {...attributes}
        {...listeners}
        className={`absolute inset-0 bg-black/40 backdrop-blur-[2px] transition-opacity duration-200 flex flex-col justify-between p-2 cursor-grab active:cursor-grabbing
         ${isDragging ? "opacity-0" : "opacity-0 group-hover:opacity-100"}
         
      `}
      >
        {/* Top: Move icon & Delete */}
        <div className="flex justify-end items-end">
          <button
            type="button"
            onPointerDown={(e) => e.stopPropagation()} // Ngăn drag khi bấm xóa
            onClick={() => onRemove(index)}
            className="p-1.5 bg-white/20 hover:bg-red-500 text-white rounded-full transition-colors backdrop-blur-sm"
            title="Xóa ảnh"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>

        {/* Bottom: Set Primary */}
        <button
          type="button"
          onPointerDown={(e) => e.stopPropagation()} // Ngăn drag khi bấm nút
          onClick={() => onSetPrimary(index)}
          className={`w-full py-1.5 text-xs font-bold rounded backdrop-blur-sm transition-colors flex items-center justify-center gap-1 ${
            isPrimary
              ? "bg-blue-600/90 text-white"
              : "bg-white/90 text-gray-800 hover:bg-white"
          }`}
        >
          <Star className={`w-3 h-3 ${isPrimary ? "fill-white" : ""}`} />
          {isPrimary ? "Ảnh chính" : "Đặt làm chính"}
        </button>
      </div>

      {isPrimary && (
        <div className="absolute top-2 left-2 bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-sm z-10 pointer-events-none">
          MAIN
        </div>
      )}
    </div>
  );
}

// --- MAIN COMPONENT ---
export default function VariantEditor({
  data, // Dữ liệu form hiện tại
  onChange, // Hàm update data: (key, value) => void
  allSpecs = [], // Danh sách specs lấy từ API hoặc Template
  products = [], // List sản phẩm (chỉ dùng cho mode standalone)
  mode = "create",
  isStandalone = true, // True: hiện chọn Product, False: ẩn
}) {
  const [activeTab, setActiveTab] = useState("basic");
  const [showProductSelector, setShowProductSelector] = useState(false);
  const [tempImageUrl, setTempImageUrl] = useState("");

  // Cấu hình Sensors cho DndKit (Chuột + Phím)
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }), // Kéo 5px mới bắt đầu drag (tránh click nhầm)
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  // --- Helper Handlers ---
  const handleInputChange = (field, value) => {
    onChange(field, value);
  };

  // 1. Xử lý ảnh
  const handleAddImage = () => {
    if (!tempImageUrl.trim()) return;
    const currentImages = data.MediaVariant || [];
    const isFirstImage = currentImages.length === 0;

    // Tạo ID giả tạm thời để DndKit dùng làm key (quan trọng!)
    const tempId = `temp-${Date.now()}`;

    const newImage = {
      id: tempId, // Key cho DndKit
      Media: {
        url: tempImageUrl.trim(),
        isPrimary: isFirstImage,
        sortOrder: currentImages.length,
      },
    };

    onChange("MediaVariant", [...currentImages, newImage]);
    setTempImageUrl("");
  };

  const handleRemoveImage = (index) => {
    let newImages = data.MediaVariant.filter((_, i) => i !== index);

    const deletedItem = data.MediaVariant[index];
    if (deletedItem.Media?.isPrimary && newImages.length > 0) {
      newImages[0].Media.isPrimary = true;
    }

    // Re-index sortOrder
    newImages = newImages.map((item, idx) => ({
      ...item,
      Media: { ...item.Media, sortOrder: idx },
    }));

    onChange("MediaVariant", newImages);
  };

  const handleSetPrimary = (indexToSet) => {
    const newImages = data.MediaVariant.map((item, index) => ({
      ...item,
      Media: {
        ...item.Media,
        isPrimary: index === indexToSet,
      },
    }));
    onChange("MediaVariant", newImages);
  };

  // --- Logic Kéo Thả (DndKit) ---
  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      const oldIndex = (data.MediaVariant || []).findIndex(
        (item) =>
          item.id === active.id || `temp-${item.Media?.url}` === active.id
      );
      const newIndex = (data.MediaVariant || []).findIndex(
        (item) => item.id === over.id || `temp-${item.Media?.url}` === over.id
      );

      if (oldIndex !== -1 && newIndex !== -1) {
        const newImages = arrayMove(data.MediaVariant, oldIndex, newIndex);

        // Cập nhật lại sortOrder
        const updatedImages = newImages.map((item, idx) => ({
          ...item,
          Media: { ...item.Media, sortOrder: idx },
        }));

        onChange("MediaVariant", updatedImages);
      }
    }
  };

  // Chuẩn bị list item cho DndKit (Cần đảm bảo mỗi item có ID duy nhất)
  // Nếu data từ DB chưa có ID ở level ngoài, ta map tạm để dùng
  const dndItems = (data.MediaVariant || [])
    .sort((a, b) => (a.Media?.sortOrder || 0) - (b.Media?.sortOrder || 0)) // Luôn sort trước khi render
    .map((item, index) => ({
      ...item,
      // Nếu item đã có id (từ DB) thì dùng, nếu chưa (mới thêm) thì dùng url làm key tạm
      id: item.id || `temp-${item.Media?.url || index}`,
    }));

  // 2. Xử lý Specs
  const handleAddSpec = () => {
    const newSpec = {
      specKey: "",
      label: "",
      type: "STRING",
      unit: "",
      stringValue: "",
      numericValue: null,
      booleanValue: null,
    };
    onChange("variantSpecValues", [...(data.variantSpecValues || []), newSpec]);
  };

  const handleRemoveSpec = (index) => {
    const newSpecs = data.variantSpecValues.filter((_, i) => i !== index);
    onChange("variantSpecValues", newSpecs);
  };

  const handleSpecChange = (index, field, value) => {
    const newSpecs = [...(data.variantSpecValues || [])];
    newSpecs[index] = { ...newSpecs[index], [field]: value };
    onChange("variantSpecValues", newSpecs);
  };

  const handleSelectSpecTemplate = (index, specCode) => {
    const selectedSpec = allSpecs.find((s) => s.code === specCode);
    if (!selectedSpec) return;

    const newSpecs = [...(data.variantSpecValues || [])];
    newSpecs[index] = {
      ...newSpecs[index],
      specKey: selectedSpec.code,
      label: selectedSpec.label,
      type: selectedSpec.datatype,
      unit: selectedSpec.unit,
      stringValue: "",
      numericValue: null,
      booleanValue: null,
    };
    onChange("variantSpecValues", newSpecs);
  };

  // --- Render Tabs ---
  const tabs = [
    { id: "basic", name: "Thông tin cơ bản", icon: Box },
    { id: "pricing", name: "Giá & Tồn kho", icon: DollarSign },
    { id: "specs", name: "Thông số", icon: Settings },
    { id: "media", name: "Thư viện ảnh", icon: ImageIcon },
  ];

  const selectedProduct = products.find((p) => p.id === data.productId);

  // Styles
  const inputClass =
    "w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200";
  const labelClass =
    "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5";

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-800 rounded-xl overflow-hidden animate-in fade-in zoom-in-95 duration-300">
      {/* Tab Navigation */}
      <div className="border-b border-gray-200 dark:border-gray-700 px-6 bg-gray-50 dark:bg-gray-800/50 flex-none">
        <nav className="flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-2 border-b-2 font-medium text-sm flex items-center gap-2 transition-all duration-200 outline-none ${
                  isActive
                    ? "border-blue-600 text-blue-600 dark:text-blue-400"
                    : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 hover:bg-gray-100/50 dark:hover:bg-gray-700/50 rounded-t"
                }`}
              >
                <Icon
                  className={`w-4 h-4 ${isActive ? "animate-pulse" : ""}`}
                />
                {tab.name}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content Area */}
      <div className="p-6 overflow-y-auto custom-scrollbar flex-1 relative">
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
          {/* TAB 1: BASIC */}
          {activeTab === "basic" && (
            <div className="space-y-6">
              {isStandalone && (
                <div>
                  <label className={labelClass}>
                    Sản phẩm cha <span className="text-red-500">*</span>
                  </label>
                  <div
                    onClick={() => setShowProductSelector(true)}
                    className="w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 cursor-pointer hover:border-blue-400 dark:hover:border-blue-500 transition-colors flex justify-between items-center group shadow-sm hover:shadow-md"
                  >
                    {selectedProduct ? (
                      <div className="flex items-center gap-2">
                        <div className="bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 text-xs font-bold px-2 py-0.5 rounded">
                          #{selectedProduct.id}
                        </div>
                        <span className="text-gray-900 dark:text-white text-sm font-medium">
                          {selectedProduct.name}
                        </span>
                      </div>
                    ) : (
                      <span className="text-gray-500 dark:text-gray-400 text-sm italic">
                        -- Nhấn để chọn sản phẩm --
                      </span>
                    )}
                    <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-blue-500 transition-colors" />
                  </div>
                </div>
              )}

              <div>
                <label className={labelClass}>
                  Màu sắc / Tên biến thể <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={data.color || ""}
                  onChange={(e) => handleInputChange("color", e.target.value)}
                  className={inputClass}
                  placeholder="Ví dụ: Đỏ, 128GB, XL..."
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className={labelClass}>SKU (Mã kho)</label>
                  <input
                    type="text"
                    value={data.sku || ""}
                    onChange={(e) => handleInputChange("sku", e.target.value)}
                    className={`${inputClass} uppercase font-mono`}
                    placeholder="SP-001-RED"
                  />
                </div>
                <div>
                  <label className={labelClass}>Trạng thái</label>
                  <select
                    value={data.isActive ? "true" : "false"}
                    onChange={(e) =>
                      handleInputChange("isActive", e.target.value === "true")
                    }
                    className={inputClass}
                  >
                    <option value="true">Đang bán</option>
                    <option value="false">Ẩn</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: PRICING */}
          {activeTab === "pricing" && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className={labelClass}>
                    Giá bán <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      value={data.price}
                      onChange={(e) =>
                        handleInputChange(
                          "price",
                          parseFloat(e.target.value) || 0
                        )
                      }
                      className={`${inputClass} pl-8 font-semibold`}
                      min="0"
                    />
                    <span className="absolute left-3 top-2.5 text-gray-400 text-sm">
                      ₫
                    </span>
                  </div>
                </div>
                <div>
                  <label className={labelClass}>Giá gốc (So sánh)</label>
                  <div className="relative">
                    <input
                      type="number"
                      value={data.compareAtPrice}
                      onChange={(e) =>
                        handleInputChange(
                          "compareAtPrice",
                          parseFloat(e.target.value) || 0
                        )
                      }
                      className={`${inputClass} pl-8`}
                      min="0"
                    />
                    <span className="absolute left-3 top-2.5 text-gray-400 text-sm">
                      ₫
                    </span>
                  </div>
                </div>
              </div>

              <div className="h-px bg-gray-100 dark:bg-gray-700 my-2"></div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className={labelClass}>Số lượng tồn kho</label>
                  <input
                    type="number"
                    value={data.stock}
                    onChange={(e) =>
                      handleInputChange("stock", parseInt(e.target.value) || 0)
                    }
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Ngưỡng báo hết</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={data.lowStockThreshold}
                      onChange={(e) =>
                        handleInputChange(
                          "lowStockThreshold",
                          parseInt(e.target.value) || 0
                        )
                      }
                      className={inputClass}
                    />
                    <div className="group relative inline-block">
                      <Info className="w-4 h-4 text-gray-400 cursor-help" />
                      <span
                        className="absolute right-full mr-2 top-1/2 -translate-y-1/2
                   w-48 bg-gray-800 text-white text-xs p-2 rounded
                   opacity-0 group-hover:opacity-100 transition-transform duration-200
                   transform scale-95 group-hover:scale-100
                   pointer-events-none z-10"
                      >
                        Hệ thống sẽ cảnh báo khi tồn kho xuống dưới mức này.
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: SPECS */}
          {activeTab === "specs" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg border border-blue-100 dark:border-blue-800">
                <div className="text-sm text-blue-800 dark:text-blue-300 flex items-center gap-2">
                  <Settings className="w-4 h-4" />
                  <span className="font-medium">Thông số kỹ thuật riêng</span>
                </div>
                <button
                  type="button"
                  onClick={handleAddSpec}
                  className="text-xs flex items-center gap-1 bg-blue-600 text-white px-3 py-1.5 rounded-md hover:bg-blue-700 shadow-sm transition-all active:scale-95"
                >
                  <Plus className="w-3.5 h-3.5" /> Thêm mới
                </button>
              </div>

              {(data.variantSpecValues || []).length === 0 ? (
                <div className="text-center py-10 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-dashed border-gray-300 dark:border-gray-600 transition-all hover:bg-gray-100 dark:hover:bg-gray-800">
                  <Settings className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                  <p className="text-gray-500 text-sm">
                    Chưa có thông số nào được cấu hình.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {data.variantSpecValues.map((spec, index) => (
                    <div
                      key={index}
                      className="group flex gap-3 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700 items-start transition-all hover:border-blue-300 hover:shadow-sm"
                    >
                      <div className="flex-1 min-w-[140px]">
                        <label className="text-xs font-semibold text-gray-500 uppercase mb-1 block">
                          Tên thông số
                        </label>
                        <select
                          value={spec.specKey}
                          onChange={(e) =>
                            handleSelectSpecTemplate(index, e.target.value)
                          }
                          className={`${inputClass} bg-white`}
                        >
                          <option value="">-- Chọn --</option>
                          {allSpecs.map((s) => (
                            <option key={s.id} value={s.code}>
                              {s.label}
                            </option>
                          ))}
                          {spec.specKey &&
                            !allSpecs.find((s) => s.code === spec.specKey) && (
                              <option value={spec.specKey}>
                                {spec.label || spec.specKey}
                              </option>
                            )}
                        </select>
                      </div>
                      <div className="flex-[2]">
                        <label className="text-xs font-semibold text-gray-500 uppercase mb-1 block">
                          Giá trị {spec.unit ? `(${spec.unit})` : ""}
                        </label>
                        {(!spec.type ||
                          spec.type === "string" ||
                          spec.type === "STRING") && (
                          <input
                            type="text"
                            value={spec.stringValue || ""}
                            onChange={(e) =>
                              handleSpecChange(
                                index,
                                "stringValue",
                                e.target.value
                              )
                            }
                            className={inputClass}
                            placeholder="Nhập giá trị..."
                          />
                        )}
                        {spec.type === "number" && (
                          <input
                            type="number"
                            value={spec.numericValue ?? ""}
                            onChange={(e) =>
                              handleSpecChange(
                                index,
                                "numericValue",
                                parseFloat(e.target.value)
                              )
                            }
                            className={inputClass}
                            placeholder="0"
                          />
                        )}
                      </div>
                      <div className="pt-6">
                        <button
                          onClick={() => handleRemoveSpec(index)}
                          className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                          title="Xóa"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: MEDIA (Đã tích hợp DndKit) */}
          {activeTab === "media" && (
            <div className="space-y-6">
              <div>
                <label className={labelClass}>Thêm URL hình ảnh</label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={tempImageUrl}
                    onChange={(e) => setTempImageUrl(e.target.value)}
                    placeholder="https://example.com/image.jpg"
                    className={inputClass}
                    onKeyDown={(e) => e.key === "Enter" && handleAddImage()}
                  />
                  <button
                    type="button"
                    onClick={handleAddImage}
                    disabled={!tempImageUrl}
                    className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm font-medium active:scale-95"
                  >
                    Thêm
                  </button>
                </div>
              </div>

              <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                <div className="flex justify-between items-center mb-3">
                  <label className={labelClass}>
                    Thư viện ảnh ({dndItems.length || 0})
                  </label>
                  <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                    Kéo thả để sắp xếp vị trí
                  </span>
                </div>

                {dndItems.length === 0 ? (
                  <div className="text-center py-10 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-dashed border-gray-300 dark:border-gray-600">
                    <ImageIcon className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                    <p className="text-gray-500 text-sm">
                      Chưa có hình ảnh nào.
                    </p>
                  </div>
                ) : (
                  <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                  >
                    <SortableContext
                      items={dndItems.map((i) => i.id)}
                      strategy={rectSortingStrategy}
                    >
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                        {dndItems.map((item, index) => (
                          <SortableImageItem
                            key={item.id}
                            item={item}
                            index={index}
                            onRemove={handleRemoveImage}
                            onSetPrimary={handleSetPrimary}
                          />
                        ))}
                      </div>
                    </SortableContext>
                  </DndContext>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Product Selector Modal (Nested) */}
      {showProductSelector && (
        <ProductSelector
          products={products}
          currentId={data.productId}
          onSelect={(p) => {
            onChange("productId", p.id);
            setShowProductSelector(false);
          }}
          onClose={() => setShowProductSelector(false)}
        />
      )}
    </div>
  );
}
