import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { signToken } from "@/lib/auth";
import { OAuth2Client } from "google-auth-library";
import bcrypt from "bcryptjs";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // 🔹 PHẦN 1: GOOGLE LOGIN
    if (body.token) {
      const ticket = await client.verifyIdToken({
        idToken: body.token,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
      const payload = ticket.getPayload();
      if (!payload) throw new Error("Không xác thực được Google token");

      const email = payload.email!;
      const name = payload.name || "";
      const avatar = payload.picture || "";

      let user = await prisma.user.findUnique({ where: { email } });
      if (!user) {
        user = await prisma.user.create({
          data: { email, name, avatar, passwordHash: "" },
        });
      }

      const jwtToken = await signToken({
        id: user.id,
        email: user.email,
        rememberMe: true,
      });

      const res = NextResponse.json({
        message: "Đăng nhập Google thành công",
        user: { id: user.id, email: user.email, name: user.name },
      });

      // ✅ set cookie bằng API chuẩn
      res.cookies.set("token", jwtToken, {
        httpOnly: true,
        path: "/",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7, // 7 ngày
        secure: process.env.NODE_ENV === "production",
      });

      return res;
    }

    // 🔹 PHẦN 2: EMAIL/PASSWORD LOGIN
    const { email, password, rememberMe } = body;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !user.passwordHash) {
      return NextResponse.json(
        { error: "Tài khoản không tồn tại hoặc sai mật khẩu" },
        { status: 400 }
      );
    }

    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) {
      return NextResponse.json({ error: "Sai mật khẩu" }, { status: 401 });
    }

    const jwtToken = await signToken({
      id: user.id,
      email: user.email,
      rememberMe,
    });

    const res = NextResponse.json({
      message: "Đăng nhập thành công",
      user: { id: user.id, email: user.email, name: user.name },
    });

    // ✅ set cookie bằng API chuẩn
    res.cookies.set("token", jwtToken, {
      httpOnly: true,
      path: "/",
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: rememberMe ? 60 * 60 * 24 * 7 : undefined, // nếu nhớ thì 7 ngày, không thì session
    });

    return res;
  } catch (err: any) {
    console.error("Login error:", err);
    return NextResponse.json({ error: "Đăng nhập thất bại" }, { status: 400 });
  }
}
