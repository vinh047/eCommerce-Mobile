"use client";

import { Eye, FileText, Package, Hash } from "lucide-react";
import { useMemo } from "react";

// Component này hiển thị thông tin TỔNG HỢP của một PHIẾU KHO (InventoryTicket)
export default function InventoryTableRow({ ticket, onViewDetail }) {
  // 1. Xử lý trường hợp TICKET KHÔNG TỒN TẠI (null/undefined)
  if (!ticket) {
    return (
      <tr className="border-b border-gray-200 dark:border-gray-700">
        <td colSpan={6} className="px-6 py-4 text-center text-gray-500 italic">
          Không tìm thấy thông tin phiếu kho.
        </td>
      </tr>
    );
  }

  const formatDate = (dateString) => {
    // Bảo vệ khỏi dateString null/undefined
    return dateString ? new Date(dateString).toLocaleString("vi-VN") : "N/A";
  };

  const getTypeStyle = (type) => {
    switch (type) {
      case "in":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300";
      case "out":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300";
      case "adjustment":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
    }
  };

  const getTypeLabel = (type) => {
    const map = { in: "Nhập kho", out: "Xuất kho", adjustment: "Kiểm kê" };
    // Sử dụng ticket.type an toàn
    return map[ticket.type] || ticket.type || "N/A";
  };

  // 2. Tính toán tổng số lượng và tổng số dòng sản phẩm (variants)
  const { totalQuantity, totalVariants } = useMemo(() => {
    // Đảm bảo ticket.transactions là một mảng rỗng nếu nó là null/undefined
    const transactions = ticket.transactions || [];

    // Nếu không có transactions, trả về 0
    if (transactions.length === 0) {
      return { totalQuantity: 0, totalVariants: 0 };
    }

    // Tính tổng số lượng (quantity)
    const quantity = transactions.reduce(
      (sum, txn) => sum + (txn.quantity || 0),
      0
    );

    // Tính tổng số dòng (variants)
    const variants = transactions.length;

    return { totalQuantity: quantity, totalVariants: variants };
  }, [ticket.transactions]); // Chỉ phụ thuộc vào transactions để tính toán lại

  return (
    <tr className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">
      {/* Mã phiếu */}
      <td className="px-6 py-4 text-sm font-mono text-gray-900 dark:text-white font-semibold">
        {ticket.code || "N/A"} {/* Bảo vệ thuộc tính 'code' */}
      </td>

      {/* Loại giao dịch */}
      <td className="px-6 py-4">
        {/* Sử dụng ticket.type an toàn trong getTypeStyle */}
        <span
          className={`px-2 py-1 text-xs rounded font-medium ${getTypeStyle(
            ticket.type
          )}`}
        >
          {getTypeLabel(ticket.type)}
        </span>
      </td>

      {/* Số lượng & Số dòng */}
      <td className="px-6 py-4">
        <div className="text-sm text-gray-900 dark:text-white font-semibold">
          {totalQuantity} sản phẩm
        </div>
        <div className="text-xs text-gray-500 flex items-center mt-1">
          <Package className="w-3 h-3 mr-1" />
          {totalVariants} dòng
        </div>
      </td>

      {/* Ngày tạo & Ghi chú */}
      <td className="px-6 py-4">
        <div className="text-sm text-gray-900 dark:text-white">
          {formatDate(ticket.createdAt)} {/* Bảo vệ thuộc tính 'createdAt' */}
        </div>
        <div className="text-xs text-gray-500 flex items-center mt-1">
          <FileText className="w-3 h-3 mr-1" />
          {ticket.note || "Không có ghi chú"}
        </div>
      </td>

      {/* Người tạo */}
      <td className="px-6 py-4 text-sm text-gray-500">
        {/* Bảo vệ thuộc tính 'staff' và 'name' */}
        {ticket.staff?.name || "N/A"}
      </td>

      {/* Actions */}
      <td className="px-6 py-4 text-right">
        <button
          onClick={() => onViewDetail(ticket)} // Truyền toàn bộ ticket
          className="text-blue-600 hover:text-blue-800 p-1 rounded hover:bg-blue-50 cursor-pointer"
          title="Xem chi tiết phiếu"
        >
          <Eye className="w-4 h-4" />
        </button>
      </td>
    </tr>
  );
}
