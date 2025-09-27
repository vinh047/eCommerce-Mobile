-- Lưu thông tin người dùng (khách hàng)
-- status: trạng thái tài khoản (active, blocked, deleted)
CREATE TABLE Users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  email VARCHAR(255) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255),
  avatar VARCHAR(255),
  status ENUM('active', 'blocked', 'deleted') DEFAULT 'active',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Địa chỉ giao hàng của người dùng
-- is_default: địa chỉ mặc định khi đặt hàng
CREATE TABLE Address (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT,
  line VARCHAR(255),
  phone VARCHAR(20),
  ward VARCHAR(100),
  district VARCHAR(100),
  province VARCHAR(100),
  is_default BOOLEAN DEFAULT FALSE,
  FOREIGN KEY (user_id) REFERENCES Users(id)
);

-- Thương hiệu sản phẩm (Apple, Samsung, Xiaomi...)
-- slug: đường dẫn URL thân thiện
-- is_active: thương hiệu có đang hiển thị hay không
CREATE TABLE Brands (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255),
  slug VARCHAR(255),
  image VARCHAR(255),
  is_active BOOLEAN DEFAULT TRUE
);

-- Danh mục sản phẩm (Điện thoại, Phụ kiện...)
-- parent_id: hỗ trợ phân cấp danh mục (danh mục con)
-- spec_template_id: liên kết với mẫu thông số kỹ thuật
CREATE TABLE Categories (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255),
  slug VARCHAR(255),
  parent_id INT,
  spec_template_id INT,
  is_active BOOLEAN DEFAULT TRUE,
  FOREIGN KEY (parent_id) REFERENCES Categories(id),
  FOREIGN KEY (spec_template_id) REFERENCES spec_templates(id)
);

-- Mẫu thông số kỹ thuật cho từng loại sản phẩm
-- schema_json: định nghĩa cấu trúc specs (dạng JSON)
-- version: hỗ trợ versioning khi thay đổi template
CREATE TABLE spec_templates (
  id INT PRIMARY KEY AUTO_INCREMENT,
  category_id INT,
  name VARCHAR(255),
  schema_json TEXT,
  is_actived BOOLEAN DEFAULT TRUE,
  version INT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (category_id) REFERENCES Categories(id)
);

-- Sản phẩm chính (ví dụ: iPhone 15 Pro)
-- specs_json: thông số kỹ thuật cụ thể của sản phẩm
-- rating_avg & rating_count: điểm đánh giá trung bình và số lượt đánh giá
CREATE TABLE Products (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255),
  slug VARCHAR(255),
  brand_id INT,
  category_id INT,
  description TEXT,
  rating_avg FLOAT DEFAULT 0,
  rating_count INT DEFAULT 0,
  specs_json TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  FOREIGN KEY (brand_id) REFERENCES Brands(id),
  FOREIGN KEY (category_id) REFERENCES Categories(id)
);

-- Biến thể của sản phẩm (màu sắc, dung lượng...)
-- stock: số lượng tồn kho
-- specs_json: thông số riêng cho từng biến thể
CREATE TABLE Variants (
  id INT PRIMARY KEY AUTO_INCREMENT,
  product_id INT,
  color VARCHAR(100),
  price DECIMAL(12,2),
  stock INT DEFAULT 0,
  specs_json TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  FOREIGN KEY (product_id) REFERENCES Products(id)
);

-- Hình ảnh hoặc video của biến thể sản phẩm
-- is_primary: ảnh chính hiển thị đầu tiên
CREATE TABLE Media (
  id INT PRIMARY KEY AUTO_INCREMENT,
  variant_id INT,
  url VARCHAR(255),
  type VARCHAR(50),
  is_primary BOOLEAN DEFAULT FALSE,
  FOREIGN KEY (variant_id) REFERENCES Variants(id)
);

