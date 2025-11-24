import { AccountStatus, CouponType } from "@prisma/client";
import { isDragActive } from "framer-motion";

export const users = [
  // 1. John Doe (Đã có)
  {
    email: "john.doe@example.com",
    passwordHash: "hashed_password_123",
    name: "John Doe",
    avatar: "https://i.pravatar.cc/150?img=1",
    status: AccountStatus.active,
    role: "customer",
    createdAt: new Date(Date.now() - 5 * 365 * 24 * 60 * 60 * 1000), // 5 năm trước
    addresses: [
      {
        line: "123 Đường Nguyễn Văn Linh",
        phone: "0901234567",
        ward: "Phường Linh Trung",
        district: "Thủ Đức",
        province: "TP.HCM",
        isDefault: true,
      },
    ],
  },
  // 2. Jane Smith (Đã có)
  {
    email: "jane.smith@example.com",
    passwordHash: "hashed_password_456",
    name: "Jane Smith",
    avatar: "https://i.pravatar.cc/150?img=2",
    status: AccountStatus.blocked,
    role: "customer",
    createdAt: new Date(Date.now() - 2 * 365 * 24 * 60 * 60 * 1000), // 2 năm trước
    addresses: [
      {
        line: "456 Đường Trần Hưng Đạo",
        phone: "0907654321",
        ward: "Phường 5",
        district: "Quận 5",
        province: "TP.HCM",
        isDefault: true,
      },
      {
        line: "789 Đường Lê Lợi",
        phone: "0912345678",
        ward: "Phường Bến Thành",
        district: "Quận 1",
        province: "TP.HCM",
        isDefault: false,
      },
    ],
  },

  // --- THÊM 15 NGƯỜI DÙNG MỚI ---

  // 3. Nguyễn Văn A - Admin
  {
    email: "van.a.nguyen@admin.com",
    passwordHash: "hashed_password_789",
    name: "Nguyễn Văn A",
    avatar: "https://i.pravatar.cc/150?img=3",
    status: AccountStatus.active,
    role: "admin",
    createdAt: new Date(Date.now() - 4 * 365 * 24 * 60 * 60 * 1000),
    addresses: [
      {
        line: "99 Vạn Hạnh",
        phone: "0987654321",
        ward: "Phường 15",
        district: "Quận 10",
        province: "TP.HCM",
        isDefault: true,
      },
    ],
  },
  // 4. Trần Thị B - Staff
  {
    email: "thi.b.tran@company.com",
    passwordHash: "hashed_password_012",
    name: "Trần Thị B",
    avatar: "https://i.pravatar.cc/150?img=4",
    status: AccountStatus.active,
    role: "staff",
    createdAt: new Date(Date.now() - 1 * 365 * 24 * 60 * 60 * 1000),
    addresses: [
      {
        line: "20 Phan Bội Châu",
        phone: "0918765432",
        ward: "Phường 2",
        district: "Quận Hoàn Kiếm",
        province: "Hà Nội",
        isDefault: true,
      },
    ],
  },
  // 5. Lê Văn C - Customer (Blocked)
  {
    email: "van.c.le@gmail.com",
    passwordHash: "hashed_password_345",
    name: "Lê Văn C",
    avatar: "https://i.pravatar.cc/150?img=5",
    status: AccountStatus.blocked,
    role: "customer",
    createdAt: new Date(Date.now() - 8 * 30 * 24 * 60 * 60 * 1000), // 8 tháng trước
    addresses: [
      {
        line: "12 Lạc Long Quân",
        phone: "0977665544",
        ward: "Phường 10",
        district: "Tân Bình",
        province: "TP.HCM",
        isDefault: true,
      },
    ],
  },
  // 6. Phạm Thị D - Customer
  {
    email: "thi.d.pham@hotmail.com",
    passwordHash: "hashed_password_678",
    name: "Phạm Thị D",
    avatar: "https://i.pravatar.cc/150?img=6",
    status: AccountStatus.active,
    role: "customer",
    createdAt: new Date(Date.now() - 10 * 30 * 24 * 60 * 60 * 1000), // 10 tháng trước
    addresses: [
      {
        line: "100 Hùng Vương",
        phone: "0944556677",
        ward: "Phường An Lạc",
        district: "Ninh Kiều",
        province: "Cần Thơ",
        isDefault: true,
      },
      {
        line: "56 Nguyễn Huệ",
        phone: "0944556677",
        ward: "Phường Bến Nghé",
        district: "Quận 1",
        province: "TP.HCM",
        isDefault: false,
      },
    ],
  },
  // 7. Hoàng Văn E - Customer (New)
  {
    email: "van.e.hoang@yahoo.com",
    passwordHash: "hashed_password_901",
    name: "Hoàng Văn E",
    avatar: "https://i.pravatar.cc/150?img=7",
    status: AccountStatus.active,
    role: "customer",
    createdAt: new Date(Date.now() - 3 * 30 * 24 * 60 * 60 * 1000), // 3 tháng trước
    addresses: [
      {
        line: "300 Lý Thường Kiệt",
        phone: "0961239870",
        ward: "Phường 14",
        district: "Quận 10",
        province: "TP.HCM",
        isDefault: true,
      },
    ],
  },
  // 8. Đỗ Thị F - Customer
  {
    email: "thi.f.do@example.net",
    passwordHash: "hashed_password_234",
    name: "Đỗ Thị F",
    avatar: "https://i.pravatar.cc/150?img=8",
    status: AccountStatus.active,
    role: "customer",
    createdAt: new Date(Date.now() - 18 * 30 * 24 * 60 * 60 * 1000), // 1.5 năm trước
    addresses: [
      {
        line: "45 Hai Bà Trưng",
        phone: "0933221100",
        ward: "Phường 6",
        district: "Quận 3",
        province: "TP.HCM",
        isDefault: true,
      },
    ],
  },
  // 9. Bùi Văn G - Customer (Pending/Pending Verification)
  {
    email: "van.g.bui@email.com",
    passwordHash: "hashed_password_567",
    name: "Bùi Văn G",
    avatar: "https://i.pravatar.cc/150?img=9",
    status: AccountStatus.active, // Giả định có trạng thái pending
    role: "customer",
    createdAt: new Date(Date.now() - 1 * 30 * 24 * 60 * 60 * 1000), // 1 tháng trước
    addresses: [],
  },
  // 10. Đinh Thị H - Customer
  {
    email: "thi.h.dinh@outlook.com",
    passwordHash: "hashed_password_890",
    name: "Đinh Thị H",
    avatar: "https://i.pravatar.cc/150?img=10",
    status: AccountStatus.active,
    role: "customer",
    createdAt: new Date(Date.now() - 7 * 30 * 24 * 60 * 60 * 1000),
    addresses: [
      {
        line: "33 Đinh Tiên Hoàng",
        phone: "0905123456",
        ward: "Phường Bến Nghé",
        district: "Quận 1",
        province: "TP.HCM",
        isDefault: true,
      },
    ],
  },
  // 11. Chu Văn I - Customer
  {
    email: "van.i.chu@testmail.com",
    passwordHash: "hashed_password_147",
    name: "Chu Văn I",
    avatar: "https://i.pravatar.cc/150?img=11",
    status: AccountStatus.active,
    role: "customer",
    createdAt: new Date(Date.now() - 3 * 365 * 24 * 60 * 60 * 1000), // 3 năm trước
    addresses: [
      {
        line: "100 Chu Văn An",
        phone: "0911223344",
        ward: "Phường 12",
        district: "Bình Thạnh",
        province: "TP.HCM",
        isDefault: true,
      },
    ],
  },
  // 12. Vũ Thị K - Customer (Blocked)
  {
    email: "thi.k.vu@mailservice.com",
    passwordHash: "hashed_password_258",
    name: "Vũ Thị K",
    avatar: "https://i.pravatar.cc/150?img=12",
    status: AccountStatus.blocked,
    role: "customer",
    createdAt: new Date(Date.now() - 6 * 30 * 24 * 60 * 60 * 1000),
    addresses: [
      {
        line: "88 Mạc Thị Bưởi",
        phone: "0909876543",
        ward: "Phường Thảo Điền",
        district: "Thủ Đức",
        province: "TP.HCM",
        isDefault: true,
      },
    ],
  },
  // 13. Dương Văn L - Customer
  {
    email: "van.l.duong@webmail.com",
    passwordHash: "hashed_password_369",
    name: "Dương Văn L",
    avatar: "https://i.pravatar.cc/150?img=13",
    status: AccountStatus.active,
    role: "customer",
    createdAt: new Date(Date.now() - 25 * 30 * 24 * 60 * 60 * 1000), // Khoảng 2 năm trước
    addresses: [
      {
        line: "123 Xô Viết Nghệ Tĩnh",
        phone: "0917777777",
        ward: "Phường 21",
        district: "Bình Thạnh",
        province: "TP.HCM",
        isDefault: true,
      },
    ],
  },
  // 14. Phan Thị M - Customer
  {
    email: "thi.m.phan@inbox.com",
    passwordHash: "hashed_password_000",
    name: "Phan Thị M",
    avatar: "https://i.pravatar.cc/150?img=14",
    status: AccountStatus.active,
    role: "customer",
    createdAt: new Date(Date.now() - 11 * 30 * 24 * 60 * 60 * 1000),
    addresses: [
      {
        line: "444 Nguyễn Thị Định",
        phone: "0908888888",
        ward: "Phường Cát Lái",
        district: "Thủ Đức",
        province: "TP.HCM",
        isDefault: true,
      },
    ],
  },
  // 15. Hồ Văn N - Staff
  {
    email: "van.n.ho@company.com",
    passwordHash: "hashed_password_999",
    name: "Hồ Văn N",
    avatar: "https://i.pravatar.cc/150?img=15",
    status: AccountStatus.active,
    role: "staff",
    createdAt: new Date(Date.now() - 9 * 30 * 24 * 60 * 60 * 1000),
    addresses: [
      {
        line: "1 Lê Duẩn",
        phone: "0976543210",
        ward: "Phường 3",
        district: "Quận 3",
        province: "TP.HCM",
        isDefault: true,
      },
    ],
  },
  // 16. Mai Thị O - Customer (Pending)
  {
    email: "thi.o.mai@mail.com",
    passwordHash: "hashed_password_321",
    name: "Mai Thị O",
    avatar: "https://i.pravatar.cc/150?img=16",
    status: AccountStatus.active,
    role: "customer",
    createdAt: new Date(Date.now() - 5 * 30 * 24 * 60 * 60 * 1000),
    addresses: [],
  },
  // 17. Trịnh Văn P - Customer
  {
    email: "van.p.trinh@emailbox.com",
    passwordHash: "hashed_password_654",
    name: "Trịnh Văn P",
    avatar: "https://i.pravatar.cc/150?img=17",
    status: AccountStatus.active,
    role: "customer",
    createdAt: new Date(Date.now() - 15 * 30 * 24 * 60 * 60 * 1000),
    addresses: [
      {
        line: "555 Phạm Văn Đồng",
        phone: "0902468000",
        ward: "Phường 13",
        district: "Gò Vấp",
        province: "TP.HCM",
        isDefault: true,
      },
    ],
  },
];

