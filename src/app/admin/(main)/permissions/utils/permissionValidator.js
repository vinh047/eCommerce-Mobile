/**
 * Kiểm tra hợp lệ dữ liệu quyền hạn
 * @param {Object} data - Dữ liệu permission (key, name, description)
 * @returns {string|null} - Chuỗi thông báo lỗi nếu có, hoặc null nếu hợp lệ
 */
export function validatePermission(data) {
  if (!data.key || !data.key.trim()) {
    return "Key (khóa) của quyền hạn không được để trống.";
  }

  // Key thường chỉ chứa ký tự a-z, số, dấu hai chấm hoặc gạch ngang
  const keyRegex = /^[a-z0-9:_-]+$/i;
  if (!keyRegex.test(data.key.trim())) {
    return "Key không hợp lệ. Chỉ chấp nhận chữ cái, số, dấu ':', '_' và '-'.";
  }

  if (!data.name || !data.name.trim()) {
    return "Tên hiển thị của quyền hạn không được để trống.";
  }

  // Description là optional nên không cần check

  return null;
}
