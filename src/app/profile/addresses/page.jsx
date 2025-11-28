"use client";

import { useEffect, useState, useMemo } from "react";
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

export default function AddressManager() {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [error, setError] = useState("");

  // null | "new" | id
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);

  const isCreating = editingId === "new";
  const isEditingExisting = editingId !== null && editingId !== "new";

  // ====== DISTRICT / WARD (API giống checkout) ======
  const [districts, setDistricts] = useState([]);
  const [loadingDistricts, setLoadingDistricts] = useState(false);

  useEffect(() => {
    async function fetchDistricts() {
      try {
        setLoadingDistricts(true);
        const res = await fetch(HCMC_DISTRICT_API);
        if (!res.ok) throw new Error("Không tải được danh sách quận huyện");
        const data = await res.json();
        if (data && Array.isArray(data.districts)) {
          setDistricts(data.districts);
        }
      } catch (err) {
        console.error("fetchDistricts HCMC error:", err);
        toast.error("Không tải được danh sách quận/huyện");
      } finally {
        setLoadingDistricts(false);
      }
    }

    fetchDistricts();
  }, []);

  const wardOptions = useMemo(() => {
    if (!form.district) return [];
    const d = districts.find((dist) => dist.name === form.district);
    return d?.wards || [];
  }, [districts, form.district]);

  // ====== LOAD LIST ======
  useEffect(() => {
    fetchAddresses();
  }, []);

  async function fetchAddresses() {
    try {
      setLoading(true);
      setError("");

      const res = await fetch("/api/addresses", {
        credentials: "include",
      });

      if (!res.ok) {
        throw new Error("Không tải được danh sách địa chỉ");
      }

      const data = await res.json();
      const list = Array.isArray(data) ? data : data.data || [];
      setAddresses(list);
    } catch (err) {
      console.error("fetchAddresses error:", err);
      const msg = err.message || "Có lỗi xảy ra khi tải địa chỉ";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }

  // ====== FORM HELPERS ======
  const startCreate = () => {
    setEditingId("new");
    setForm({
      ...EMPTY_FORM,
      isDefault: addresses.length === 0,
    });
  };

  const startEdit = (addr) => {
    setEditingId(addr.id);
    setForm({
      line: addr.line || "",
      ward: addr.ward || "",
      district: addr.district || "",
      province: addr.province || HCMC_PROVINCE,
      phone: addr.phone || "",
      isDefault: !!addr.isDefault,
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
  };

  const handleChange = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleDistrictChange = (value) => {
    setForm((prev) => ({
      ...prev,
      province: HCMC_PROVINCE,
      district: value,
      ward: "",
    }));
  };

  // ====== SAVE (CREATE / UPDATE) ======
  async function handleSave(e) {
    if (e && e.preventDefault) e.preventDefault();
    setError("");

    if (!form.line || !form.district || !form.province || !form.phone) {
      const msg = "Vui lòng nhập đầy đủ địa chỉ và số điện thoại";
      setError(msg);
      toast.error(msg);
      return;
    }

    const payload = {
      line: form.line,
      ward: form.ward || null,
      district: form.district,
      province: form.province,
      phone: form.phone,
      isDefault: !!form.isDefault,
    };

    try {
      setSaving(true);

      let res;
      if (editingId === "new") {
        res = await fetch("/api/addresses", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(payload),
        });
      } else {
        // Ở client đang dùng PATCH → nhớ đảm bảo API /api/addresses/[id] hỗ trợ PATCH
        res = await fetch(`/api/addresses/${editingId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(payload),
        });
      }

      if (!res.ok) {
        let msg = "Lưu địa chỉ thất bại";
        try {
          const data = await res.json();
          if (data && data.message) msg = data.message;
        } catch (e) {}
        throw new Error(msg);
      }

      const saved = await res.json();

      setAddresses((prev) => {
        if (editingId === "new") return [saved, ...prev];
        return prev.map((a) => (a.id === saved.id ? saved : a));
      });

      setEditingId(null);
      setForm(EMPTY_FORM);

      toast.success(
        editingId === "new"
          ? "Thêm địa chỉ mới thành công"
          : "Cập nhật địa chỉ thành công"
      );
    } catch (err) {
      console.error("handleSave error:", err);
      const msg = err.message || "Lưu địa chỉ thất bại";
      setError(msg);
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  }

  // ====== DELETE ======
  async function handleDelete(id) {
    if (!confirm("Bạn có chắc muốn xóa địa chỉ này?")) return;

    try {
      setDeletingId(id);
      const res = await fetch(`/api/addresses/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!res.ok) {
        let msg = "Xóa địa chỉ thất bại";
        try {
          const data = await res.json();
          if (data && data.message) msg = data.message;
        } catch (e) {}
        throw new Error(msg);
      }

      setAddresses((prev) => prev.filter((a) => a.id !== id));

      if (editingId === id) {
        cancelEdit();
      }

      toast.success("Xóa địa chỉ thành công");
    } catch (err) {
      console.error("handleDelete error:", err);
      const msg = err.message || "Xóa địa chỉ thất bại";
      toast.error(msg);
    } finally {
      setDeletingId(null);
    }
  }

  // ====== SET DEFAULT ======
  async function handleSetDefault(id) {
    try {
      const res = await fetch(`/api/addresses/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ isDefault: true }),
      });

      if (!res.ok) {
        let msg = "Không đặt được địa chỉ mặc định";
        try {
          const data = await res.json();
          if (data && data.message) msg = data.message;
        } catch (e) {}
        throw new Error(msg);
      }

      const updated = await res.json();

      setAddresses((prev) =>
        prev.map((a) => ({
          ...a,
          isDefault: a.id === updated.id,
        }))
      );

      toast.success("Đã đặt địa chỉ mặc định");
    } catch (err) {
      console.error("handleSetDefault error:", err);
      const msg = err.message || "Không đặt được địa chỉ mặc định";
      toast.error(msg);
    }
  }

  // ====== RENDER ======
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-gray-900">Sổ địa chỉ</h1>
        <p className="text-sm text-gray-500 mt-1">
          Quản lý các địa chỉ nhận hàng của bạn.
        </p>
      </div>

      {error && (
        <div className="text-sm text-red-600 bg-red-50 border border-red-100 px-3 py-2 rounded">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-gray-500 text-sm">Đang tải danh sách địa chỉ…</div>
      ) : (
        <>
          {addresses.length === 0 ? (
            <div className="text-sm text-gray-500">
              Bạn chưa có địa chỉ nào. Hãy thêm địa chỉ mới bên dưới.
            </div>
          ) : (
            <div className="space-y-3">
              {addresses.map((addr) => (
                <div
                  key={addr.id}
                  className="border border-gray-200 rounded-lg p-4 flex justify-between gap-4"
                >
                  <div className="space-y-1 text-sm">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-900">
                        {addr.line}
                      </span>
                      {addr.isDefault && (
                        <span className="px-2 py-0.5 text-xs rounded-full bg-green-100 text-green-700">
                          Mặc định
                        </span>
                      )}
                    </div>
                    <div className="text-gray-600">
                      {[addr.ward, addr.district, addr.province]
                        .filter(Boolean)
                        .join(", ")}
                    </div>
                    {addr.phone && (
                      <div className="text-gray-600">
                        SĐT nhận hàng:{" "}
                        <span className="font-medium">{addr.phone}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col items-end gap-2 text-sm">
                    {!addr.isDefault && (
                      <Button
                        size="sm"
                        onClick={() => handleSetDefault(addr.id)}
                      >
                        Đặt làm mặc định
                      </Button>
                    )}

                    <Button size="sm" outline onClick={() => startEdit(addr)}>
                      Sửa
                    </Button>

                    <Button
                      size="sm"
                      outline
                      danger
                      onClick={() => handleDelete(addr.id)}
                      loading={deletingId === addr.id}
                    >
                      Xóa
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* FORM THÊM / SỬA */}
          <div className="mt-6 border-t border-gray-100 pt-4">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-base font-semibold text-gray-900">
                {isCreating
                  ? "Thêm địa chỉ mới"
                  : isEditingExisting
                  ? "Chỉnh sửa địa chỉ"
                  : "Thêm địa chỉ mới"}
              </h2>

              {!editingId && (
                <Button size="sm" primary onClick={startCreate}>
                  Thêm địa chỉ
                </Button>
              )}
            </div>

            {editingId && (
              <form onSubmit={handleSave} className="space-y-3 max-w-xl">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Tỉnh/Thành phố */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tỉnh/Thành phố
                    </label>
                    <input
                      type="text"
                      disabled
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-gray-50 text-gray-700"
                      value={form.province}
                    />
                  </div>

                  {/* Số điện thoại */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Số điện thoại nhận hàng
                    </label>
                    <input
                      type="text"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      value={form.phone}
                      onChange={(e) => handleChange("phone", e.target.value)}
                    />
                  </div>

                  {/* Quận/Huyện */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Quận/Huyện
                    </label>
                    <select
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none cursor-pointer"
                      value={form.district || ""}
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
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phường/Xã
                    </label>
                    <select
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none disabled:bg-gray-50 disabled:text-gray-400"
                      value={form.ward || ""}
                      onChange={(e) => handleChange("ward", e.target.value)}
                      disabled={!form.district}
                    >
                      <option value="">
                        {form.district
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
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Địa chỉ (số nhà, đường)
                    </label>
                    <input
                      type="text"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      value={form.line}
                      onChange={(e) => handleChange("line", e.target.value)}
                    />
                  </div>
                </div>

                {/* Mặc định */}
                <div className="flex items-center gap-2">
                  <input
                    id="addr-default"
                    type="checkbox"
                    className="h-4 w-4 text-blue-600 rounded border-gray-300"
                    checked={form.isDefault}
                    onChange={(e) =>
                      handleChange("isDefault", e.target.checked)
                    }
                  />
                  <label
                    htmlFor="addr-default"
                    className="text-sm text-gray-700"
                  >
                    Đặt làm địa chỉ mặc định
                  </label>
                </div>

                {/* Buttons */}
                <div className="flex gap-3">
                  <Button type="submit" primary loading={saving}>
                    {saving ? "Đang lưu..." : "Lưu địa chỉ"}
                  </Button>
                  <Button type="button" outline onClick={cancelEdit}>
                    Hủy
                  </Button>
                </div>
              </form>
            )}
          </div>
        </>
      )}
    </div>
  );
}
