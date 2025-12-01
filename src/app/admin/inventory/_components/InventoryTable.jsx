"use client";
import Pagination from "@/components/common/Pagination";
import InventoryTableRow from "./InventoryTableRow";

export default function InventoryTable({ transactions, totalItems, onViewDetail }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Mã phiếu</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Loại</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Số lượng</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Thời gian & Ghi chú</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase"> Người tạo </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {transactions.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                  Chưa có giao dịch kho nào.
                </td>
              </tr>
            ) : (
              transactions.map((txn) => (
                <InventoryTableRow 
                  key={txn.id} 
                  ticket={txn} 
                  onViewDetail={onViewDetail}
                />
              ))
            )}
          </tbody>
        </table>
      </div>
      <Pagination totalItems={totalItems} label="giao dịch" />
    </div>
  );
}