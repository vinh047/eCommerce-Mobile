"use client";

import { useState } from "react";
import { X, AlertCircle, Package, CheckCircle } from "lucide-react";

export default function RmasModal({ rma, onClose, onSave }) {
  const [formData, setFormData] = useState({
    status: rma?.status || "pending",
    adminNote: "", // Giả định có trường adminNote để lưu phản hồi (cần thêm vào DB nếu chưa có)
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  const evidence = Array.isArray(rma?.evidenceJson) ? rma.evidenceJson : [];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center px-4">
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white dark:bg-gray-800 rounded-lg w-full max-w-2xl shadow-xl overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Xử lý yêu cầu #{rma.id}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500"><X className="w-5 h-5" /></button>
        </div>

        <div className="flex flex-col md:flex-row h-[60vh]">
           {/* Left Side: Info */}
           <div className="w-full md:w-1/2 p-6 border-r border-gray-200 dark:border-gray-700 overflow-y-auto bg-gray-50/30 dark:bg-gray-900/20">
              <h4 className="font-semibold text-gray-800 dark:text-white mb-3 flex items-center">
                 <AlertCircle className="w-4 h-4 mr-2 text-blue-500" /> Thông tin yêu cầu
              </h4>
              
              <div className="space-y-4 text-sm">
                 <div>
                    <p className="text-gray-500">Sản phẩm</p>
                    <p className="font-medium dark:text-gray-200">{rma.orderItem?.nameSnapshot}</p>
                 </div>
                 <div>
                    <p className="text-gray-500">Lý do khách báo</p>
                    <p className="bg-white dark:bg-gray-700 p-2 rounded border dark:border-gray-600 mt-1">{rma.reason}</p>
                 </div>
                 
                 {evidence.length > 0 && (
                    <div>
                       <p className="text-gray-500 mb-2">Bằng chứng (Ảnh/Video)</p>
                       <div className="grid grid-cols-3 gap-2">
                          {evidence.map((url, i) => (
                             <a key={i} href={url} target="_blank" rel="noreferrer" className="block border rounded overflow-hidden hover:opacity-80">
                                <img src={url} alt="evidence" className="w-full h-16 object-cover" />
                             </a>
                          ))}
                       </div>
                    </div>
                 )}
              </div>
           </div>

           {/* Right Side: Action */}
           <div className="w-full md:w-1/2 p-6 overflow-y-auto">
              <form onSubmit={handleSubmit} className="space-y-6">
                 <div>
                    <label className="block text-sm font-medium mb-2 dark:text-gray-300">Cập nhật trạng thái</label>
                    <select
                       value={formData.status}
                       onChange={(e) => setFormData({...formData, status: e.target.value})}
                       className="w-full border rounded-lg p-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-blue-500"
                    >
                       <option value="pending">Chờ xử lý</option>
                       <option value="approved">Chấp thuận (Duyệt)</option>
                       <option value="rejected">Từ chối</option>
                       <option value="completed">Hoàn tất (Đã xong)</option>
                    </select>
                 </div>

                 <div>
                    <label className="block text-sm font-medium mb-2 dark:text-gray-300">Ghi chú xử lý (Nội bộ)</label>
                    <textarea
                       value={formData.adminNote}
                       onChange={(e) => setFormData({...formData, adminNote: e.target.value})}
                       className="w-full border rounded-lg p-2 h-32 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                       placeholder="Nhập ghi chú cho nhân viên khác..."
                    />
                 </div>

                 <div className="pt-4 flex justify-end gap-2">
                    <button type="button" onClick={onClose} className="px-4 py-2 border rounded hover:bg-gray-50 dark:border-gray-600 dark:text-white">Hủy</button>
                    <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center">
                       <CheckCircle className="w-4 h-4 mr-2" /> Lưu xử lý
                    </button>
                 </div>
              </form>
           </div>
        </div>
      </div>
    </div>
  );
}