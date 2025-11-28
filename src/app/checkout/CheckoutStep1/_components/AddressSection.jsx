"use client";

import { useEffect, useState, useMemo } from "react";
import { Button } from "@/components/ui/form/Button";
import Field from "./Field";

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
  onResetAddressToDefault,

  deliveryMethod, // "pickup" | "shipping"
  onChangeDeliveryMethod,
}) {
  const hasAddresses = addresses && addresses.length > 0;

  const [districts, setDistricts] = useState([]);
  const [loadingDistricts, setLoadingDistricts] = useState(false);

  useEffect(() => {
    async function fetchDistricts() {
      try {
        setLoadingDistricts(true);
        const res = await fetch(HCMC_DISTRICT_API);
        if (!res.ok) throw new Error("Failed to load HCMC districts");
        const data = await res.json();
        if (data && Array.isArray(data.districts)) {
          setDistricts(data.districts);
        }
      } catch (err) {
        console.error("fetchDistricts HCMC error:", err);
      } finally {
        setLoadingDistricts(false);
      }
    }
    fetchDistricts();
  }, []);

  const wardOptions = useMemo(() => {
    if (!addressForm?.district) return [];
    const d = districts.find((dist) => dist.name === addressForm.district);
    return d?.wards || [];
  }, [districts, addressForm?.district]);

  const updateField = (field, value) => {
    onChangeAddressForm({
      ...addressForm,
      [field]: value,
    });
  };

  const handleDistrictChange = (value) => {
    onChangeAddressForm({
      ...addressForm,
      province: HCMC_PROVINCE,
      district: value,
      ward: "",
    });
  };

  const renderNewAddressForm = () => (
    <>
      <div className="text-sm text-gray-700 font-medium mb-2">Nhập địa chỉ</div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Tỉnh/Thành phố: cố định Hồ Chí Minh */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tỉnh/Thành phố
          </label>
          <div className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-gray-50 text-gray-800 text-sm">
            {HCMC_PROVINCE}
          </div>
          <p className="mt-1 text-xs text-gray-500">
            Hiện tại chỉ hỗ trợ giao hàng tại TP. Hồ Chí Minh.
          </p>
        </div>

        {/* Số điện thoại nhận hàng */}
        <Field
          label="Số điện thoại nhận hàng"
          value={addressForm.phone || ""}
          onChange={(v) => updateField("phone", v)}
        />

        {/* Quận/Huyện */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Quận/Huyện
          </label>
          <select
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none cursor-pointer"
            value={addressForm.district || ""}
            onChange={(e) => handleDistrictChange(e.target.value)}
          >
            <option value="">Chọn quận/huyện</option>
            {districts.map((d) => (
              <option key={d.code} value={d.name}>
                {d.name}
              </option>
            ))}
          </select>
          {loadingDistricts && (
            <p className="mt-1 text-xs text-gray-400">
              Đang tải danh sách quận/huyện…
            </p>
          )}
        </div>

        {/* Phường/Xã */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Phường/Xã
          </label>
          <select
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none disabled:bg-gray-50 disabled:text-gray-400 cursor-pointer"
            value={addressForm.ward || ""}
            onChange={(e) => updateField("ward", e.target.value)}
            disabled={!addressForm.district}
          >
            <option value="">
              {addressForm.district
                ? "Chọn phường/xã"
                : "Chọn quận/huyện trước"}
            </option>
            {wardOptions.map((w) => (
              <option key={w.code} value={w.name}>
                {w.name}
              </option>
            ))}
          </select>
        </div>

        {/* Địa chỉ chi tiết */}
        <Field
          label="Địa chỉ (số nhà, đường)"
          value={addressForm.line}
          onChange={(v) => updateField("line", v)}
          className="md:col-span-2"
        />
      </div>

      <div className="mt-3 flex gap-3">
        <Button
          primary
          size="sm"
          onClick={onSaveAddress}
          loading={savingAddress}
          className="cursor-pointer"
        >
          {savingAddress ? "Đang lưu..." : "Lưu địa chỉ"}
        </Button>

        <Button
          size="sm"
          outline
          onClick={() => {
            if (onResetNewAddress) {
              onResetNewAddress();
            } else {
              onChangeAddressForm({
                line: "",
                ward: "",
                district: "",
                province: HCMC_PROVINCE,
                phone: "",
                isDefault: true,
              });
            }
          }}
          className="cursor-pointer"
        >
          Hủy
        </Button>
      </div>
    </>
  );

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">
        Thông tin nhận hàng
      </h2>

      {/* Hình thức nhận hàng */}
      <div className="mb-4">
        <div className="text-sm text-gray-700 font-medium mb-2">
          Hình thức nhận hàng
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Nhận tại cửa hàng */}
          <button
            type="button"
            onClick={() => onChangeDeliveryMethod("pickup")}
            className={`border rounded-lg px-3 py-2 text-left text-sm flex items-start gap-2 cursor-pointer ${
              deliveryMethod === "pickup"
                ? "border-blue-500 bg-blue-50"
                : "border-gray-200 bg-white"
            }`}
          >
            <input
              type="radio"
              name="deliveryMethod"
              checked={deliveryMethod === "pickup"}
              readOnly
              className="mt-0.5 cursor-pointer"
            />
            <div className="cursor-pointer">
              <div className="font-medium text-gray-900">Nhận tại cửa hàng</div>
              <div className="text-xs text-gray-600">
                Địa chỉ: 273 An Dương Vương, P. Chợ Quán, Q.5, TP.HCM
              </div>
            </div>
          </button>

          {/* Giao hàng tận nơi */}
          <button
            type="button"
            onClick={() => onChangeDeliveryMethod("shipping")}
            className={`border rounded-lg px-3 py-2 text-left text-sm flex items-start gap-2 cursor-pointer ${
              deliveryMethod === "shipping"
                ? "border-blue-500 bg-blue-50"
                : "border-gray-200 bg-white"
            }`}
          >
            <input
              type="radio"
              name="deliveryMethod"
              checked={deliveryMethod === "shipping"}
              readOnly
              className="mt-0.5 cursor-pointer"
            />
            <div className="cursor-pointer">
              <div className="font-medium text-gray-900">Giao hàng tận nơi</div>
              <div className="text-xs text-gray-600">
                Giao trong TP. Hồ Chí Minh, phí ship tính theo khoảng cách
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* Nếu chọn giao hàng thì mới hiển thị địa chỉ */}
      {deliveryMethod === "shipping" && (
        <>
          {!hasAddresses ? (
            renderNewAddressForm()
          ) : (
            <>
              {/* Địa chỉ đã lưu */}
              <div className="mb-4">
                <div className="text-sm text-gray-700 font-medium mb-2">
                  Địa chỉ đã lưu
                </div>
                <ul className="space-y-2">
                  {addresses.map((ad) => (
                    <li key={ad.id}>
                      <label className="p-3 border rounded-lg bg-white flex items-start gap-3 cursor-pointer">
                        <input
                          type="radio"
                          name="selectedAddress"
                          checked={selectedAddressId === ad.id}
                          onChange={() => {
                            onSelectAddressId(ad.id);
                            onChangeAddressForm({
                              line: ad.line || "",
                              ward: ad.ward || "",
                              district: ad.district || "",
                              province: ad.province || HCMC_PROVINCE,
                              phone: ad.phone || "",   // 👈 copy phone
                              isDefault: !!ad.isDefault,
                            });
                          }}
                          className="mt-1 cursor-pointer"
                        />
                        <div className="flex-1 cursor-pointer">
                          <div className="text-sm font-medium text-gray-900">
                            {ad.line}
                          </div>
                          <div className="text-sm text-gray-600">
                            {[ad.ward, ad.district, ad.province]
                              .filter(Boolean)
                              .join(", ")}
                          </div>
                          {ad.phone && (
                            <div className="text-xs text-gray-500 mt-1">
                              SĐT: {ad.phone}
                            </div>
                          )}
                        </div>
                      </label>
                    </li>
                  ))}

                  {/* Chọn nhập địa chỉ mới */}
                  <li>
                    <label className="p-3 border rounded-lg cursor-pointer bg-white flex items-start gap-3">
                      <input
                        type="radio"
                        name="selectedAddress"
                        checked={selectedAddressId === "new"}
                        onChange={() => {
                          onSelectAddressId("new");
                          onChangeAddressForm({
                            line: "",
                            ward: "",
                            district: "",
                            province: HCMC_PROVINCE,
                            phone: "",
                            isDefault: false,
                          });
                        }}
                        className="mt-1 cursor-pointer"
                      />
                      <div className="flex-1 cursor-pointer">
                        <div className="text-sm font-medium text-gray-900">
                          Nhập địa chỉ mới
                        </div>
                        <div className="text-sm text-gray-600">
                          Bạn có thể nhập địa chỉ mới để giao hàng trong TP. Hồ
                          Chí Minh
                        </div>
                      </div>
                    </label>
                  </li>
                </ul>
              </div>

              {/* Form địa chỉ mới */}
              {selectedAddressId === "new" && (
                <>
                  {renderNewAddressForm()}
                  <div className="mt-3 flex gap-3" />
                </>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
}
