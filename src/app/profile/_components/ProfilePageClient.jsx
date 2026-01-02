"use client";

import usersApi from "@/lib/api/usersApi";
import React, { useEffect, useState } from "react";
import {
  User,
  Mail,
  Calendar,
  ShoppingBag,
  CreditCard,
  Star,
  Camera,
  Edit3,
  Lock,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";

// Helper Format
const formatCurrency = (value) =>
  new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(value || 0);

const formatDate = (iso) =>
  iso
    ? new Intl.DateTimeFormat("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }).format(new Date(iso))
    : "";

// --- Component Badge ---
function StatusBadge({ status }) {
  const map = {
    active: { label: "Hoạt động", color: "bg-emerald-100 text-emerald-700" },
    blocked: { label: "Đã khoá", color: "bg-red-100 text-red-700" },
    deleted: { label: "Đã xoá", color: "bg-gray-100 text-gray-600" },
  };
  const cfg = map[status] || map.active;

  return (
    <span
      className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${cfg.color}`}
    >
      {cfg.label}
    </span>
  );
}

// --- Component Stats Card ---
function StatCard({ label, value, icon: Icon, colorClass }) {
  return (
    <div className="flex items-center gap-4 p-4 bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
      <div
        className={`w-12 h-12 rounded-xl flex items-center justify-center ${colorClass}`}
      >
        <Icon className="w-6 h-6" />
      </div>
      <div>
        <p className="text-sm text-gray-500 font-medium">{label}</p>
        <p className="text-xl font-bold text-gray-900">{value}</p>
      </div>
    </div>
  );
}

// -------- Modal Cập nhật thông tin --------
function UpdateProfileModal({ open, onClose, profile, onUpdated }) {
  const [name, setName] = useState(profile?.name || "");
  const [avatar, setAvatar] = useState(profile?.avatar || "");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open && profile) {
      setName(profile.name || "");
      setAvatar(profile.avatar || "");
    }
  }, [open, profile]);

  if (!open) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const updatedUser = await usersApi.updateUser(profile.id, {
        name,
        avatar,
      });
      toast.success("Cập nhật thông tin thành công!");
      onUpdated && onUpdated(updatedUser);
      setTimeout(onClose, 300);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Lỗi cập nhật.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
          <h3 className="font-semibold text-gray-900">Chỉnh sửa hồ sơ</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            ✕
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">
              Họ và tên
            </label>
            <input
              className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nhập tên hiển thị"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">
              Avatar URL
            </label>
            <input
              className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              value={avatar}
              onChange={(e) => setAvatar(e.target.value)}
              placeholder="https://example.com/avatar.jpg"
            />
          </div>
          <div className="pt-2 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm shadow-blue-200 transition-all disabled:opacity-70 flex items-center gap-2"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              Lưu thay đổi
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// -------- Modal Đổi mật khẩu --------
function ChangePasswordModal({ open, onClose, userId }) {
  const [form, setForm] = useState({ current: "", new: "", confirm: "" });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) setForm({ current: "", new: "", confirm: "" });
  }, [open]);

  if (!open) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.new !== form.confirm)
      return toast.error("Mật khẩu xác nhận không khớp");
    if (form.new.length < 6) return toast.error("Mật khẩu mới quá ngắn");

    try {
      setLoading(true);
      await usersApi.updateUser(userId, { password: form.new });
      toast.success("Đổi mật khẩu thành công!");
      setTimeout(onClose, 300);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Lỗi đổi mật khẩu.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
          <h3 className="font-semibold text-gray-900">Đổi mật khẩu</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {["current", "new", "confirm"].map((field) => (
            <div key={field} className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700 capitalize">
                {field === "current"
                  ? "Mật khẩu hiện tại"
                  : field === "new"
                  ? "Mật khẩu mới"
                  : "Xác nhận mật khẩu"}
              </label>
              <input
                type="password"
                className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                value={form[field]}
                onChange={(e) => setForm({ ...form, [field]: e.target.value })}
              />
            </div>
          ))}
          <div className="pt-2 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-50 hover:bg-gray-100 rounded-lg"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm shadow-blue-200 flex items-center gap-2"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              Xác nhận
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// -------- MAIN COMPONENT --------
export function ProfilePageClient() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openPassModal, setOpenPassModal] = useState(false);

  useEffect(() => {
    usersApi
      .getCurrentUser()
      .then(setProfile)
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex h-64 w-full items-center justify-center">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  if (!profile)
    return <div className="text-center py-10">Không tải được thông tin.</div>;

  const {
    name,
    email,
    avatar,
    status,
    stats = {},
    createdAt,
    passwordHash,
  } = profile;
  const hasPassword = Boolean(passwordHash);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* 1. Header & User Info Card */}
      <div className="relative overflow-hidden bg-white border border-gray-100 rounded-3xl shadow-sm p-6 sm:p-8">
        {/* Background Decor */}
        <div className="absolute top-0 right-0 -mt-4 -mr-4 w-32 h-32 bg-blue-50 rounded-full blur-3xl opacity-50 pointer-events-none" />

        <div className="relative flex flex-col md:flex-row gap-6 md:items-center">
          {/* Avatar Section */}
          <div className="flex-shrink-0 relative group mx-auto md:mx-0">
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full border-4 border-white shadow-lg overflow-hidden bg-gray-100">
              {avatar ? (
                <img
                  src={avatar}
                  alt={name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-500 to-indigo-600 text-white text-3xl font-bold">
                  {(name?.[0] || email?.[0] || "U").toUpperCase()}
                </div>
              )}
            </div>
            {/* Edit Icon Overlay */}
            <button
              onClick={() => setOpenEditModal(true)}
              className="absolute bottom-0 right-0 p-2 bg-white rounded-full shadow-md border border-gray-100 text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-colors"
              title="Cập nhật ảnh"
            >
              <Camera className="w-4 h-4" />
            </button>
          </div>

          {/* Info Section */}
          <div className="flex-1 text-center md:text-left space-y-2">
            <div className="flex flex-col md:flex-row items-center gap-3">
              <h1 className="text-2xl font-bold text-gray-900">
                {name || "Khách hàng"}
              </h1>
              <StatusBadge status={status || "active"} />
            </div>

            <div className="flex flex-col md:flex-row items-center gap-x-6 gap-y-1 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                {email}
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Tham gia: {formatDate(createdAt)}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <button
              onClick={() => setOpenEditModal(true)}
              className="flex-1 sm:flex-none inline-flex justify-center items-center gap-2 px-4 py-2.5 bg-gray-900 text-white text-sm font-medium cursor-pointer rounded-xl hover:bg-black transition-colors shadow-lg shadow-gray-200"
            >
              <Edit3 className="w-4 h-4" />
              Chỉnh sửa
            </button>
            {hasPassword && (
              <button
                onClick={() => setOpenPassModal(true)}
                className="flex-1 sm:flex-none inline-flex justify-center items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 text-gray-700 text-sm font-medium rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-colors"
              >
                <Lock className="w-4 h-4" />
                Đổi mật khẩu
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 2. Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <StatCard
          label="Đơn hàng"
          value={stats.totalOrders ?? 0}
          icon={ShoppingBag}
          colorClass="bg-blue-50 text-blue-600"
        />
        <StatCard
          label="Tổng chi tiêu"
          value={formatCurrency(stats.totalSpent ?? 0)}
          icon={CreditCard}
          colorClass="bg-violet-50 text-violet-600"
        />
        <StatCard
          label="Đánh giá"
          value={stats.totalReviews ?? 0}
          icon={Star}
          colorClass="bg-amber-50 text-amber-600"
        />
      </div>

      {/* Modals */}
      <UpdateProfileModal
        open={openEditModal}
        onClose={() => setOpenEditModal(false)}
        profile={profile}
        onUpdated={setProfile}
      />
      <ChangePasswordModal
        open={openPassModal}
        onClose={() => setOpenPassModal(false)}
        userId={profile.id}
      />
    </div>
  );
}