-- Mã giảm giá áp dụng cho đơn hàng
-- type: kiểu giảm giá (cố định hoặc phần trăm)
-- usage_limit: số lượt sử dụng tối đa
-- used: số lượt đã dùng
-- category_id & brand_id: áp dụng cho danh mục/thương hiệu cụ thể
CREATE TABLE Coupons (
  id INT PRIMARY KEY AUTO_INCREMENT,
  code VARCHAR(50),
  type ENUM('fixed', 'percentage'),
  value DECIMAL(10,2),
  min_order DECIMAL(10,2),
  starts_at DATETIME,
  ends_at DATETIME,
  usage_limit INT,
  used INT DEFAULT 0,
  status ENUM('active', 'blocked', 'deleted') DEFAULT 'active',
  category_id INT,
  brand_id INT,
  FOREIGN KEY (category_id) REFERENCES Categories(id),
  FOREIGN KEY (brand_id) REFERENCES Brands(id)
);

-- Liên kết mã giảm giá với từng biến thể cụ thể
CREATE TABLE Coupon_items (
  id INT PRIMARY KEY AUTO_INCREMENT,
  coupon_id INT,
  variant_id INT,
  FOREIGN KEY (coupon_id) REFERENCES Coupons(id),
  FOREIGN KEY (variant_id) REFERENCES Variants(id)
);

-- Giỏ hàng của người dùng
CREATE TABLE Carts (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT,
  FOREIGN KEY (user_id) REFERENCES Users(id)
);

-- Sản phẩm trong giỏ hàng
-- quantity: số lượng người dùng chọn mua
CREATE TABLE Cart_items (
  id INT PRIMARY KEY AUTO_INCREMENT,
  cart_id INT,
  variant_id INT,
  quantity INT,
  FOREIGN KEY (cart_id) REFERENCES Carts(id),
  FOREIGN KEY (variant_id) REFERENCES Variants(id)
);

