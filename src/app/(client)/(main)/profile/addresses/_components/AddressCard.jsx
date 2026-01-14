import React from "react";
import { MapPin, Phone, CheckCircle, Trash2, Edit2, Star } from "lucide-react";
import { Button } from "@/components/ui/form/Button";

export default function AddressCard({
  address,
  onEdit,
  onDelete,
  onSetDefault,
  deletingId,
}) {
  const isDeleting = deletingId === address.id;

  return (
    <div
      className={`relative p-5 rounded-2xl border transition-all duration-200 ${
        address.isDefault
          ? "bg-blue-50/50 border-blue-200 shadow-sm"
          : "bg-white border-gray-100 hover:border-gray-300 hover:shadow-md"
      }`}
    >
      {/* Badge Mặc định */}
      {address.isDefault && (
        <div className="absolute top-4 right-4 flex items-center gap-1.5 text-xs font-semibold text-blue-600 bg-blue-100 px-2.5 py-1 rounded-full">
          <CheckCircle className="w-3.5 h-3.5" />
          Mặc định
        </div>
      )}

      <div className="flex flex-col gap-2 pr-12">
        {/* Địa chỉ */}
        <div className="flex items-start gap-3">
          <MapPin
            className={`w-5 h-5 mt-0.5 shrink-0 ${
              address.isDefault ? "text-blue-500" : "text-gray-400"
            }`}
          />
          <div>
            <p className="text-sm font-medium text-gray-900 leading-snug">
              {address.line}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {[address.ward, address.district, address.province]
                .filter(Boolean)
                .join(", ")}
            </p>
          </div>
        </div>

        {/* Số điện thoại */}
        <div className="flex items-center gap-3">
          <Phone
            className={`w-5 h-5 shrink-0 ${
              address.isDefault ? "text-blue-500" : "text-gray-400"
            }`}
          />
          <p className="text-sm text-gray-700 font-medium">{address.phone}</p>
        </div>
      </div>

      {/* Actions Footer */}
      <div className="mt-5 pt-4 border-t border-gray-100/50 flex flex-wrap items-center justify-between gap-3">
        {/* Nút đặt mặc định */}
        {!address.isDefault ? (
          <button
            onClick={() => onSetDefault(address.id)}
            className="text-xs font-medium text-gray-500 hover:text-blue-600 flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Star className="w-4 h-4" />
            Đặt làm mặc định
          </button>
        ) : (
          <span className="text-xs text-blue-600 font-medium flex items-center gap-1.5">
            <Star className="w-4 h-4 fill-blue-600" />
            Địa chỉ mặc định
          </span>
        )}

        {/* Edit / Delete Buttons */}
        <div className="flex items-center gap-2 ml-auto">
          <Button
            size="sm"
            ghost
            className="h-8 px-3 text-gray-600 hover:bg-gray-100 hover:text-blue-600"
            onClick={() => onEdit(address)}
          >
            <Edit2 className="w-3.5 h-3.5 mr-1.5" />
            Sửa
          </Button>

          <Button
            size="sm"
            ghost
            className="h-8 px-3 text-gray-500 hover:bg-red-50 hover:text-red-600"
            onClick={() => onDelete(address.id)}
            loading={isDeleting}
            disabled={isDeleting}
          >
            <Trash2 className="w-3.5 h-3.5 mr-1.5" />
            Xóa
          </Button>
        </div>
      </div>
    </div>
  );
}
