import { AccountStatus } from "@prisma/client";

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
