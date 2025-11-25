import { NextResponse } from "next/server";

export async function POST() {
  try {
    const res = NextResponse.json({
      message: "Đăng xuất thành công",
    });

    res.cookies.set("token", "", {
      httpOnly: true,
      path: "/",
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 0, // xóa cookie
    });

    return res;
  } catch (err) {
    console.error("Logout error:", err);
    return NextResponse.json(
      { error: "Đăng xuất thất bại" },
      { status: 500 }
    );
  }
}
