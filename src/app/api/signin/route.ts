import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { signToken } from "@/lib/auth";
import { OAuth2Client } from "google-auth-library";
import { serialize } from "cookie";
import bcrypt from "bcryptjs";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export async function POST(req: Request) {
    try {
        const body = await req.json();

        // 🔹 Nếu có Google token → xử lý đăng nhập Google
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

                        const jwtToken = await signToken({ id: user.id, email: user.email });

            const cookie = serialize("token", jwtToken, {
                httpOnly: true,
                path: "/",
                maxAge: 60 * 60 * 24 * 7,
                sameSite: "lax",
            });

            const res = NextResponse.json({
                message: "Đăng nhập Google thành công",
                user: { id: user.id, email: user.email, name: user.name },
            });
            res.headers.set("Set-Cookie", cookie);
            return res;
        }

        // 🔹 Ngược lại → đăng nhập bằng email & mật khẩu
        const { email, password } = body;
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user || !user.passwordHash)
            return NextResponse.json({ error: "Tài khoản không tồn tại hoặc không có mật khẩu" }, { status: 400 });

        const isValid = await bcrypt.compare(password, user.passwordHash);
        if (!isValid)
            return NextResponse.json({ error: "Sai mật khẩu" }, { status: 401 });

                    const jwtToken = await signToken({ id: user.id, email: user.email });

        const cookie = serialize("token", jwtToken, {
            httpOnly: true,
            path: "/",
            maxAge: 60 * 60 * 24 * 7,
            sameSite: "lax",
        });

        const res = NextResponse.json({
            message: "Đăng nhập thành công",
            user: { id: user.id, email: user.email, name: user.name },
        });
        res.headers.set("Set-Cookie", cookie);
        return res;
    } catch (err: any) {
        console.error("Login error:", err);
        return NextResponse.json({ error: "Đăng nhập thất bại" }, { status: 400 });
    }
}
