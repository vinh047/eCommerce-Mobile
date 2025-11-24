import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyToken } from "@/lib/auth";

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const { pathname } = request.nextUrl;

  const authRoutes = ["/signin", "/signup", "/login"];
  const protectedRoutes = ["/cart", "/profile", "/checkout", "/api/protected"];

  if (token && authRoutes.some(route => pathname.startsWith(route))) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  const isProtectedRoute = protectedRoutes.some(route =>
    pathname.startsWith(route)
  );

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
      if (isProtectedRoute) {
        const response = NextResponse.redirect(new URL("/signin", request.url));
        response.cookies.delete("token");
        return response;
      }
    }
  }

  return NextResponse.next();
}
