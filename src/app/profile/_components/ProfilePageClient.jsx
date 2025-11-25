// components/profile/ProfilePageClient.jsx
"use client";

import usersApi from "@/lib/api/usersApi";
import React, { useEffect, useState } from "react";

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

function StatusBadge({ status }) {
  const map = {
    active: {
      label: "Đang hoạt động",
      className: "bg-emerald-50 text-emerald-700 border-emerald-200",
    },
    blocked: {
      label: "Đã bị khoá",
      className: "bg-red-50 text-red-700 border-red-200",
    },
    deleted: {
      label: "Đã xoá",
      className: "bg-gray-50 text-gray-500 border-gray-200",
    },
  };

  const cfg = map[status] || map.active;

  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${cfg.className}`}
    >
      <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-current" />
      {cfg.label}
    </span>
  );
}

// -------- Modal cập nhật thông tin --------
function UpdateProfileModal({ open, onClose, profile, onUpdated }) {
  const [name, setName] = useState(profile?.name || "");
  const [avatar, setAvatar] = useState(profile?.avatar || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (open && profile) {
      setName(profile.name || "");
      setAvatar(profile.avatar || "");
      setError("");
      setSuccess("");
    }
  }, [open, profile]);

  if (!open) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      setLoading(true);

      // 👉 DÙNG HÀM updateUser, truyền id + data
      const updatedUser = await usersApi.updateUser(profile.id, {
        name,
        avatar,
      });

      setSuccess("Cập nhật thông tin thành công.");
      onUpdated && onUpdated(updatedUser);

      setTimeout(() => {
        onClose();
      }, 600);
    } catch (err) {
      console.error("Lỗi cập nhật thông tin:", err);
      setError(
        err?.response?.data?.message ||
          "Không thể cập nhật thông tin. Vui lòng thử lại."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-md rounded-xl bg-white shadow-lg">
        <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
          <h3 className="text-sm font-semibold text-gray-900">
            Cập nhật thông tin
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-xl leading-none"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-4 py-4 space-y-3 text-sm">
          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-600">
              Họ và tên
            </label>
            <input
              className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-gray-900/70"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nhập họ tên"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-600">
              Ảnh đại diện (URL)
            </label>
            <input
              className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-gray-900/70"
              value={avatar}
              onChange={(e) => setAvatar(e.target.value)}
              placeholder="https://..."
            />
            <p className="text-[11px] text-gray-400">
              Bạn có thể dán link ảnh avatar hoặc để trống để dùng avatar mặc
              định.
            </p>
          </div>

          {error && (
            <div className="rounded-md bg-red-50 px-3 py-2 text-xs text-red-700">
              {error}
            </div>
          )}
          {success && (
            <div className="rounded-md bg-emerald-50 px-3 py-2 text-xs text-emerald-700">
              {success}
            </div>
          )}

          <div className="mt-3 flex justify-end gap-2 pt-2 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 text-xs rounded-md border border-gray-200 text-gray-600 hover:bg-gray-50"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-3 py-1.5 text-xs rounded-md bg-gray-900 text-white hover:bg-black disabled:opacity-60"
            >
              {loading ? "Đang lưu..." : "Lưu thay đổi"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// -------- Modal đổi mật khẩu --------
function ChangePasswordModal({ open, onClose, userId }) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (open) {
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setError("");
      setSuccess("");
    }
  }, [open]);

  if (!open) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!currentPassword || !newPassword || !confirmPassword) {
      setError("Vui lòng nhập đủ các trường.");
      return;
    }

    if (newPassword.length < 6) {
      setError("Mật khẩu mới phải có ít nhất 6 ký tự.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Xác nhận mật khẩu không khớp.");
      return;
    }

    try {
      setLoading(true);

      // 👉 GỌI API CẬP NHẬT USER: chỉ gửi field password
      await usersApi.updateUser(userId, {
        password: newPassword,
      });

      setSuccess("Đổi mật khẩu thành công.");
      setTimeout(() => {
        onClose();
      }, 600);
    } catch (err) {
      console.error("Lỗi đổi mật khẩu:", err);
      setError(
        err?.response?.data?.message ||
          "Không thể đổi mật khẩu. Vui lòng thử lại."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-md rounded-xl bg-white shadow-lg">
        <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
          <h3 className="text-sm font-semibold text-gray-900">Đổi mật khẩu</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-xl leading-none"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-4 py-4 space-y-3 text-sm">
          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-600">
              Mật khẩu hiện tại
            </label>
            <input
              type="password"
              className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-gray-900/70"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Nhập mật khẩu hiện tại"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-600">
              Mật khẩu mới
            </label>
            <input
              type="password"
              className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-gray-900/70"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Nhập mật khẩu mới"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-600">
              Xác nhận mật khẩu mới
            </label>
            <input
              type="password"
              className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-gray-900/70"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Nhập lại mật khẩu mới"
            />
          </div>

          {error && (
            <div className="rounded-md bg-red-50 px-3 py-2 text-xs text-red-700">
              {error}
            </div>
          )}
          {success && (
            <div className="rounded-md bg-emerald-50 px-3 py-2 text-xs text-emerald-700">
              {success}
            </div>
          )}

          <div className="mt-3 flex justify-end gap-2 pt-2 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 text-xs rounded-md border border-gray-200 text-gray-600 hover:bg-gray-50"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-3 py-1.5 text-xs rounded-md bg-gray-900 text-white hover:bg-black disabled:opacity-60"
            >
              {loading ? "Đang đổi..." : "Đổi mật khẩu"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export function ProfilePageClient() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [openEditModal, setOpenEditModal] = useState(false);
  const [openPasswordModal, setOpenPasswordModal] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function fetchUser() {
      try {
        setLoading(true);
        setError(null);

        const user = await usersApi.getCurrentUser();

        if (!cancelled) {
          setProfile(user);
        }
      } catch (err) {
        console.error("Lỗi lấy thông tin người dùng:", err);
        if (!cancelled) {
          setError("Không thể tải thông tin tài khoản.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    fetchUser();

    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return (
      <div className="space-y-4 text-sm text-gray-500">
        Đang tải thông tin tài khoản...
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="space-y-4">
        <p className="text-sm text-red-600">{error || "Không có dữ liệu."}</p>
      </div>
    );
  }

  const stats = profile.stats || {};
  const name = profile.name || "";
  const email = profile.email || "";
  const avatar = profile.avatar;
  const status = profile.status || "active";
  const hasPassword = Boolean(profile.passwordHash);

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-lg font-semibold text-gray-900">
              Thông tin tài khoản
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Quản lý thông tin cá nhân và bảo mật của bạn.
            </p>
          </div>

          <StatusBadge status={status} />
        </div>

        {/* Thông tin cơ bản */}
        <section className="rounded-xl border border-gray-100 bg-white px-5 py-4">
          <h2 className="text-sm font-semibold text-gray-900 mb-4">
            Thông tin cá nhân
          </h2>

          <div className="flex flex-col md:flex-row md:items-center gap-4">
            {/* Avatar */}
            <div className="flex items-center gap-4">
              {avatar ? (
                <img
                  src={avatar}
                  alt={name || email}
                  className="h-14 w-14 rounded-full object-cover"
                />
              ) : (
                <div className="h-14 w-14 rounded-full bg-gray-200 flex items-center justify-center text-lg font-semibold text-gray-700">
                  {(name && name.charAt(0).toUpperCase()) ||
                    (email && email.charAt(0).toUpperCase())}
                </div>
              )}

              <div className="text-sm">
                <div className="font-semibold text-gray-900">
                  {name || "Chưa có tên"}
                </div>
                <div className="text-gray-500">{email}</div>
                <div className="text-xs text-gray-400 mt-1">
                  Tham gia từ {formatDate(profile.createdAt)}
                </div>
              </div>
            </div>

            {/* Nút bên phải */}
            <div className="md:ml-auto flex gap-2">
              {hasPassword && (
                <button
                  className="px-3 py-1.5 text-xs font-medium rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50"
                  onClick={() => setOpenPasswordModal(true)}
                >
                  Đổi mật khẩu
                </button>
              )}
              <button
                className="px-3 py-1.5 text-xs font-medium rounded-md bg-gray-900 text-white hover:bg-black"
                onClick={() => setOpenEditModal(true)}
              >
                Cập nhật thông tin
              </button>
            </div>
          </div>
        </section>

        {/* Thống kê nhanh */}
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="rounded-xl border border-gray-100 bg-white px-4 py-3">
            <div className="text-xs text-gray-500 mb-1">Tổng đơn hàng</div>
            <div className="text-xl font-semibold text-gray-900">
              {stats.totalOrders ?? 0}
            </div>
          </div>

          <div className="rounded-xl border border-gray-100 bg-white px-4 py-3">
            <div className="text-xs text-gray-500 mb-1">Tổng chi tiêu</div>
            <div className="text-xl font-semibold text-gray-900">
              {formatCurrency(stats.totalSpent ?? 0)}
            </div>
          </div>

          <div className="rounded-xl border border-gray-100 bg-white px-4 py-3">
            <div className="text-xs text-gray-500 mb-1">Đánh giá sản phẩm</div>
            <div className="text-xl font-semibold text-gray-900">
              {stats.totalReviews ?? 0}
            </div>
          </div>
        </section>

        {/* Form hiển thị chi tiết */}
        <section className="rounded-xl border border-gray-100 bg-white px-5 py-4">
          <h2 className="text-sm font-semibold text-gray-900 mb-4">
            Chi tiết tài khoản
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-500">
                Họ và tên
              </label>
              <input
                className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm bg-gray-50"
                value={name}
                disabled
                readOnly
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-500">
                Email đăng nhập
              </label>
              <input
                className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm bg-gray-50"
                value={email}
                disabled
                readOnly
              />
            </div>
          </div>

          <p className="mt-4 text-xs text-gray-400">
            Sau này bạn có thể cho phép cập nhật các thông tin này qua API (PUT
            /api/profile).
          </p>
        </section>
      </div>

      {/* Modals */}
      <UpdateProfileModal
        open={openEditModal}
        onClose={() => setOpenEditModal(false)}
        profile={profile}
        onUpdated={(updatedUser) => setProfile(updatedUser)}
      />

      {hasPassword && (
        <ChangePasswordModal
          open={openPasswordModal}
          onClose={() => setOpenPasswordModal(false)}
          userId={profile.id}
        />
      )}
    </>
  );
}
