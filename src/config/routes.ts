export const ROUTES = {
  HOME: "/",
  ABOUT: "/about",

  category: (slug: string) => `/${slug}`,

  CART: "/gio-hang",
  CHECKOUT: "/thanh-toan",

  productDetail: (slug: string) => `/san-pham/${slug}`,

  LOGIN: "/dang-nhap",
  REGISTER: "/dang-ky",
  FORGOT_PASSWORD: "/forgot-password",

  POLICY: {
    INDEX: "/chinh-sach-bao-hanh",

    RETURN: "/chinh-sach-doi-tra",
    PRIVACY: "/chinh-sach-bao-mat",
    PAYMENT: "/quy-dinh-thanh-toan",
    SHIPPING: "/chinh-sach-van-chuyen",
    ORDER_CHECK: "/kiem-tra-don-hang",
    WARRANTY: "/chinh-sach-bao-hanh",
  },

  PROFILE: {
    INDEX: '/tai-khoan',                
    ADDRESS: '/tai-khoan/dia-chi',
    ORDERS: '/tai-khoan/lich-su-mua-hang',

    orderDetail: (orderId: string | number) => `/tai-khoan/lich-su-mua-hang/${orderId}`,
  },

  ADMIN: {
    DASHBOARD: "/admin/dashboard",
    PRODUCTS: "/admin/products",
    ORDERS: "/admin/orders",
    // Ví dụ route sửa sản phẩm: /admin/products/edit/123
    editProduct: (id: string | number) => `/admin/products/edit/${id}`,
  },
};
