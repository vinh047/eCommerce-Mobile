"use client";

import { X, ShoppingCart, User, CreditCard } from "lucide-react";

export default function OrdersQuickViewModal({ order, onClose, onEdit }) {
  if (!order) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
      <div className="absolute top-0 right-0 h-full w-full max-w-lg bg-white dark:bg-gray-800 shadow-2xl transform transition-transform duration-300 flex flex-col">
          {/* Header */}
          <div className="p-6 bg-blue-600 text-white">
             <div className="flex justify-between items-start">
                <h2 className="text-xl font-bold flex items-center">
                   <ShoppingCart className="w-5 h-5 mr-2" /> Đơn hàng {order.code}
                </h2>
                <button onClick={onClose} className="text-white/80 hover:text-white"><X className="w-6 h-6" /></button>
             </div>
             <div className="mt-4 flex justify-between items-end">
                <div>
                   <p className="text-blue-100 text-sm">Ngày tạo</p>
                   <p className="font-medium">{new Date(order.createdAt).toLocaleDateString('vi-VN')}</p>
                </div>
                 <div className="text-right">
                   <p className="text-blue-100 text-sm">Tổng tiền</p>
                   <p className="font-bold text-2xl">{Number(order.total).toLocaleString()} ₫</p>
                </div>
             </div>
          </div>

          {/* Content */}
          <div className="flex-1 p-6 overflow-y-auto space-y-6">
             {/* Customer */}
             <div className="flex items-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <User className="w-5 h-5 text-gray-400 mr-3" />
                <div>
                   <p className="text-xs text-gray-500 dark:text-gray-400">Khách hàng</p>
                   <p className="font-medium text-gray-900 dark:text-white">{order.user?.name || `ID: ${order.userId}`}</p>
                   <p className="text-xs text-gray-500">{order.user?.email}</p>
                </div>
             </div>

             {/* Statuses */}
             <div className="grid grid-cols-2 gap-4">
                 <div className="p-3 border rounded-lg dark:border-gray-600">
                    <p className="text-xs text-gray-500">Trạng thái</p>
                    <span className="font-medium capitalize text-blue-600">{order.status}</span>
                 </div>
                  <div className="p-3 border rounded-lg dark:border-gray-600">
                    <p className="text-xs text-gray-500">Thanh toán</p>
                    <span className="font-medium capitalize text-green-600">{order.paymentStatus}</span>
                 </div>
             </div>

             {/* Items List */}
             <div>
                <h4 className="font-semibold mb-3 dark:text-white">Chi tiết sản phẩm</h4>
                <div className="space-y-3">
                   {order.items?.map((item, idx) => (
                      <div key={idx} className="flex justify-between text-sm border-b pb-2 dark:border-gray-700 last:border-0">
                         <div>
                            <p className="font-medium dark:text-gray-200">{item.nameSnapshot}</p>
                            <p className="text-xs text-gray-500">x{item.quantity}</p>
                         </div>
                         <p className="font-medium dark:text-gray-200">{(item.price * item.quantity).toLocaleString()} ₫</p>
                      </div>
                   ))}
                </div>
                
                {/* Summary */}
                <div className="mt-4 pt-4 border-t dark:border-gray-700 space-y-1 text-sm">
                   <div className="flex justify-between">
                      <span className="text-gray-500">Phí ship</span>
                      <span className="dark:text-gray-300">{Number(order.shippingFee).toLocaleString()} ₫</span>
                   </div>
                   <div className="flex justify-between">
                      <span className="text-gray-500">Giảm giá</span>
                      <span className="dark:text-gray-300">-{Number(order.discount).toLocaleString()} ₫</span>
                   </div>
                </div>
             </div>
          </div>

           {/* Footer */}
          <div className="p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
             <button 
               onClick={onEdit}
               className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium shadow"
             >
                Cập nhật đơn hàng
             </button>
          </div>
      </div>
    </div>
  );
}