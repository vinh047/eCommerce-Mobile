import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { signToken } from "@/lib/auth";
import bcrypt from "bcryptjs";
import { serialize } from "cookie";
import { OAuth2Client } from "google-auth-library";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export async function POST(req: Request) {
    try {
        const body = await req.json();

        // 🔹 Nếu có token → xử lý đăng ký bằng Google
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
                message: "Đăng ký/Đăng nhập Google thành công",
                user: { id: user.id, email: user.email, name: user.name },
            });
            res.headers.set("Set-Cookie", cookie);
            return res;
        }

        // 🔹 Nếu không có token → đăng ký truyền thống
        const { name, email, password } = body;
        if (!name || !email || !password)
            return NextResponse.json({ error: "Thiếu thông tin" }, { status: 400 });

        const existing = await prisma.user.findUnique({ where: { email } });
        if (existing)
            return NextResponse.json({ error: "Email đã tồn tại" }, { status: 400 });

        const passwordHash = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: { name, email, passwordHash },
        });

                    const jwtToken = await signToken({ id: user.id, email: user.email });

        const cookie = serialize("token", jwtToken, {
            httpOnly: true,
            path: "/",
            maxAge: 60 * 60 * 24 * 7,
            sameSite: "lax",
        });

        const res = NextResponse.json({
            message: "Đăng ký thành công",
            user: { id: user.id, email: user.email, name: user.name },
        });
        res.headers.set("Set-Cookie", cookie);
        return res;
    } catch (err) {
        console.error("Register error:", err);
        return NextResponse.json({ error: "Đăng ký thất bại" }, { status: 400 });
    }
}
