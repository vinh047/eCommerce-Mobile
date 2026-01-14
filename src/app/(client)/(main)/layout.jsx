import { GoogleAuthProvider } from "@/providers/google-auth-provider";
import "../../globals.css";
import { Inter } from "next/font/google";
import { Toaster } from "sonner";
import { ChatBox } from "@/components/chatbox/ChatBox";
import ChatBot from "@/components/ChatBot";
import HeaderLayout from "@/components/Layout/HeaderLayout";

export const metadata = {
  referrer: "origin-when-cross-origin",
};

export default function ClientLayout({ children }) {
  return (
    <HeaderLayout>
      <GoogleAuthProvider>
        {/* <ChatBox/> */}
        {children}
      </GoogleAuthProvider>
      <ChatBot />
    </HeaderLayout>
  );
}
