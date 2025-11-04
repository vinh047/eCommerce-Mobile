import "./globals.css";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { Inter } from "next/font/google";

const inter = Inter({
  subsets: ["latin", "latin-ext", "vietnamese"],
  weight: ["400", "500", "700"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata = {
  title: "eCommerce Login",
  description: "Google login + JWT demo",
};

// ⚠️ Lưu ý: Layout phải là server component, nên bạn không thể gọi hook ở đây.
// Nhưng bạn có thể truyền children vào Provider (là client component).
export default function RootLayout({ children }) {
  return (
    <html lang="vi">
      <body>
        <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}>
          {children}
        </GoogleOAuthProvider>
      </body>
    </html>
  );
}

