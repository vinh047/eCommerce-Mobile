// components/PermissionGate.jsx
"use client";
import { useAuth } from "@/contexts/AuthContext";

/**
 * PermissionGate component
 * - Nhận vào 1 hoặc nhiều quyền (permission)
 * - Nếu không truyền permission → luôn render children
 * - Nếu truyền → chỉ render khi user có quyền đó
 * - Có thể truyền fallback để hiển thị khi không có quyền
 */
export default function PermissionGate({ permission, children, fallback = null }) {
  const { hasPermission } = useAuth();

  // Nếu không truyền permission → luôn cho phép
  if (!permission) {
    return <>{children}</>;
  }

  // Nếu truyền mảng quyền → check ít nhất 1 quyền có
  const isAllowed = Array.isArray(permission)
    ? permission.some((p) => hasPermission(p))
    : hasPermission(permission);

  return <>{isAllowed ? children : fallback}</>;
}
