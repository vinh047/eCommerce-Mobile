// components/Checkout/AddressSection.jsx
"use client";

import { useEffect, useState, useMemo } from "react";
import { Button } from "@/components/ui/form/Button"; 
import { Input } from "@/components/ui/form/Input"; // Giả sử bạn có Input comp
import { MapPin, Store, Truck, Plus } from "lucide-react";

const HCMC_PROVINCE = "Hồ Chí Minh";
const HCMC_CODE = 79;
const HCMC_DISTRICT_API = `https://provinces.open-api.vn/api/v1/p/${HCMC_CODE}?depth=3`;

export default function AddressSection({
  addresses,
  selectedAddressId,
  onSelectAddressId,
  addressForm,
  onChangeAddressForm,
  onSaveAddress,
  savingAddress,
  onResetNewAddress,
  deliveryMethod,
  onChangeDeliveryMethod,
}) {
  const hasAddresses = addresses && addresses.length > 0;
  const [districts, setDistricts] = useState([]);
  const [loadingDistricts, setLoadingDistricts] = useState(false);
  const [isAddingNew, setIsAddingNew] = useState(false); // State cục bộ để hiện form thêm mới

  // Logic fetch API giữ nguyên ...
  useEffect(() => {
    async function fetchDistricts() {
      try {
        setLoadingDistricts(true);
        const res = await fetch(HCMC_DISTRICT_API);
        if (!res.ok) throw new Error("Failed to load HCMC districts");
        const data = await res.json();
        if (data && Array.isArray(data.districts)) setDistricts(data.districts);
      } catch (err) { console.error(err); } 
      finally { setLoadingDistricts(false); }
    }
    fetchDistricts();
  }, []);

  const wardOptions = useMemo(() => {
    if (!addressForm?.district) return [];
    const d = districts.find((dist) => dist.name === addressForm.district);
    return d?.wards || [];
  }, [districts, addressForm?.district]);

  // Handle khi user bấm "Nhập địa chỉ mới"
  const startAddNew = () => {
      setIsAddingNew(true);
      onSelectAddressId("new");
      onChangeAddressForm({
        line: "", ward: "", district: "", province: HCMC_PROVINCE, phone: "", isDefault: false,
      });
  };

  const cancelAddNew = () => {
      setIsAddingNew(false);
      // Reset về địa chỉ đầu tiên nếu có
      if (hasAddresses) onSelectAddressId(addresses[0].id);
      if (onResetNewAddress) onResetNewAddress();
  };

  const handleDistrictChange = (value) => {
    onChangeAddressForm({ ...addressForm, province: HCMC_PROVINCE, district: value, ward: "" });
  };

  const updateField = (field, value) => onChangeAddressForm({ ...addressForm, [field]: value });

  // Form Render (đã rút gọn style cho đẹp hơn)
  const renderForm = () => (
    <div className="bg-gray-50 p-5 rounded-xl border border-gray-200 mt-4 animate-in fade-in slide-in-from-top-2">
      <h4 className="font-semibold text-gray-800 mb-4">Thông tin giao hàng mới</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
         {/* Giữ nguyên logic input fields của bạn nhưng style lại Input/Select cho đẹp */}
         <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại người nhận</label>
            <Input value={addressForm.phone} onChange={(e) => updateField("phone", e.target.value)} placeholder="VD: 0901234567" />
         </div>
         
         <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Quận/Huyện</label>
            <select 
                className="w-full h-10 px-3 rounded-lg border border-gray-300 bg-white focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                value={addressForm.district || ""} 
                onChange={(e) => handleDistrictChange(e.target.value)}
            >
                <option value="">Chọn Quận/Huyện</option>
                {districts.map(d => <option key={d.code} value={d.name}>{d.name}</option>)}
            </select>
         </div>
         <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phường/Xã</label>
            <select 
                className="w-full h-10 px-3 rounded-lg border border-gray-300 bg-white focus:ring-2 focus:ring-blue-500 outline-none text-sm disabled:bg-gray-100"
                value={addressForm.ward || ""} 
                onChange={(e) => updateField("ward", e.target.value)}
                disabled={!addressForm.district}
            >
                <option value="">Chọn Phường/Xã</option>
                {wardOptions.map(w => <option key={w.code} value={w.name}>{w.name}</option>)}
            </select>
         </div>
         <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Địa chỉ cụ thể</label>
            <Input value={addressForm.line} onChange={(e) => updateField("line", e.target.value)} placeholder="Số nhà, tên đường..." />
         </div>
      </div>
      <div className="flex justify-end gap-3 mt-4">
         <Button outline size="sm" onClick={cancelAddNew}>Hủy bỏ</Button>
         <Button primary size="sm" onClick={onSaveAddress} loading={savingAddress}>Lưu địa chỉ này</Button>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* 1. Phương thức vận chuyển */}
      <div>
        <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
            <Truck className="w-5 h-5 text-blue-600"/> Phương thức vận chuyển
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
           {/* Card Giao hàng */}
           <div 
             onClick={() => onChangeDeliveryMethod("shipping")}
             className={`cursor-pointer rounded-xl border p-4 transition-all flex items-start gap-3
               ${deliveryMethod === "shipping" ? "border-blue-600 bg-blue-50 ring-1 ring-blue-600" : "border-gray-200 bg-white hover:border-gray-300"}
             `}
           >
              <div className={`p-2 rounded-full ${deliveryMethod === "shipping" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-500"}`}>
                 <Truck className="w-5 h-5" />
              </div>
              <div>
                 <p className={`font-semibold ${deliveryMethod === "shipping" ? "text-blue-900" : "text-gray-900"}`}>Giao hàng tận nơi</p>
                 <p className="text-sm text-gray-500 mt-1">Giao trong nội thành TP.HCM</p>
              </div>
           </div>

           {/* Card Nhận tại cửa hàng */}
           <div 
             onClick={() => onChangeDeliveryMethod("pickup")}
             className={`cursor-pointer rounded-xl border p-4 transition-all flex items-start gap-3
               ${deliveryMethod === "pickup" ? "border-blue-600 bg-blue-50 ring-1 ring-blue-600" : "border-gray-200 bg-white hover:border-gray-300"}
             `}
           >
              <div className={`p-2 rounded-full ${deliveryMethod === "pickup" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-500"}`}>
                 <Store className="w-5 h-5" />
              </div>
              <div>
                 <p className={`font-semibold ${deliveryMethod === "pickup" ? "text-blue-900" : "text-gray-900"}`}>Nhận tại cửa hàng</p>
                 <p className="text-sm text-gray-500 mt-1">273 An Dương Vương, Q.5</p>
              </div>
           </div>
        </div>
      </div>

      {/* 2. Chọn địa chỉ (Chỉ hiện khi chọn shipping) */}
      {deliveryMethod === "shipping" && (
        <div className="animate-in fade-in slide-in-from-top-2">
           <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-blue-600"/> Địa chỉ nhận hàng
           </h3>
           
           {!hasAddresses && !isAddingNew ? (
              // Chưa có địa chỉ nào -> Hiện form luôn
              renderForm()
           ) : (
             <div className="space-y-3">
                {/* List địa chỉ dạng Grid Card */}
                {!isAddingNew && (
                    <div className="grid grid-cols-1 gap-3">
                        {addresses.map((ad) => (
                        <div 
                            key={ad.id}
                            onClick={() => {
                                onSelectAddressId(ad.id);
                                onChangeAddressForm({ ...ad, isDefault: !!ad.isDefault }); // Update form state để shipping calc chạy
                            }}
                            className={`relative cursor-pointer rounded-xl border p-4 transition-all flex items-start gap-3
                                ${selectedAddressId === ad.id ? "border-blue-600 bg-blue-50/50" : "border-gray-200 bg-white hover:border-gray-300"}
                            `}
                        >
                            <div className={`mt-0.5 w-5 h-5 rounded-full border flex items-center justify-center
                                ${selectedAddressId === ad.id ? "border-blue-600" : "border-gray-400"}
                            `}>
                                {selectedAddressId === ad.id && <div className="w-2.5 h-2.5 rounded-full bg-blue-600" />}
                            </div>
                            <div className="flex-1">
                                <p className="font-medium text-gray-900">{ad.line}</p>
                                <p className="text-sm text-gray-600 mt-0.5">
                                    {[ad.ward, ad.district, ad.province].filter(Boolean).join(", ")}
                                </p>
                                <p className="text-sm text-gray-500 mt-1">SĐT: {ad.phone}</p>
                            </div>
                        </div>
                        ))}
                        
                        {/* Nút thêm mới */}
                        <button 
                            onClick={startAddNew}
                            className="w-full py-3 border border-dashed border-gray-300 rounded-xl flex items-center justify-center gap-2 text-gray-600 hover:text-blue-600 hover:border-blue-400 hover:bg-blue-50 transition-colors"
                        >
                            <Plus className="w-5 h-5" /> Thêm địa chỉ mới
                        </button>
                    </div>
                )}

                {/* Form thêm mới */}
                {isAddingNew && renderForm()}
             </div>
           )}
        </div>
      )}
    </div>
  );
}