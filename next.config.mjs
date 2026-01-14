/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      "fontawesome.com",
      "upload.wikimedia.org",
      "www.wikipedia.org",
      "i.pravatar.cc",
      "images.unsplash.com",
      "res.cloudinary.com",
      "lh3.googleusercontent.com",
    ],
  },
  async rewrites() {
    return [
      { source: "/dang-nhap", destination: "/login" },
      { source: "/dang-ky", destination: "/register" },
      { source: "/gio-hang", destination: "/cart" },
      { source: "/thanh-toan", destination: "/checkout" },
      { source: "/san-pham/:slug", destination: "/product-detail/:slug" },
      { source: "/chinh-sach", destination: "/policy" },

      {
        source: "/chinh-sach-bao-hanh",
        destination: "/policy",
      },
      {
        source: "/kiem-tra-don-hang",
        destination: "/policy/order-check",
      },
      {
        source: "/quy-dinh-thanh-toan",
        destination: "/policy/payment",
      },
      {
        source: "/chinh-sach-bao-mat",
        destination: "/policy/privacy",
      },
      {
        source: "/chinh-sach-doi-tra",
        destination: "/policy/return",
      },
      {
        source: "/chinh-sach-van-chuyen",
        destination: "/policy/shipping",
      },
      {
        source: "/chinh-sach-bao-hanh",
        destination: "/policy/warranty",
      },


      {
        source: "/tai-khoan",
        destination: "/profile",
      },
      {
        source: "/tai-khoan/dia-chi",
        destination: "/profile/addresses",
      },
      {
        source: "/tai-khoan/lich-su-mua-hang",
        destination: "/profile/orders",
      },
      {
        source: "/tai-khoan/lich-su-mua-hang/:orderId",
        destination: "/profile/orders/:orderId",
      },


    ];
  },
};

export default nextConfig;
