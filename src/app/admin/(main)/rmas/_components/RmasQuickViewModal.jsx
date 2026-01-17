"use client";

import { X, FileText, Package } from "lucide-react";

export default function RmasQuickViewModal({ rma, onClose, onEdit }) {
  if (!rma) return null;
  const evidence = Array.isArray(rma.evidenceJson) ? rma.evidenceJson : [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4" onClick={(e) => e.target === e.currentTarget && onClose()}>
       <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
       <div className="relative bg-white dark:bg-gray-800 rounded-lg w-full max-w-md shadow-xl overflow-hidden flex flex-col max-h-[80vh]">
          <div className="p-4 bg-orange-500 text-white flex justify-between items-center">
             <h3 className="font-bold flex items-center"><FileText className="w-4 h-4 mr-2"/> RMA #{rma.id}</h3>
             <button onClick={onClose}><X className="w-5 h-5 hover:text-gray-200"/></button>
          </div>

          <div className="p-6 space-y-4 overflow-y-auto flex-1">
             <div className="flex items-center gap-3 p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-100 dark:border-orange-800">
                <Package className="w-8 h-8 text-orange-500" />
                <div>
                   <p className="text-xs text-gray-500 dark:text-gray-400">Sản phẩm yêu cầu</p>
                   <p className="font-medium text-gray-900 dark:text-white text-sm line-clamp-2">{rma.orderItem?.nameSnapshot}</p>
                </div>
             </div>

             <div>
                <span className="text-xs uppercase font-bold text-gray-400 mb-1 block">Lý do</span>
                <p className="bg-gray-50 dark:bg-gray-700 p-3 rounded text-sm text-gray-800 dark:text-gray-200">{rma.reason}</p>
             </div>

             {evidence.length > 0 && (
                <div>
                   <span className="text-xs uppercase font-bold text-gray-400 mb-2 block">Hình ảnh đính kèm</span>
                   <div className="grid grid-cols-3 gap-2">
                      {evidence.map((url, i) => (
                         <img key={i} src={url} className="w-full h-20 object-cover rounded border dark:border-gray-600" />
                      ))}
                   </div>
                </div>
             )}
          </div>

          <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
             <button onClick={onEdit} className="w-full py-2 bg-blue-600 text-white rounded font-medium hover:bg-blue-700 transition">
                Xử lý yêu cầu này
             </button>
          </div>
       </div>
    </div>
  );
}