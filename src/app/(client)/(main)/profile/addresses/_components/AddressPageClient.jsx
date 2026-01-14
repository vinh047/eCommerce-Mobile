"use client";

import { useEffect, useState } from "react";
import { Plus, MapPin } from "lucide-react";
import { Button } from "@/components/ui/form/Button";
import { toast } from "sonner";
import AddressCard from "./AddressCard";
import AddressFormModal from "./AddressFormModal";

export default function AddressPageClient() {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);

  // Action State
  const [deletingId, setDeletingId] = useState(null);

  // 1. Fetch List
  useEffect(() => {
    fetchAddresses();
  }, []);

  async function fetchAddresses() {
    try {
      setLoading(true);
      const res = await fetch("/api/addresses", { credentials: "include" });
      if (!res.ok) throw new Error("Lỗi tải danh sách");
      const data = await res.json();
      setAddresses(Array.isArray(data) ? data : data.data || []);
    } catch (err) {
      toast.error("Không tải được danh sách địa chỉ");
    } finally {
      setLoading(false);
    }
  }

  // 2. Save Handler (Create / Update)
  const handleSave = async (formData) => {
    const isEdit = !!editingAddress;
    const url = isEdit
      ? `/api/addresses/${editingAddress.id}`
      : "/api/addresses";
    const method = isEdit ? "PATCH" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Lưu thất bại");
      }

      const savedItem = await res.json();

      setAddresses((prev) => {
        if (isEdit)
          return prev.map((a) => (a.id === savedItem.id ? savedItem : a));
        return [savedItem, ...prev]; // Thêm mới vào đầu danh sách
      });

      toast.success(isEdit ? "Đã cập nhật địa chỉ" : "Đã thêm địa chỉ mới");
      setShowModal(false);
      setEditingAddress(null);
    } catch (err) {
      toast.error(err.message);
    }
  };

  // 3. Delete Handler
  const handleDelete = async (id) => {
    if (!confirm("Bạn có chắc muốn xóa địa chỉ này?")) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/addresses/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Xóa thất bại");
      setAddresses((prev) => prev.filter((a) => a.id !== id));
      toast.success("Đã xóa địa chỉ");
    } catch (err) {
      toast.error("Không thể xóa địa chỉ này");
    } finally {
      setDeletingId(null);
    }
  };

  // 4. Set Default Handler
  const handleSetDefault = async (id) => {
    try {
      const res = await fetch(`/api/addresses/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ isDefault: true }),
      });
      if (!res.ok) throw new Error("Lỗi đặt mặc định");
      const updated = await res.json();

      // Cập nhật state local: set item này true, các item khác false
      setAddresses((prev) =>
        prev.map((a) => ({
          ...a,
          isDefault: a.id === updated.id,
        }))
      );

      toast.success("Đã đặt làm địa chỉ mặc định");
    } catch (err) {
      toast.error("Lỗi khi đặt địa chỉ mặc định");
    }
  };

  // 5. Render
  if (loading) {
    return (
      <div className="p-8 text-center text-gray-500">Đang tải danh sách...</div>
    );
  }

  return (
    <div className="p-6 space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-blue-600" /> Sổ địa chỉ
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Quản lý nơi nhận hàng của bạn.
          </p>
        </div>
        <Button
          primary
          onClick={() => {
            setEditingAddress(null);
            setShowModal(true);
          }}
          className="shadow-lg shadow-blue-100"
        >
          <Plus className="w-4 h-4 mr-2" /> Thêm địa chỉ mới
        </Button>
      </div>

      {/* List */}
      {addresses.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-4 shadow-sm">
            <MapPin className="w-8 h-8 text-gray-300" />
          </div>
          <p className="text-gray-500 font-medium">Chưa có địa chỉ nào</p>
          <Button
            ghost
            className="mt-3 text-blue-600"
            onClick={() => {
              setEditingAddress(null);
              setShowModal(true);
            }}
          >
            Thêm ngay
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {addresses.map((addr) => (
            <AddressCard
              key={addr.id}
              address={addr}
              onEdit={(item) => {
                setEditingAddress(item);
                setShowModal(true);
              }}
              onDelete={handleDelete}
              onSetDefault={handleSetDefault}
              deletingId={deletingId}
            />
          ))}
        </div>
      )}

      {/* Modal Form */}
      <AddressFormModal
        open={showModal}
        onClose={() => setShowModal(false)}
        initialData={editingAddress}
        onSave={handleSave}
        isFirstAddress={addresses.length === 0}
      />
    </div>
  );
}
