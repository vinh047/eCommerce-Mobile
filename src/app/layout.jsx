import { GoogleAuthProvider } from "@/providers/google-auth-provider";
import "./globals.css";
import { Inter } from "next/font/google";
import { Toaster } from "sonner";
import { ChatBox } from "@/components/chatbox/ChatBox";

const inter = Inter({
  subsets: ["latin", "latin-ext", "vietnamese"],
  weight: ["400", "500", "700"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata = {
  referrer: 'origin-when-cross-origin',
};

export default function RootLayout({ children }) {
  return (
    <html lang="vi">
      <body>
        <GoogleAuthProvider>
          <ChatBox/>
          {children}
        </GoogleAuthProvider>
        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}