export const coupons = [
  // 1. Giảm cố định, hoạt động
  {
    code: "WELCOME200K",
    type: CouponType.fixed,
    value: 200000.0, // 200,000 VND
    minOrder: 1000000.0, // Đơn hàng tối thiểu 1 triệu
    startsAt: new Date(),
    endsAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // Hết hạn sau 30 ngày
    usageLimit: 500,
    used: 150,
    status: AccountStatus.active,
    categoryId: null,
    brandId: null,
  },
  // 2. Giảm phần trăm, hoạt động
  {
    code: "SALE15PERCENT",
    type: CouponType.percentage,
    value: 15.0, // 15%
    minOrder: 500000.0,
    startsAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // Đã bắt đầu 7 ngày trước
    endsAt: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // Hết hạn sau 15 ngày
    usageLimit: 2000,
    used: 1875,
    status: AccountStatus.active,
    categoryId: null,
    brandId: null,
  },
  // 3. Giảm cố định, sắp hết hạn/đã hết giới hạn (blocked)
  {
    code: "GIAYDEP50K",
    type: CouponType.fixed,
    value: 50000.0,
    minOrder: 300000.0,
    startsAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
    endsAt: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // Sắp hết hạn
    usageLimit: 100,
    used: 100, // Đã hết giới hạn
    status: AccountStatus.blocked,
    categoryId: null, // Dành cho danh mục Giày Dép
    brandId: null,
  },
  // 4. Giảm phần trăm, bị xóa
  {
    code: "TESTCODE01",
    type: CouponType.percentage,
    value: 10.0,
    minOrder: 0.0,
    startsAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    endsAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
    usageLimit: 10,
    used: 1,
    status: AccountStatus.deleted, // Đã xóa
    categoryId: null,
    brandId: null,
  },
  // 5. Giảm cố định, không giới hạn sử dụng
  {
    code: "FREE20K",
    type: CouponType.fixed,
    value: 20000.0,
    minOrder: 150000.0,
    startsAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
    endsAt: null, // Không có ngày kết thúc
    usageLimit: null, // Không giới hạn
    used: 5000,
    status: AccountStatus.active,
    categoryId: null,
    brandId: null, // Dành cho Brand ID 3
  },
  // 6. Giảm phần trăm, chưa bắt đầu
  {
    code: "SUMMER40",
    type: CouponType.percentage,
    value: 40.0,
    minOrder: 800000.0,
    startsAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // Bắt đầu sau 5 ngày
    endsAt: new Date(Date.now() + 35 * 24 * 60 * 60 * 1000),
    usageLimit: 50,
    used: 0,
    status: AccountStatus.active,
    categoryId: null,
    brandId: null,
  },
  // 7. Giảm cố định, hết hạn
  {
    code: "FLASHBACK",
    type: CouponType.fixed,
    value: 500000.0,
    minOrder: 2000000.0,
    startsAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
    endsAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // Đã hết hạn
    usageLimit: 10,
    used: 9,
    status: AccountStatus.blocked,
    categoryId: null,
    brandId: null,
  },
  // 8. Giảm phần trăm, áp dụng cho cả category và brand
  {
    code: "COMBO20",
    type: CouponType.percentage,
    value: 20.0,
    minOrder: 100000.0,
    startsAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
    endsAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
    usageLimit: 800,
    used: 500,
    status: AccountStatus.active,
    categoryId: null,
    brandId: null,
  },
  // 9. Giảm cố định, minOrder bằng 0 (áp dụng cho mọi đơn)
  {
    code: "FREEFEE",
    type: CouponType.fixed,
    value: 15000.0,
    minOrder: 0.0,
    startsAt: new Date(),
    endsAt: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
    usageLimit: 99999,
    used: 12345,
    status: AccountStatus.active,
    categoryId: null,
    brandId: null,
  },
  // 10. Giảm phần trăm tối đa
  {
    code: "MAX99PERCENT",
    type: CouponType.percentage,
    value: 99.0, // 99%
    minOrder: 500000.0,
    startsAt: new Date(),
    endsAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    usageLimit: 5,
    used: 2,
    status: AccountStatus.active,
    categoryId: null,
    brandId: null,
  },
];

