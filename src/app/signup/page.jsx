import React from "react";
import Signup from "@/app/signup/signup";
import HeaderLayout from "@/components/Layout/HeaderLayout";

export const metadata = {
  title: "Signup",
};

export default function Page() {
  return (
    <HeaderLayout>
      <Signup />
    </HeaderLayout>
  );
}
