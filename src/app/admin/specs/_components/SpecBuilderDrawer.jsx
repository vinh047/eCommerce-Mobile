"use client";

import { useState, useMemo } from "react";
import {
  X,
  Plus,
  Trash,
  GripVertical,
  ChevronRight,
  Settings2,
  List,
  Save,
  Layers,
  Box,
  Type,
  SlidersHorizontal, // Icon cho Buckets
} from "lucide-react";

const DATA_TYPES = ["string", "number", "boolean"];
const CONTROL_TYPES = ["select", "multiselect", "text", "number_input"];

const TabButton = ({ active, onClick, icon: Icon, label, count }) => (
  <button
    onClick={onClick}
    className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium border-b-2 transition-colors ${
      active
        ? "border-blue-600 text-blue-600 bg-blue-50/50"
        : "border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50"
    }`}
  >
    <Icon className="w-4 h-4" />
    {label}
    <span className="ml-1 bg-gray-100 text-gray-600 py-0.5 px-2 rounded-full text-xs">
      {count}
    </span>
  </button>
);

export default function SpecBuilderDrawer({ template, onClose, onSave }) {
  const [productSpecs, setProductSpecs] = useState(template.productSpecs || []);
  const [variantSpecs, setVariantSpecs] = useState(template.variantSpecs || []);

  const [activeTab, setActiveTab] = useState("product");
  const [activeSpecId, setActiveSpecId] = useState(null);

  const currentSpecs = activeTab === "product" ? productSpecs : variantSpecs;
  const setCurrentSpecs =
    activeTab === "product" ? setProductSpecs : setVariantSpecs;

  const handleAddSpec = () => {
    const newSpec = {
      id: `temp_${Date.now()}`,
      code: "",
      label: activeTab === "product" ? "New Attribute" : "New Variant Option",
      valueType: "string",
      datatype: "string", // Nếu đổi sang number thì control nên là number_input
      control: "text",
      groupLabel: activeTab === "product" ? "General" : null,
      isRequired: false,
      filterable: false,
      isVariantKey: activeTab === "variant",
      options: [], // Cho select
      buckets: [], // Cho number ranges
    };
    setCurrentSpecs([...currentSpecs, newSpec]);
    setActiveSpecId(newSpec.id);
  };

  const handleDeleteSpec = (id) => {
    if (confirm("Bạn có chắc muốn xóa trường này?")) {
      setCurrentSpecs(currentSpecs.filter((s) => s.id !== id));
      if (activeSpecId === id) setActiveSpecId(null);
    }
  };

  const updateActiveSpec = (field, value) => {
    setCurrentSpecs(
      currentSpecs.map((s) =>
        s.id === activeSpecId ? { ...s, [field]: value } : s
      )
    );
  };

  const activeSpec = useMemo(
    () => currentSpecs.find((s) => s.id === activeSpecId),
    [currentSpecs, activeSpecId]
  );

  const handleSave = () => {
    onSave({
      productSpecs,
      variantSpecs,
    });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>

      <div className="relative z-10 w-full max-w-6xl bg-gray-50 dark:bg-gray-900 h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="px-6 py-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Settings2 className="w-6 h-6 text-blue-600" />
              Cấu hình: {template.name}
            </h2>
            <p className="text-sm text-gray-500">
              Thiết lập các trường dữ liệu và bộ lọc.
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 border rounded-lg bg-white hover:bg-gray-50 text-gray-700"
            >
              Đóng
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 shadow-sm"
            >
              <Save className="w-4 h-4" /> Lưu cấu hình
            </button>
          </div>
        </div>

        <div className="flex-1 flex overflow-hidden">
          {/* LEFT COLUMN */}
          <div className="w-1/3 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col">
            <div className="flex border-b border-gray-200 dark:border-gray-700">
              <TabButton
                active={activeTab === "product"}
                onClick={() => {
                  setActiveTab("product");
                  setActiveSpecId(null);
                }}
                icon={Box}
                label="Thuộc tính chung"
                count={productSpecs.length}
              />
              <TabButton
                active={activeTab === "variant"}
                onClick={() => {
                  setActiveTab("variant");
                  setActiveSpecId(null);
                }}
                icon={Layers}
                label="Biến thể (SKU)"
                count={variantSpecs.length}
              />
            </div>

            <div className="p-3 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-800/50">
              <span className="font-semibold text-xs text-gray-500 uppercase tracking-wider">
                {activeTab === "product" ? "Danh sách" : "Danh sách biến thể"}
              </span>
              <button
                onClick={handleAddSpec}
                className="text-xs bg-blue-100 text-blue-700 px-3 py-1.5 rounded-md hover:bg-blue-200 font-medium flex items-center gap-1 transition-colors"
              >
                <Plus className="w-3 h-3" /> Thêm trường
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-2 space-y-2 bg-gray-50/30">
              {currentSpecs.length === 0 && (
                <div className="text-center py-10 text-gray-400 text-sm italic flex flex-col items-center">
                  <Type className="w-8 h-8 mb-2 opacity-20" />
                  Chưa có trường nào.
                </div>
              )}
              {currentSpecs.map((spec) => (
                <div
                  key={spec.id}
                  onClick={() => setActiveSpecId(spec.id)}
                  className={`group p-3 rounded-lg border cursor-pointer transition-all flex items-center justify-between ${
                    activeSpecId === spec.id
                      ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 ring-1 ring-blue-500 shadow-sm"
                      : "border-gray-200 dark:border-gray-700 hover:border-blue-300 hover:bg-white bg-white"
                  }`}
                >
                  <div className="flex items-center gap-3 overflow-hidden">
                    <GripVertical className="w-4 h-4 text-gray-300 cursor-move hover:text-gray-600" />
                    <div className="min-w-0">
                      <div className="font-medium text-sm text-gray-900 dark:text-white truncate">
                        {spec.label || "Unnamed"}
                      </div>
                      <div className="text-xs text-gray-500 flex gap-2 mt-0.5">
                        <span className="bg-gray-100 px-1.5 py-0.5 rounded font-mono text-[10px] border border-gray-200">
                          {spec.code || "NO_CODE"}
                        </span>
                        {spec.datatype === "number" && spec.filterable && (
                          <span className="bg-green-100 text-green-700 px-1.5 py-0.5 rounded text-[10px] border border-green-200">
                            Range Filter
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center pl-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteSpec(spec.id);
                      }}
                      className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded opacity-0 group-hover:opacity-100 transition-all"
                    >
                      <Trash className="w-4 h-4" />
                    </button>
                    <ChevronRight
                      className={`w-4 h-4 ml-1 transition-transform ${
                        activeSpecId === spec.id
                          ? "text-blue-500 translate-x-1"
                          : "text-gray-300"
                      }`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT COLUMN: Edit Form */}
          <div className="flex-1 bg-gray-50 dark:bg-gray-900 overflow-y-auto p-8">
            {activeSpec ? (
              <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 space-y-8">
                {/* Header Form */}
                <div className="border-b pb-4">
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className={`px-2 py-0.5 rounded text-xs font-bold uppercase ${
                        activeTab === "product"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-purple-100 text-purple-700"
                      }`}
                    >
                      {activeTab === "product"
                        ? "Product Spec"
                        : "Variant Spec"}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    {activeSpec.label || "Chỉnh sửa trường"}
                  </h3>
                </div>

                {/* Form Fields Grid */}
                <div className="grid grid-cols-2 gap-6">
                  {/* Label & Code (Giữ nguyên như cũ) */}
                  <div className="col-span-1">
                    <label className="block text-sm font-semibold mb-2 text-gray-700">
                      Tên hiển thị (Label){" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={activeSpec.label}
                      onChange={(e) =>
                        updateActiveSpec("label", e.target.value)
                      }
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                  <div className="col-span-1">
                    <label className="block text-sm font-semibold mb-2 text-gray-700">
                      Mã hệ thống (Code) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={activeSpec.code}
                      onChange={(e) => updateActiveSpec("code", e.target.value)}
                      className="w-full px-4 py-2 border rounded-lg font-mono text-sm bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>

                  {/* Group */}
                  {activeTab === "product" && (
                    <div className="col-span-1">
                      <label className="block text-sm font-semibold mb-2 text-gray-700">
                        Nhóm thông số
                      </label>
                      <input
                        type="text"
                        value={activeSpec.groupLabel || ""}
                        onChange={(e) =>
                          updateActiveSpec("groupLabel", e.target.value)
                        }
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        list="group-suggestions"
                      />
                    </div>
                  )}

                  <div className="col-span-1">
                    <label className="block text-sm font-semibold mb-2 text-gray-700">
                      Đơn vị tính
                    </label>
                    <input
                      type="text"
                      value={activeSpec.unit || ""}
                      onChange={(e) => updateActiveSpec("unit", e.target.value)}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                      placeholder="kg, cm, GB..."
                    />
                  </div>

                  <div className="col-span-2 border-t border-gray-100 my-2"></div>

                  {/* DataType & Control */}
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-gray-700">
                      Kiểu dữ liệu
                    </label>
                    <select
                      value={activeSpec.datatype}
                      onChange={(e) =>
                        updateActiveSpec("datatype", e.target.value)
                      }
                      className="w-full px-4 py-2 border rounded-lg bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                    >
                      {DATA_TYPES.map((t) => (
                        <option key={t} value={t}>
                          {t.toUpperCase()}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2 text-gray-700">
                      Loại nhập liệu
                    </label>
                    <select
                      value={activeSpec.control}
                      onChange={(e) =>
                        updateActiveSpec("control", e.target.value)
                      }
                      className="w-full px-4 py-2 border rounded-lg bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                    >
                      {CONTROL_TYPES.map((t) => (
                        <option key={t} value={t}>
                          {t.toUpperCase().replace("_", " ")}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Switches */}
                <div className="flex flex-wrap gap-6 p-5 bg-gray-50 rounded-xl border border-gray-100">
                  <label className="flex items-center gap-3 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                      checked={activeSpec.isRequired}
                      onChange={(e) =>
                        updateActiveSpec("isRequired", e.target.checked)
                      }
                    />
                    <span className="text-sm font-medium text-gray-700">
                      Bắt buộc nhập
                    </span>
                  </label>

                  <label className="flex items-center gap-3 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                      checked={activeSpec.filterable}
                      onChange={(e) =>
                        updateActiveSpec("filterable", e.target.checked)
                      }
                    />
                    <span className="text-sm font-medium text-gray-700">
                      Dùng để lọc (Filter)
                    </span>
                  </label>
                </div>

                {/* ================= OPTIONS EDITOR ================= */}
                {(activeSpec.control === "select" ||
                  activeSpec.control === "multiselect") && (
                  <div className="mt-6 border border-gray-200 rounded-xl overflow-hidden">
                    <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 flex justify-between items-center">
                      <h4 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                        <List className="w-4 h-4" /> Danh sách tùy chọn
                      </h4>
                      <button
                        onClick={() => {
                          const newOpt = { value: "", label: "", sortOrder: 0 };
                          updateActiveSpec("options", [
                            ...(activeSpec.options || []),
                            newOpt,
                          ]);
                        }}
                        className="text-xs bg-white border hover:bg-gray-50 px-2 py-1 rounded shadow-sm font-medium text-blue-600"
                      >
                        + Thêm
                      </button>
                    </div>
                    <div className="p-4 bg-white space-y-3">
                      <div className="flex gap-2 font-semibold text-gray-600 text-sm px-1">
                        <div className="flex-1 text-center">Label</div>
                        <div className="flex-1 text-center">Value</div>
                        <div className="w-8"></div>
                      </div>
                      {(activeSpec.options || []).map((opt, idx) => (
                        <div key={idx} className="flex gap-2">
                          <input
                            className="border rounded px-2 py-1 text-sm flex-1"
                            placeholder="Label"
                            value={opt.label}
                            onChange={(e) => {
                              const newOpts = [...activeSpec.options];
                              newOpts[idx].label = e.target.value;
                              if (!newOpts[idx].value)
                                newOpts[idx].value = e.target.value;
                              updateActiveSpec("options", newOpts);
                            }}
                          />
                          <input
                            className="border rounded px-2 py-1 text-sm flex-1 bg-gray-50 font-mono"
                            placeholder="Value"
                            value={opt.value}
                            onChange={(e) => {
                              const newOpts = [...activeSpec.options];
                              newOpts[idx].value = e.target.value;
                              updateActiveSpec("options", newOpts);
                            }}
                          />
                          <button
                            onClick={() =>
                              updateActiveSpec(
                                "options",
                                activeSpec.options.filter((_, i) => i !== idx)
                              )
                            }
                            className="text-red-500 hover:bg-red-50 p-1 rounded"
                          >
                            <Trash className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                      {!activeSpec.options?.length && (
                        <div className="text-center text-sm text-gray-400">
                          Chưa có tùy chọn.
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* ================= BUCKETS EDITOR (Mới thêm) ================= */}
                {/* Chỉ hiện khi DataType = number VÀ Filterable = true */}
                {activeSpec.datatype === "number" && activeSpec.filterable && (
                  <div className="mt-6 border border-orange-200 rounded-xl overflow-hidden">
                    <div className="bg-orange-50 px-4 py-3 border-b border-orange-200 flex justify-between items-center">
                      <h4 className="text-sm font-bold text-orange-800 flex items-center gap-2">
                        <SlidersHorizontal className="w-4 h-4" /> Khoảng lọc
                        (Buckets)
                      </h4>
                      <button
                        onClick={() => {
                          const newBucket = {
                            label: "",
                            gt: "",
                            lte: "",
                            sortOrder: 0,
                          };
                          updateActiveSpec("buckets", [
                            ...(activeSpec.buckets || []),
                            newBucket,
                          ]);
                        }}
                        className="text-xs bg-white border border-orange-200 hover:bg-orange-100 px-2 py-1 rounded shadow-sm font-medium text-orange-700"
                      >
                        + Thêm khoảng
                      </button>
                    </div>

                    <div className="p-4 bg-white space-y-3">
                      <div className="grid grid-cols-12 gap-2 text-xs font-semibold text-gray-600 px-1">
                        <div className="col-span-4 text-center">Label</div>
                        <div className="col-span-4 text-center">Min (&gt;)</div>
                        <div className="col-span-4 text-center">Max (&le;)</div>
                      </div>
                      {(activeSpec.buckets || []).map((bucket, idx) => (
                        <div
                          key={idx}
                          className="flex gap-3 items-center animate-in fade-in zoom-in duration-200"
                        >
                          <div className="grid grid-cols-12 gap-2 flex-1">
                            {/* Label */}
                            <div className="col-span-4">
                              <input
                                placeholder="Label (VD: Dưới 1kg)"
                                className="w-full px-3 py-2 text-sm border rounded-md focus:ring-1 focus:ring-orange-500 outline-none"
                                value={bucket.label}
                                onChange={(e) => {
                                  const newBuckets = [
                                    ...(activeSpec.buckets || []),
                                  ];
                                  newBuckets[idx].label = e.target.value;
                                  updateActiveSpec("buckets", newBuckets);
                                }}
                              />
                            </div>
                            {/* GT (Lớn hơn) */}
                            <div className="col-span-4 relative">
                              <span className="absolute left-2 top-2 text-xs text-gray-400 font-mono">{`>`}</span>
                              <input
                                type="number"
                                placeholder="Min (>)"
                                className="w-full pl-6 pr-3 py-2 text-sm border rounded-md focus:ring-1 focus:ring-orange-500 outline-none"
                                value={bucket.gt || ""}
                                onChange={(e) => {
                                  const newBuckets = [
                                    ...(activeSpec.buckets || []),
                                  ];
                                  newBuckets[idx].gt = e.target.value;
                                  updateActiveSpec("buckets", newBuckets);
                                }}
                              />
                            </div>
                            {/* LTE (Nhỏ hơn hoặc bằng) */}
                            <div className="col-span-4 relative">
                              <span className="absolute left-2 top-2 text-xs text-gray-400 font-mono">{`<=`}</span>
                              <input
                                type="number"
                                placeholder="Max (<=)"
                                className="w-full pl-8 pr-3 py-2 text-sm border rounded-md focus:ring-1 focus:ring-orange-500 outline-none"
                                value={bucket.lte || ""}
                                onChange={(e) => {
                                  const newBuckets = [
                                    ...(activeSpec.buckets || []),
                                  ];
                                  newBuckets[idx].lte = e.target.value;
                                  updateActiveSpec("buckets", newBuckets);
                                }}
                              />
                            </div>
                          </div>
                          <button
                            onClick={() => {
                              const newBuckets = activeSpec.buckets.filter(
                                (_, i) => i !== idx
                              );
                              updateActiveSpec("buckets", newBuckets);
                            }}
                            className="text-gray-400 hover:text-red-500 p-2 hover:bg-red-50 rounded-full"
                          >
                            <Trash className="w-4 h-4" />
                          </button>
                        </div>
                      ))}

                      {(!activeSpec.buckets ||
                        activeSpec.buckets.length === 0) && (
                        <div className="text-center py-4">
                          <p className="text-sm text-gray-400 italic">
                            Chưa có khoảng lọc nào.
                          </p>
                          <p className="text-xs text-orange-600/70 mt-1">
                            Ví dụ: 1kg - 2kg (Min: 1, Max: 2)
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-gray-300 select-none">
                <Settings2 className="w-10 h-10 opacity-40 mb-4" />
                <p className="font-medium text-lg text-gray-400">
                  Chưa chọn trường nào
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
