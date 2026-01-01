import React, { useEffect, useState, useMemo } from "react";
import { Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/form/Button";
import { toast } from "sonner";

const HCMC_PROVINCE = "Hồ Chí Minh";
const HCMC_CODE = 79;
const HCMC_DISTRICT_API = `https://provinces.open-api.vn/api/v1/p/${HCMC_CODE}?depth=3`;

const EMPTY_FORM = {
  line: "",
  ward: "",
  district: "",
  province: HCMC_PROVINCE,
  phone: "",
  isDefault: false,
};

export default function AddressFormModal({
  open,
  onClose,
  initialData,
  onSave,
  isFirstAddress,
}) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [districts, setDistricts] = useState([]);
  const [loadingDistricts, setLoadingDistricts] = useState(false);
  const [saving, setSaving] = useState(false);

  // 1. Load data khi mở modal
  useEffect(() => {
    if (open) {
      if (initialData) {
        // Edit mode
        setForm({
          line: initialData.line || "",
          ward: initialData.ward || "",
          district: initialData.district || "",
          province: initialData.province || HCMC_PROVINCE,
          phone: initialData.phone || "",
          isDefault: !!initialData.isDefault,
        });
      } else {
        // Create mode
        setForm({
          ...EMPTY_FORM,
          isDefault: isFirstAddress, // Nếu chưa có địa chỉ nào, auto check default
        });
      }
    }
  }, [open, initialData, isFirstAddress]);

  // 2. Fetch Districts API
  useEffect(() => {
    if (open && districts.length === 0) {
      setLoadingDistricts(true);
      fetch(HCMC_DISTRICT_API)
        .then((res) => res.json())
        .then((data) => {
          if (data?.districts) setDistricts(data.districts);
        })
        .catch(() => toast.error("Lỗi tải danh sách Quận/Huyện"))
        .finally(() => setLoadingDistricts(false));
    }
  }, [open, districts.length]);

  // 3. Tính toán danh sách Phường/Xã dựa trên Quận/Huyện đã chọn
  const wardOptions = useMemo(() => {
    if (!form.district) return [];
    const d = districts.find((dist) => dist.name === form.district);
    return d?.wards || [];
  }, [districts, form.district]);

  // 4. Handlers
  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleDistrictChange = (value) => {
    setForm((prev) => ({
      ...prev,
      district: value,
      ward: "", // Reset ward khi đổi district
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.line || !form.district || !form.phone) {
      return toast.error("Vui lòng nhập đầy đủ thông tin");
    }

    setSaving(true);
    await onSave(form); // Gọi hàm save từ cha truyền xuống
    setSaving(false);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <h3 className="font-bold text-gray-900 text-lg">
            {initialData ? "Cập nhật địa chỉ" : "Thêm địa chỉ mới"}
          </h3>
          <button
            onClick={onClose}
            className="p-2 -mr-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body (Scrollable) */}
        <div className="p-6 overflow-y-auto custom-scrollbar">
          <form id="address-form" onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Phone */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700">
                  Số điện thoại <span className="text-red-500">*</span>
                </label>
                <input
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                  value={form.phone}
                  onChange={(e) => handleChange("phone", e.target.value)}
                  placeholder="09xx..."
                />
              </div>

              {/* Province (Fixed) */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700">
                  Tỉnh/Thành phố
                </label>
                <div className="w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-gray-500 cursor-not-allowed">
                  {HCMC_PROVINCE}
                </div>
              </div>

              {/* District */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700">
                  Quận/Huyện <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none appearance-none bg-white cursor-pointer"
                    value={form.district}
                    onChange={(e) => handleDistrictChange(e.target.value)}
                    disabled={loadingDistricts}
                  >
                    <option value="">Chọn Quận/Huyện</option>
                    {districts.map((d) => (
                      <option key={d.code} value={d.name}>
                        {d.name}
                      </option>
                    ))}
                  </select>
                  {loadingDistricts && (
                    <Loader2 className="absolute right-3 top-3 w-4 h-4 animate-spin text-blue-500" />
                  )}
                </div>
              </div>

              {/* Ward */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700">
                  Phường/Xã <span className="text-red-500">*</span>
                </label>
                <select
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none appearance-none bg-white cursor-pointer disabled:bg-gray-50 disabled:text-gray-400"
                  value={form.ward}
                  onChange={(e) => handleChange("ward", e.target.value)}
                  disabled={!form.district}
                >
                  <option value="">Chọn Phường/Xã</option>
                  {wardOptions.map((w) => (
                    <option key={w.code} value={w.name}>
                      {w.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Line Address */}
              <div className="md:col-span-2 space-y-1.5">
                <label className="text-sm font-medium text-gray-700">
                  Địa chỉ cụ thể <span className="text-red-500">*</span>
                </label>
                <input
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                  value={form.line}
                  onChange={(e) => handleChange("line", e.target.value)}
                  placeholder="Số nhà, tên đường, tòa nhà..."
                />
              </div>
            </div>

            {/* Checkbox Default */}
            <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors">
              <input
                type="checkbox"
                className="w-5 h-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                checked={form.isDefault}
                onChange={(e) => handleChange("isDefault", e.target.checked)}
              />
              <span className="text-sm font-medium text-gray-700">
                Đặt làm địa chỉ mặc định
              </span>
            </label>
          </form>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-100 flex justify-end gap-3 bg-white">
          <Button outline onClick={onClose} type="button">
            Hủy bỏ
          </Button>
          <Button
            primary
            type="submit"
            form="address-form"
            loading={saving}
            className="px-6 shadow-lg shadow-blue-200"
          >
            {saving ? "Đang lưu..." : "Lưu địa chỉ"}
          </Button>
        </div>
      </div>
    </div>
  );
}
