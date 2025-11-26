import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyToken } from "@/lib/auth";

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value; // user token
  const adminToken = request.cookies.get("admin_token")?.value; // staff/admin token
  const { pathname } = request.nextUrl;

  const authRoutes = ["/signin", "/signup"];
  const protectedRoutes = ["/cart", "/profile", "/checkout", "/api/protected"];

  // =============== ADMIN LOGIN PAGE (/login) ===============
  if (pathname === "/login") {
    if (adminToken) {
      const adminPayload = await verifyToken(adminToken);

      if (adminPayload) {
        return NextResponse.redirect(new URL("/admin", request.url));
      } else {
        const res = NextResponse.next();
        res.cookies.delete("admin_token");
        return res;
      }
    }
    return NextResponse.next();
  }

  // ===================== ADMIN AREA =====================
  if (pathname.startsWith("/admin")) {
    if (!adminToken) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    const adminPayload = await verifyToken(adminToken);

    if (!adminPayload) {
      const res = NextResponse.redirect(new URL("/login", request.url));
      res.cookies.delete("admin_token");
      return res;
    }

    return NextResponse.next();
  }

  // ===================== USER AREA (CLIENT) =====================

  // Nếu đã đăng nhập user mà vẫn vào /signin /signup → đẩy về trang chủ
  if (token && authRoutes.some((route) => pathname.startsWith(route))) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Các route cần đăng nhập user
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  // Chưa có token user mà vào route protected → đẩy về /signin
  if (isProtectedRoute && !token) {
    return NextResponse.redirect(new URL("/signin", request.url));
  }

  if (token) {
    const payload = verifyToken(token);
    if (payload) {
      const response = NextResponse.next();

      const isRemembered = (payload as any).rememberMe;
      if (isRemembered) {
        response.cookies.set("token", token, {
          httpOnly: true,
          path: "/",
          sameSite: "lax",
          maxAge: 60 * 60 * 24 * 7,
          secure: process.env.NODE_ENV === "production",
        });
      }

      return response;
    } else {
      // token user sai mà đang vào route cần bảo vệ → bắt login lại
      if (isProtectedRoute) {
        const response = NextResponse.redirect(new URL("/signin", request.url));
        response.cookies.delete("token");
        return response;
      }
    }
  }

  return NextResponse.next();
}
