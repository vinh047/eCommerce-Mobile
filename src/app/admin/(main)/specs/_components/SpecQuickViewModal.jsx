"use client";

import { 
  X, LayoutTemplate, Layers, Calendar, 
  Activity, GitBranch, Settings2 
} from "lucide-react";

export default function SpecQuickViewModal({ spec, onClose, onEdit, onConfigure }) {
  
  // Đóng khi click ra ngoài overlay
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden" onClick={handleOverlayClick}>
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
      
      {/* Panel trượt từ phải sang */}
      <div className="absolute top-0 right-0 h-full w-full max-w-md bg-white dark:bg-gray-800 shadow-2xl transform transition-transform duration-300 ease-in-out flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <LayoutTemplate className="w-6 h-6 text-blue-600" />
            Chi tiết Mẫu
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* Basic Info Block */}
          <div className="bg-gray-50 dark:bg-gray-700/30 p-5 rounded-xl border border-gray-100 dark:border-gray-700 text-center">
             <div className="w-16 h-16 mx-auto bg-blue-100 dark:bg-blue-900/50 rounded-full flex items-center justify-center mb-3 text-blue-600 dark:text-blue-400">
                <LayoutTemplate className="w-8 h-8" />
             </div>
             <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">{spec.name}</h3>
             <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                spec.isActive 
                  ? "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-400" 
                  : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-400"
             }`}>
                {spec.isActive ? "Đang kích hoạt" : "Đã ẩn"}
             </span>
          </div>

          {/* Details List */}
          <div className="space-y-4">
             <div className="flex justify-between items-center py-3 border-b border-gray-100 dark:border-gray-700">
                <span className="text-gray-500 dark:text-gray-400 flex items-center gap-2 text-sm">
                   <Layers className="w-4 h-4"/> Danh mục áp dụng
                </span>
                <span className="font-medium text-gray-900 dark:text-white">
                   {spec.category?.name || "Chưa phân loại"}
                </span>
             </div>

             <div className="flex justify-between items-center py-3 border-b border-gray-100 dark:border-gray-700">
                <span className="text-gray-500 dark:text-gray-400 flex items-center gap-2 text-sm">
                   <GitBranch className="w-4 h-4"/> Phiên bản hiện tại
                </span>
                <span className="font-mono font-medium text-blue-600 bg-blue-50 dark:bg-blue-900/20 px-2 py-0.5 rounded text-sm">
                   v{spec.version}
                </span>
             </div>

             <div className="flex justify-between items-center py-3 border-b border-gray-100 dark:border-gray-700">
                <span className="text-gray-500 dark:text-gray-400 flex items-center gap-2 text-sm">
                   <Activity className="w-4 h-4"/> Số lượng trường
                </span>
                <span className="font-medium text-gray-900 dark:text-white">
                   {spec._count?.productSpecs || 0} trường
                </span>
             </div>

             <div className="flex justify-between items-center py-3 border-b border-gray-100 dark:border-gray-700">
                <span className="text-gray-500 dark:text-gray-400 flex items-center gap-2 text-sm">
                   <Calendar className="w-4 h-4"/> Ngày tạo
                </span>
                <span className="text-sm text-gray-700 dark:text-gray-300">
                   {new Date(spec.createdAt).toLocaleDateString("vi-VN")}
                </span>
             </div>
          </div>

          {/* Description / Note (Optional placeholder) */}
          <div className="bg-blue-50 dark:bg-blue-900/10 p-4 rounded-lg border border-blue-100 dark:border-blue-800/30">
             <h4 className="text-sm font-semibold text-blue-800 dark:text-blue-300 mb-1 flex items-center gap-2">
                <Settings2 className="w-4 h-4"/> Lưu ý
             </h4>
             <p className="text-xs text-blue-700 dark:text-blue-400 leading-relaxed">
                Thay đổi cấu trúc mẫu này sẽ ảnh hưởng đến tất cả các sản phẩm đang sử dụng nó. Phiên bản sẽ tự động tăng sau mỗi lần lưu cấu hình.
             </p>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 flex gap-3">
           <button 
              onClick={onEdit}
              className="flex-1 py-2.5 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 rounded-lg font-medium hover:bg-white dark:hover:bg-gray-700 transition-colors shadow-sm"
           >
              Sửa thông tin
           </button>
           <button 
              onClick={onConfigure}
              className="flex-1 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-sm flex items-center justify-center gap-2"
           >
              <Settings2 className="w-4 h-4" /> Cấu hình
           </button>
        </div>

      </div>
    </div>
  );
}