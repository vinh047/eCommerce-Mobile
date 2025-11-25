// app/profile/page.jsx
import React from "react";
import { ProfilePageClient } from "./_components/ProfilePageClient";

export const metadata = {
  title: "Thông tin tài khoản",
};

export default function ProfilePage() {
  return <ProfilePageClient />;
}
