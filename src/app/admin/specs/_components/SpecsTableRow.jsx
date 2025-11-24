"use client";

import { Edit, Trash, Settings, Layers } from "lucide-react";

export default function SpecsTableRow({
  spec,
  isSelected,
  onSelect,
  onEdit,
  onConfigure,
  onDelete,
}) {
  return (
    <tr
      className={`border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors ${
        isSelected ? "bg-blue-50 dark:bg-blue-900/20" : ""
      }`}
    >
      <td className="px-6 py-4">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={(e) => onSelect(e.target.checked)}
          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600 cursor-pointer"
        />
      </td>
      <td className="px-6 py-4 font-mono text-xs text-gray-500 dark:text-gray-400">
        #{spec.id}
      </td>
      <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
        {spec.name}
      </td>
      <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-blue-500" />
          <span>{spec.category?.name || "Chưa phân loại"}</span>
        </div>
      </td>
      <td className="px-6 py-4 text-center">
        <span className="px-2 py-1 font-mono text-xs bg-gray-100 dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700">
          v{spec.version}
        </span>
      </td>
      <td className="px-6 py-4 text-center">
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            spec.isActive
              ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
              : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
          }`}
        >
          <span
            className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
              spec.isActive ? "bg-green-500" : "bg-gray-500"
            }`}
          ></span>
          {spec.isActive ? "Active" : "Inactive"}
        </span>
      </td>
      <td className="px-6 py-4 text-center">
        <button
          onClick={() => onConfigure(spec)}
          className="group inline-flex items-center gap-1 text-xs font-medium text-purple-700 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 px-2.5 py-1.5 rounded-md hover:bg-purple-100 dark:hover:bg-purple-900/40 transition-all"
        >
          <Settings className="w-3.5 h-3.5 group-hover:rotate-90 transition-transform duration-500" />
          Thiết lập
        </button>
      </td>
      <td className="px-6 py-4 text-center">
        <div className="flex justify-center items-center space-x-1">
          <button
            onClick={() => onEdit(spec)}
            className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-md transition-colors"
            title="Sửa"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(spec.id)}
            className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors"
            title="Xóa"
          >
            <Trash className="w-4 h-4" />
          </button>
        </div>
      </td>
    </tr>
  );
}