export const staffs = [
  {
    id: 1,
    email: "admin@fastfood.vn",
    passwordHash: "$2b$10$hashed_admin_password", // bcrypt hash
    name: "Quản trị viên",
    avatar: "/avatars/admin.png",
    status: AccountStatus.active,
    createdAt: new Date(),
  },
  {
    id: 2,
    email: "staff1@fastfood.vn",
    passwordHash: "$2b$10$hashed_staff1_password",
    name: "Nhân viên bán hàng",
    avatar: "/avatars/staff1.png",
    status: AccountStatus.active,
    createdAt: new Date(),
  },
  {
    id: 3,
    email: "inventory@fastfood.vn",
    passwordHash: "$2b$10$hashed_inventory_password",
    name: "Nhân viên kho",
    avatar: "/avatars/inventory.png",
    status: AccountStatus.active,
    createdAt: new Date(),
  },
];

export const roles = [
  { id: 1, name: "Admin", createdAt: new Date() },
  { id: 2, name: "Staff", createdAt: new Date() },
  { id: 3, name: "Inventory", createdAt: new Date() },
];

export const permissions = [
  // STAFF & ROLE
  {
    id: 1,
    key: "VIEW_STAFF",
    name: "Xem nhân viên",
    description: "Xem danh sách và chi tiết nhân viên",
    createdAt: new Date(),
  },
  {
    id: 2,
    key: "CREATE_STAFF",
    name: "Thêm nhân viên",
    description: "Thêm nhân viên mới",
    createdAt: new Date(),
  },
  {
    id: 3,
    key: "UPDATE_STAFF",
    name: "Sửa nhân viên",
    description: "Chỉnh sửa thông tin nhân viên",
    createdAt: new Date(),
  },
  {
    id: 4,
    key: "DELETE_STAFF",
    name: "Xoá nhân viên",
    description: "Xoá nhân viên",
    createdAt: new Date(),
  },
  {
    id: 5,
    key: "VIEW_ROLE",
    name: "Xem Role",
    description: "Xem danh sách vai trò",
    createdAt: new Date(),
  },
  {
    id: 6,
    key: "CREATE_ROLE",
    name: "Thêm Role",
    description: "Tạo vai trò mới",
    createdAt: new Date(),
  },
  {
    id: 7,
    key: "UPDATE_ROLE",
    name: "Sửa Role",
    description: "Chỉnh sửa vai trò",
    createdAt: new Date(),
  },
  {
    id: 8,
    key: "DELETE_ROLE",
    name: "Xoá Role",
    description: "Xoá vai trò",
    createdAt: new Date(),
  },
  {
    id: 9,
    key: "ASSIGN_ROLE",
    name: "Gán Role cho nhân viên",
    description: "Gán/bỏ Role cho nhân viên",
    createdAt: new Date(),
  },

  // CUSTOMER
  {
    id: 10,
    key: "VIEW_CUSTOMER",
    name: "Xem khách hàng",
    description: "Xem danh sách/chi tiết khách hàng",
    createdAt: new Date(),
  },
  {
    id: 11,
    key: "CREATE_CUSTOMER",
    name: "Thêm khách hàng",
    description: "Tạo khách hàng mới",
    createdAt: new Date(),
  },
  {
    id: 12,
    key: "UPDATE_CUSTOMER",
    name: "Sửa khách hàng",
    description: "Chỉnh sửa thông tin khách hàng",
    createdAt: new Date(),
  },
  {
    id: 13,
    key: "DELETE_CUSTOMER",
    name: "Xoá khách hàng",
    description: "Xoá khách hàng",
    createdAt: new Date(),
  },

  // PRODUCT & VARIANT
  {
    id: 14,
    key: "VIEW_PRODUCT",
    name: "Xem sản phẩm",
    description: "Xem danh sách/chi tiết sản phẩm",
    createdAt: new Date(),
  },
  {
    id: 15,
    key: "CREATE_PRODUCT",
    name: "Thêm sản phẩm",
    description: "Tạo sản phẩm mới",
    createdAt: new Date(),
  },
  {
    id: 16,
    key: "UPDATE_PRODUCT",
    name: "Sửa sản phẩm",
    description: "Chỉnh sửa sản phẩm",
    createdAt: new Date(),
  },
  {
    id: 17,
    key: "DELETE_PRODUCT",
    name: "Xoá sản phẩm",
    description: "Xoá sản phẩm",
    createdAt: new Date(),
  },
  {
    id: 18,
    key: "VIEW_VARIANT",
    name: "Xem biến thể",
    description: "Xem danh sách/chi tiết biến thể",
    createdAt: new Date(),
  },
  {
    id: 19,
    key: "CREATE_VARIANT",
    name: "Thêm biến thể",
    description: "Tạo biến thể mới",
    createdAt: new Date(),
  },
  {
    id: 20,
    key: "UPDATE_VARIANT",
    name: "Sửa biến thể",
    description: "Chỉnh sửa biến thể",
    createdAt: new Date(),
  },
  {
    id: 21,
    key: "DELETE_VARIANT",
    name: "Xoá biến thể",
    description: "Xoá biến thể",
    createdAt: new Date(),
  },

  // ORDER & RMA
  {
    id: 22,
    key: "VIEW_ORDER",
    name: "Xem đơn hàng",
    description: "Xem danh sách/chi tiết đơn hàng",
    createdAt: new Date(),
  },
  {
    id: 23,
    key: "UPDATE_ORDER_STATUS",
    name: "Cập nhật trạng thái đơn hàng",
    description: "Cập nhật trạng thái đơn hàng",
    createdAt: new Date(),
  },
  {
    id: 24,
    key: "VIEW_RMA",
    name: "Xem RMA",
    description: "Xem danh sách/chi tiết RMA",
    createdAt: new Date(),
  },
  {
    id: 25,
    key: "PROCESS_RMA",
    name: "Xử lý RMA",
    description: "Duyệt / từ chối / hoàn thành RMA",
    createdAt: new Date(),
  },

  // PAYMENT
  {
    id: 26,
    key: "VIEW_PAYMENT_METHOD",
    name: "Xem phương thức thanh toán",
    description: "Xem danh sách/chi tiết phương thức thanh toán",
    createdAt: new Date(),
  },
  {
    id: 27,
    key: "CREATE_PAYMENT_METHOD",
    name: "Thêm phương thức thanh toán",
    description: "Thêm mới phương thức thanh toán",
    createdAt: new Date(),
  },
  {
    id: 28,
    key: "UPDATE_PAYMENT_METHOD",
    name: "Sửa phương thức thanh toán",
    description: "Chỉnh sửa thông tin phương thức",
    createdAt: new Date(),
  },
  {
    id: 29,
    key: "DELETE_PAYMENT_METHOD",
    name: "Xoá phương thức thanh toán",
    description: "Xoá phương thức thanh toán",
    createdAt: new Date(),
  },
  {
    id: 30,
    key: "VIEW_PAYMENT_TRANSACTION",
    name: "Xem giao dịch",
    description: "Xem các giao dịch thanh toán",
    createdAt: new Date(),
  },

  // COUPON
  {
    id: 31,
    key: "VIEW_COUPON",
    name: "Xem mã giảm giá",
    description: "Xem danh sách/chi tiết coupon",
    createdAt: new Date(),
  },
  {
    id: 32,
    key: "CREATE_COUPON",
    name: "Thêm coupon",
    description: "Tạo coupon mới",
    createdAt: new Date(),
  },
  {
    id: 33,
    key: "UPDATE_COUPON",
    name: "Sửa coupon",
    description: "Chỉnh sửa coupon",
    createdAt: new Date(),
  },
  {
    id: 34,
    key: "DELETE_COUPON",
    name: "Xoá coupon",
    description: "Xoá coupon",
    createdAt: new Date(),
  },

  // INVENTORY & DEVICE
  {
    id: 35,
    key: "VIEW_INVENTORY",
    name: "Xem kho hàng",
    description: "Xem tồn kho của các biến thể",
    createdAt: new Date(),
  },
  {
    id: 36,
    key: "MANAGE_INVENTORY",
    name: "Quản lý kho",
    description: "Thêm/sửa/xoá/ghi nhận tồn kho",
    createdAt: new Date(),
  },
  {
    id: 37,
    key: "VIEW_DEVICE",
    name: "Xem thiết bị",
    description: "Xem danh sách/chi tiết thiết bị",
    createdAt: new Date(),
  },
  {
    id: 38,
    key: "MANAGE_DEVICE",
    name: "Quản lý thiết bị",
    description: "Thêm/sửa/xoá thiết bị",
    createdAt: new Date(),
  },

  // REVIEW & BANNER
  {
    id: 39,
    key: "VIEW_REVIEW",
    name: "Xem đánh giá",
    description: "Xem danh sách/chi tiết review",
    createdAt: new Date(),
  },
  {
    id: 40,
    key: "DELETE_REVIEW",
    name: "Xoá review",
    description: "Xoá review xấu hoặc spam",
    createdAt: new Date(),
  },
  {
    id: 41,
    key: "VIEW_BANNER",
    name: "Xem banner",
    description: "Xem banner trên trang chủ",
    createdAt: new Date(),
  },
  {
    id: 42,
    key: "CREATE_BANNER",
    name: "Thêm banner",
    description: "Thêm banner mới",
    createdAt: new Date(),
  },
  {
    id: 43,
    key: "UPDATE_BANNER",
    name: "Sửa banner",
    description: "Chỉnh sửa banner",
    createdAt: new Date(),
  },
  {
    id: 44,
    key: "DELETE_BANNER",
    name: "Xoá banner",
    description: "Xoá banner",
    createdAt: new Date(),
  },
];

