import { GoogleAuthProvider } from "@/providers/google-auth-provider";

export const metadata = {
  referrer: "origin-when-cross-origin",
};

export default function ClientLayout({ children }) {
  return (
    <GoogleAuthProvider>
      {/* <ChatBox/> */}
      {children}
    </GoogleAuthProvider>
  );
}
