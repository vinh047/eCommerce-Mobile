/**
 * Kiểm tra hợp lệ dữ liệu coupon
 * @param {Object} data - Dữ liệu coupon
 * @returns {string|null} - Chuỗi thông báo lỗi nếu có, hoặc null nếu hợp lệ
 */
export function validateCoupon(data) {
  if (!data.code || !data.code.trim()) {
    return "Mã coupon không được để trống.";
  }

  if (!data.type || !["fixed", "percentage"].includes(data.type)) {
    return "Loại giảm giá không hợp lệ.";
  }

  if (isNaN(data.value) || data.value <= 0) {
    return "Giá trị giảm phải lớn hơn 0.";
  }

  if (data.type === "percentage" && data.value > 100) {
    return "Giá trị phần trăm không được vượt quá 100%.";
  }

  if (data.startsAt && data.endsAt) {
    const start = new Date(data.startsAt);
    const end = new Date(data.endsAt);
    if (start >= end) {
      return "Thời gian bắt đầu phải nhỏ hơn thời gian kết thúc.";
    }
  }

  if (data.minOrder < 0) {
    return "Đơn hàng tối thiểu không được nhỏ hơn 0.";
  }

  if (data.usageLimit !== null && data.usageLimit < 1) {
    return "Giới hạn sử dụng phải ≥ 1 hoặc để trống.";
  }

  return null; 
}