export const rolePermissions = [
  // Admin: full quyền
  ...permissions.map((p) => ({
    roleId: 1,
    permissionId: p.id,
    grantedAt: new Date(),
  })),

  // Staff: chỉ quản lý đơn hàng + xem dashboard
  { roleId: 2, permissionId: 1, grantedAt: new Date() },
  { roleId: 2, permissionId: 4, grantedAt: new Date() },

  // Inventory: chỉ quản lý kho
  { roleId: 3, permissionId: 1, grantedAt: new Date() },
  { roleId: 3, permissionId: 5, grantedAt: new Date() },
];

export const staffRoles = [
  { staffId: 1, roleId: 1, assignedAt: new Date() }, // admin
  { staffId: 2, roleId: 2, assignedAt: new Date() }, // nhân viên bán hàng
  { staffId: 3, roleId: 3, assignedAt: new Date() }, // nhân viên kho
];
// Dữ liệu Review
export const reviews = [
  {
    productId: 1,
    userId: 1,
    stars: 5,
    content: "Sản phẩm tuyệt vời, chất lượng vượt mong đợi!",
    isActived: true,
  },
  {
    productId: 1,
    userId: 2,
    stars: 4,
    content: "Rất hài lòng với sản phẩm, sẽ mua lại.",
    isActived: true,

  },
  {
    productId: 1,
    userId: 3,
    stars: 3,
    content: "Sản phẩm ổn nhưng giao hàng hơi chậm.",
    isActived: true,

  },
  {
    productId: 1,
    userId: 4,
    stars: 2,
    content: "Chất lượng không như quảng cáo, khá thất vọng.",
    isActived: true,

  },
  {
    productId: 1,
    userId: 5,
    stars: 5,
    content: "Tuyệt vời! Sẽ giới thiệu cho bạn bè.",
    isActived: true,

  },
  {
    productId: 1,
    userId: 6,
    stars: 4,
    isActived: true,
    content: "Sản phẩm tốt, dịch vụ khách hàng cũng rất chu đáo.",
  },
  {
    productId: 1,
    userId: 7,
    stars: 4,
    isActived: false,
    content: "Sản phẩm tốt, dịch vụ khách hàng cũng rất chu đáo.",
  }
];

// Lưu ý: userId và productId trong reviews phải tương ứng với dữ liệu đã có trong database.