-- Đơn hàng của người dùng
-- status: trạng thái đơn hàng (pending → completed)
-- payment_status: trạng thái thanh toán
-- address_snapshot: địa chỉ tại thời điểm đặt hàng
-- shipping_provider: đơn vị vận chuyển
CREATE TABLE orders (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT,
  code VARCHAR(50),
  status ENUM('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'completed', 'cancelled', 'returned', 'refunded'),
  payment_method VARCHAR(50),
  payment_status ENUM('pending', 'paid', 'failed'),
  discount DECIMAL(10,2),
  shipping_fee DECIMAL(10,2),
  subtotal DECIMAL(10,2),
  total DECIMAL(10,2),
  address_snapshot TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  paid_at DATETIME,
  note TEXT,
  shipping_provider VARCHAR(100),
  shipping_status VARCHAR(50),
  FOREIGN KEY (user_id) REFERENCES Users(id)
);

-- Sản phẩm trong đơn hàng
-- name_snapshot: tên sản phẩm tại thời điểm mua (tránh thay đổi sau này)
CREATE TABLE order_items (
  id INT PRIMARY KEY AUTO_INCREMENT,
  order_id INT,
  variant_id INT,
  price DECIMAL(10,2),
  quantity INT,
  name_snapshot VARCHAR(255),
  FOREIGN KEY (order_id) REFERENCES orders(id),
  FOREIGN KEY (variant_id) REFERENCES Variants(id)
);

-- Giao dịch thanh toán của đơn hàng
-- provider_payment_id: mã giao dịch từ bên thứ ba (Momo, VNPAY...)
CREATE TABLE payment_transactions (
  id INT PRIMARY KEY AUTO_INCREMENT,
  order_id INT,
  provider VARCHAR(100),
  provider_payment_id VARCHAR(100),
  amount DECIMAL(10,2),
  status ENUM('pending', 'success', 'failed', 'refunded'),
  FOREIGN KEY (order_id) REFERENCES orders(id)
);

-- Đánh giá sản phẩm của người dùng
-- photos_json: ảnh đính kèm trong đánh giá
CREATE TABLE reviews (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT,
  product_id INT,
  stars INT,
  content TEXT,
  photos_json TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  is_actived BOOLEAN DEFAULT TRUE,
  FOREIGN KEY (user_id) REFERENCES Users(id),
  FOREIGN KEY (product_id) REFERENCES Products(id)
);

-- Yêu cầu đổi trả/bảo hành sản phẩm
-- type: loại yêu cầu (return, exchange, warranty)
-- evidence_json: bằng chứng (ảnh/video)
CREATE TABLE rmas (
  id INT PRIMARY KEY AUTO_INCREMENT,
  order_id INT,
  order_item_id INT,
  type ENUM('return', 'exchange', 'warranty'),
  reason TEXT,
  status ENUM('pending', 'approved', 'rejected', 'completed', 'cancelled'),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  evidence_json TEXT,
  FOREIGN KEY (order_id) REFERENCES orders(id),
  FOREIGN KEY (order_item_id) REFERENCES order_items(id)
);

-- Nhân viên quản trị hệ thống
-- status: trạng thái tài khoản nhân viên
CREATE TABLE staffs (
  id INT PRIMARY KEY AUTO_INCREMENT,
  email VARCHAR(255),
  password_hash VARCHAR(255),
  name VARCHAR(255),
  avatar VARCHAR(255),
  status ENUM('active', 'blocked', 'deleted'),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Vai trò của nhân viên (Admin, CSKH, Kho...)
CREATE TABLE Roles (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Gán vai trò cho nhân viên
CREATE TABLE staff_roles (
  staff_id INT,
  role_id INT,
  assigned_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (staff_id, role_id),
  FOREIGN KEY (staff_id) REFERENCES staffs(id),
  FOREIGN KEY (role_id) REFERENCES Roles(id)
);

-- Quyền thao tác trong hệ thống (xem đơn hàng, chỉnh sản phẩm...)
-- key: mã định danh quyền (ví dụ: view_orders)
CREATE TABLE Permissions (
  id INT PRIMARY KEY AUTO_INCREMENT,
  key VARCHAR(100),
  name VARCHAR(255),
  description TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Gán quyền cho vai trò
CREATE TABLE role_permissions (
  role_id INT,
  permission_id INT,
  granted_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (role_id, permission_id),
  FOREIGN KEY (role_id) REFERENCES Roles(id),
  FOREIGN KEY (permission_id) REFERENCES Permissions(id)
);

-- Nhật ký giao dịch kho (nhập, xuất, điều chỉnh, giữ chỗ, giải phóng)
-- reference_json: thông tin liên quan (ví dụ: đơn hàng, phiếu nhập)
-- created_by: ID người thao tác (staff)
CREATE TABLE inventory_transactions (
  id INT PRIMARY KEY AUTO_INCREMENT,
  variant_id INT,
  type ENUM('in', 'out', 'adjustment', 'reservation', 'release'),
  quantity INT,
  reason TEXT,
  reference_json TEXT,
  created_by INT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (variant_id) REFERENCES Variants(id)
);

-- Bảng lưu thông tin từng thiết bị vật lý (điện thoại) theo mã IMEI duy nhất.
-- Mỗi bản ghi đại diện cho một máy thật trong kho, thuộc một biến thể cụ thể.
-- variant_id: liên kết với biến thể sản phẩm (màu sắc, dung lượng...).
-- imei: mã số nhận dạng thiết bị di động (duy nhất).
-- status: trạng thái hiện tại của thiết bị:
--   - in_stock: còn trong kho
--   - reserved: đang giữ chỗ cho đơn hàng
--   - sold: đã bán
--   - returned: đã trả lại
--   - locked: bị khóa (do lỗi, gian lận, báo mất…)
-- created_at: thời điểm nhập kho hoặc tạo bản ghi.
CREATE TABLE Devices (
  id INT PRIMARY KEY AUTO_INCREMENT,
  variant_id INT NOT NULL,
  imei VARCHAR(20) UNIQUE NOT NULL,
  status ENUM('in_stock', 'sold', 'reserved', 'returned', 'locked') DEFAULT 'in_stock',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (variant_id) REFERENCES Variants(id)
);

-- Bảng liên kết giữa đơn hàng và thiết bị cụ thể đã bán (theo IMEI).
-- Mỗi bản ghi đại diện cho một thiết bị được bán trong một đơn hàng cụ thể.
-- order_item_id: sản phẩm trong đơn hàng (liên kết với bảng order_items).
-- device_id: thiết bị vật lý đã bán (liên kết với bảng Devices).
CREATE TABLE order_devices (
  id INT PRIMARY KEY AUTO_INCREMENT,
  order_item_id INT NOT NULL,
  device_id INT NOT NULL,
  FOREIGN KEY (order_item_id) REFERENCES order_items(id),
  FOREIGN KEY (device_id) REFERENCES Devices(id)
);