"use client";

import { useState, useEffect } from "react";
import {
  X,
  Plus,
  Trash,
  GripVertical,
  ChevronRight,
  Settings2,
  List,
  Save,
} from "lucide-react";

const DATA_TYPES = ["string", "number", "boolean"];
const CONTROL_TYPES = [
  "select",
  "multiselect"
];

export default function SpecBuilderDrawer({ template, onClose, onSave }) {
  const [specs, setSpecs] = useState(template.productSpecs || []);
  const [activeSpecId, setActiveSpecId] = useState(null);

  const handleAddSpec = () => {
    const newSpec = {
      id: `temp_${Date.now()}`,
      code: "",
      label: "New Specification",
      valueType: "range",
      datatype: "number",
      control: "select",
      groupLabel: "General",
      isRequired: false,
      filterable: false,
      options: [],
    };
    setSpecs([...specs, newSpec]);
    setActiveSpecId(newSpec.id);
  };

  const handleDeleteSpec = (id) => {
    if (confirm("Bạn có chắc muốn xóa trường này?")) {
      setSpecs(specs.filter((s) => s.id !== id));
      if (activeSpecId === id) setActiveSpecId(null);
    }
  };

  const updateActiveSpec = (field, value) => {
    setSpecs(
      specs.map((s) => (s.id === activeSpecId ? { ...s, [field]: value } : s))
    );
  };

  const activeSpec = specs.find((s) => s.id === activeSpecId);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      {/* Main Drawer Container */}
      <div className="relative z-10 w-full max-w-5xl bg-gray-50 dark:bg-gray-900 h-full shadow-2xl flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Settings2 className="w-6 h-6 text-blue-600" />
              Cấu hình: {template.name}
            </h2>
            <p className="text-sm text-gray-500">
              Quản lý các trường dữ liệu cho mẫu này.
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
              onClick={() => onSave(specs)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
            >
              <Save className="w-4 h-4" /> Lưu cấu hình
            </button>
          </div>
        </div>

        {/* Body: 2 Columns Layout */}
        <div className="flex-1 flex overflow-hidden">
          {/* LEFT COLUMN: List of Specs */}
          <div className="w-1/3 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-800/50">
              <span className="font-semibold text-sm text-gray-700 dark:text-gray-300">
                Danh sách trường ({specs.length})
              </span>
              <button
                onClick={handleAddSpec}
                className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded hover:bg-blue-200 font-medium flex items-center gap-1"
              >
                <Plus className="w-3 h-3" /> Thêm trường
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-2 space-y-2">
              {specs.length === 0 && (
                <div className="text-center py-10 text-gray-400 text-sm italic">
                  Chưa có trường nào.
                </div>
              )}
              {specs.map((spec) => (
                <div
                  key={spec.id}
                  onClick={() => setActiveSpecId(spec.id)}
                  className={`group p-3 rounded-lg border cursor-pointer transition-all flex items-center justify-between ${
                    activeSpecId === spec.id
                      ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 ring-1 ring-blue-500"
                      : "border-gray-200 dark:border-gray-700 hover:border-blue-300 hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <GripVertical className="w-4 h-4 text-gray-400 cursor-move" />
                    <div>
                      <div className="font-medium text-sm text-gray-900 dark:text-white">
                        {spec.label || "Unnamed"}
                      </div>
                      <div className="text-xs text-gray-500 flex gap-2">
                        <span className="bg-gray-100 px-1 rounded">
                          {spec.code || "NO_CODE"}
                        </span>
                        <span>{spec.datatype}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteSpec(spec.id);
                      }}
                      className="p-1 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash className="w-4 h-4" />
                    </button>
                    <ChevronRight
                      className={`w-4 h-4 text-gray-400 ${
                        activeSpecId === spec.id ? "text-blue-500" : ""
                      }`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT COLUMN: Edit Form */}
          <div className="flex-1 bg-gray-50 dark:bg-gray-900 overflow-y-auto p-6">
            {activeSpec ? (
              <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 space-y-6">
                <div className="border-b pb-4 mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Chi tiết cấu hình
                  </h3>
                  <p className="text-sm text-gray-500">
                    Chỉnh sửa thuộc tính cho trường đang chọn.
                  </p>
                </div>

                {/* Row 1: Label & Code */}
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">
                      Tên hiển thị (Label)
                    </label>
                    <input
                      type="text"
                      value={activeSpec.label}
                      onChange={(e) =>
                        updateActiveSpec("label", e.target.value)
                      }
                      className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">
                      Mã trường (Code)
                    </label>
                    <input
                      type="text"
                      value={activeSpec.code}
                      onChange={(e) => updateActiveSpec("code", e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 dark:text-white font-mono text-sm"
                      placeholder="screen_size, ram, cpu..."
                    />
                  </div>
                </div>

                {/* Row 2: Group & Unit */}
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">
                      Nhóm (Group)
                    </label>
                    <input
                      type="text"
                      value={activeSpec.groupLabel || ""}
                      onChange={(e) =>
                        updateActiveSpec("groupLabel", e.target.value)
                      }
                      className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 dark:text-white"
                      placeholder="General, Display, Processor..."
                      list="group-suggestions"
                    />
                    <datalist id="group-suggestions">
                      <option value="General" />
                      <option value="Display" />
                      <option value="Performance" />
                      <option value="Connectivity" />
                    </datalist>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">
                      Đơn vị (Unit)
                    </label>
                    <input
                      type="text"
                      value={activeSpec.unit || ""}
                      onChange={(e) => updateActiveSpec("unit", e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 dark:text-white"
                      placeholder="inches, GB, mAh..."
                    />
                  </div>
                </div>

                {/* Row 3: Types */}
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">
                      Kiểu dữ liệu (DataType)
                    </label>
                    <select
                      value={activeSpec.datatype}
                      onChange={(e) =>
                        updateActiveSpec("datatype", e.target.value)
                      }
                      className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 dark:text-white"
                    >
                      {DATA_TYPES.map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">
                      Loại điều khiển (Control)
                    </label>
                    <select
                      value={activeSpec.control}
                      onChange={(e) =>
                        updateActiveSpec("control", e.target.value)
                      }
                      className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 dark:text-white"
                    >
                      {CONTROL_TYPES.map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Row 4: Switches */}
                <div className="flex gap-6 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={activeSpec.isRequired}
                      onChange={(e) =>
                        updateActiveSpec("isRequired", e.target.checked)
                      }
                      className="w-4 h-4 text-blue-600 rounded"
                    />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Bắt buộc nhập
                    </span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={activeSpec.filterable}
                      onChange={(e) =>
                        updateActiveSpec("filterable", e.target.checked)
                      }
                      className="w-4 h-4 text-blue-600 rounded"
                    />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Dùng để lọc (Filter)
                    </span>
                  </label>
                </div>

                {/* OPTIONS EDITOR (Only if Select/MultiSelect) */}
                {(activeSpec.control === "SELECT" ||
                  activeSpec.control === "MULTI_SELECT" ||
                  activeSpec.control === "RADIO") && (
                  <div className="mt-6 border-t pt-4 border-gray-200 dark:border-gray-700">
                    <div className="flex justify-between items-center mb-3">
                      <h4 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <List className="w-4 h-4" /> Danh sách tùy chọn
                        (Options)
                      </h4>
                      <button
                        onClick={() => {
                          const newOpt = { value: "", label: "", sortOrder: 0 };
                          updateActiveSpec("options", [
                            ...(activeSpec.options || []),
                            newOpt,
                          ]);
                        }}
                        className="text-xs text-blue-600 font-medium hover:underline"
                      >
                        + Thêm tùy chọn
                      </button>
                    </div>
                    <div className="space-y-2">
                      {(activeSpec.options || []).map((opt, idx) => (
                        <div key={idx} className="flex gap-2 items-center">
                          <input
                            placeholder="Label (Hiển thị)"
                            className="flex-1 px-2 py-1 text-sm border rounded"
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
                            placeholder="Value (Lưu DB)"
                            className="flex-1 px-2 py-1 text-sm border rounded bg-gray-50"
                            value={opt.value}
                            onChange={(e) => {
                              const newOpts = [...activeSpec.options];
                              newOpts[idx].value = e.target.value;
                              updateActiveSpec("options", newOpts);
                            }}
                          />
                          <button
                            onClick={() => {
                              const newOpts = activeSpec.options.filter(
                                (_, i) => i !== idx
                              );
                              updateActiveSpec("options", newOpts);
                            }}
                            className="text-red-500 hover:text-red-700 p-1"
                          >
                            <Trash className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                      {(!activeSpec.options ||
                        activeSpec.options.length === 0) && (
                        <p className="text-xs text-gray-400 italic text-center py-2">
                          Chưa có tùy chọn nào.
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-gray-400">
                <Settings2 className="w-12 h-12 mb-3 opacity-20" />
                <p>Chọn một trường bên trái để cấu hình</p>
                <p className="text-sm">hoặc nhấn "Thêm trường" để tạo mới.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
