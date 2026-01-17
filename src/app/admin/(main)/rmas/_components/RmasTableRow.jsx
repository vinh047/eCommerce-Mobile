"use client";

import { Edit, Eye, Trash, Image as ImageIcon } from "lucide-react";

export default function RmasTableRow({
  rma,
  columnVisibility,
  isSelected,
  onSelect,
  onQuickView,
  onEdit,
  onDelete,
}) {
  const getStatusColor = (status) => {
    switch (status) {
      case "approved": return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300";
      case "rejected": return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300";
      case "completed": return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300";
      default: return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300"; // pending
    }
  };

  const getTypeLabel = (type) => {
    const map = {
      return: "Trả hàng",
      exchange: "Đổi hàng",
      repair: "Bảo hành",
    };
    return map[type] || type;
  };

  const hasEvidence = rma.evidenceJson && Array.isArray(rma.evidenceJson) && rma.evidenceJson.length > 0;

  return (
    <tr className={`border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors ${isSelected ? "bg-blue-50 dark:bg-blue-900/10" : ""}`}>
      <td className="px-6 py-4">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={(e) => onSelect(e.target.checked)}
          className="w-4 h-4 text-blue-600 rounded cursor-pointer"
        />
      </td>

      {columnVisibility.id && (
        <td className="px-6 py-4 text-sm text-gray-500 font-mono">#{rma.id}</td>
      )}

      {columnVisibility.order && (
        <td className="px-6 py-4 text-sm font-medium text-blue-600 dark:text-blue-400">
          {rma.order?.code || `#${rma.orderId}`}
        </td>
      )}

      {columnVisibility.item && (
        <td className="px-6 py-4 text-sm text-gray-900 dark:text-white max-w-[200px] truncate" title={rma.orderItem?.nameSnapshot}>
          {rma.orderItem?.nameSnapshot || `Item #${rma.orderItemId}`}
        </td>
      )}

      {columnVisibility.type && (
        <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">
          {getTypeLabel(rma.type)}
        </td>
      )}

      {columnVisibility.reason && (
        <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400 max-w-[200px]">
          <div className="flex items-center">
             {hasEvidence && <ImageIcon className="w-4 h-4 text-blue-500 mr-2 flex-shrink-0" />}
             <span className="truncate" title={rma.reason}>{rma.reason || "Không có lý do"}</span>
          </div>
        </td>
      )}

      {columnVisibility.status && (
        <td className="px-6 py-4">
          <span className={`px-2.5 py-1 text-xs rounded-full font-medium ${getStatusColor(rma.status)}`}>
            {rma.status}
          </span>
        </td>
      )}

      {columnVisibility.createdAt && (
        <td className="px-6 py-4 text-sm text-gray-500">
          {new Date(rma.createdAt).toLocaleDateString('vi-VN')}
        </td>
      )}

      <td className="px-6 py-4 text-center">
        <div className="flex justify-center space-x-2">
          <button onClick={onQuickView} className="text-gray-500 hover:text-blue-600 dark:hover:text-blue-400" title="Xem chi tiết">
            <Eye className="w-4 h-4" />
          </button>
          <button onClick={onEdit} className="text-gray-500 hover:text-green-600 dark:hover:text-green-400" title="Xử lý">
            <Edit className="w-4 h-4" />
          </button>
          <button onClick={onDelete} className="text-gray-500 hover:text-red-600 dark:hover:text-red-400" title="Xóa">
            <Trash className="w-4 h-4" />
          </button>
        </div>
      </td>
    </tr>
  );
}