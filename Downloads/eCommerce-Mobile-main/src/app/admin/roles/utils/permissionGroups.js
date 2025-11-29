// utils/permissionGroups.js

// Map từ KEY prefix sang tên hiển thị tiếng Việt
export const GROUP_LABELS = {
  STAFF: "Quản lý Nhân viên",
  ROLE: "Phân quyền & Vai trò",
  CUSTOMER: "Khách hàng",
  PRODUCT: "Sản phẩm",
  VARIANT: "Biến thể sản phẩm",
  ORDER: "Đơn hàng",
  RMA: "Đổi trả & Bảo hành",
  PAYMENT: "Thanh toán",
  COUPON: "Mã giảm giá",
  INVENTORY: "Kho hàng",
  DEVICE: "Thiết bị",
  REVIEW: "Đánh giá",
  BANNER: "Giao diện & Banner",
};

// Hàm nhóm permission list
export const groupPermissions = (permissions) => {
  const groups = {};
  
  permissions.forEach((perm) => {
    // Lấy từ khóa thứ 2 trong key làm group (VD: VIEW_STAFF -> STAFF)
    const parts = perm.key.split("_");
    // Trường hợp đặc biệt: UPDATE_ORDER_STATUS -> Group ORDER
    let groupKey = parts.length > 2 && parts[1] === 'ORDER' ? 'ORDER' : parts.slice(1).join("_");
    
    // Fallback logic đơn giản hơn nếu key naming convention không đều
    if(perm.key.includes("STAFF")) groupKey = "STAFF";
    else if(perm.key.includes("ROLE")) groupKey = "ROLE";
    else if(perm.key.includes("CUSTOMER")) groupKey = "CUSTOMER";
    else if(perm.key.includes("PRODUCT")) groupKey = "PRODUCT";
    else if(perm.key.includes("VARIANT")) groupKey = "VARIANT";
    else if(perm.key.includes("ORDER")) groupKey = "ORDER";
    else if(perm.key.includes("RMA")) groupKey = "RMA";
    else if(perm.key.includes("PAYMENT")) groupKey = "PAYMENT";
    else if(perm.key.includes("COUPON")) groupKey = "COUPON";
    else if(perm.key.includes("INVENTORY")) groupKey = "INVENTORY";
    else if(perm.key.includes("DEVICE")) groupKey = "DEVICE";
    else if(perm.key.includes("REVIEW")) groupKey = "REVIEW";
    else if(perm.key.includes("BANNER")) groupKey = "BANNER";
    
    if (!groups[groupKey]) {
      groups[groupKey] = {
        label: GROUP_LABELS[groupKey] || groupKey,
        items: [],
      };
    }
    groups[groupKey].items.push(perm);
  });

  return groups;
};