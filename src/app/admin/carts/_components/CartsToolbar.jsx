import { ToolbarFilter } from "@/components/common/ToolbarFilter";

export default function CartsToolbar() {
  return (
    <ToolbarFilter
      searchPlaceholder="Tìm theo tên người dùng hoặc ID giỏ..."
      searchKey="search"
      // Giỏ hàng thường không có status phức tạp như User, 
      // nhưng có thể lọc theo số lượng item (Rỗng/Có hàng) nếu API hỗ trợ
      filters={[]} 
    />
  );
}