import { NextResponse } from "next/server";
import { OAuth2Client } from "google-auth-library";
import jwt from "jsonwebtoken";
import prisma from "@/lib/prisma";

// Lấy từ .env
const googleClientId = process.env.GOOGLE_CLIENT_ID;
const jwtSecret = process.env.JWT_SECRET || "default-secret";

if (!googleClientId) {
    console.warn("⚠️ GOOGLE_CLIENT_ID is not set in env");
}

// Client verify ID token của Google
const client = new OAuth2Client(googleClientId);

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { token } = body || {};

        if (!token) {
            return NextResponse.json(
                { error: "Missing Google token" },
                { status: 400 }
            );
        }

        // 1️⃣ Verify token với Google
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: googleClientId,
        });

        const payload = ticket.getPayload();

        if (!payload) {
            return NextResponse.json(
                { error: "Invalid Google token" },
                { status: 401 }
            );
        }

        const googleId = payload.sub;   // ID unique từ Google
        const email = payload.email;
        const name = payload.name;
        const picture = payload.picture;

        if (!email) {
            return NextResponse.json(
                { error: "Google account has no email" },
                { status: 400 }
            );
        }

        // 2️⃣ Vì schema User require passwordHash, ta tạo password giả cho user đăng nhập bằng Google
        const fakePasswordHash = `google_${googleId || "noid"}`;

        // 3️⃣ Tìm user trong DB, nếu chưa có thì tạo mới
        let user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            user = await prisma.user.create({
                data: {
                    email,
                    passwordHash: fakePasswordHash,
                    name: name || null,
                    avatar: picture || null,
                },
            });
        } else {
            // Cập nhật nhẹ name/avatar nếu muốn
            user = await prisma.user.update({
                where: { id: user.id },
                data: {
                    name: name || user.name,
                    avatar: picture || user.avatar,
                },
            });
        }

        // 4️⃣ Tạo JWT token cho app
        const appToken = jwt.sign(
            {
                userId: user.id,
                email: user.email,
            },
            jwtSecret,
            { expiresIn: "7d" }
        );

        // 5️⃣ Trả dữ liệu về cho frontend
        return NextResponse.json(
            {
                message: "Google login success",
                token: appToken,
                user: {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    avatar: user.avatar,
                },
            },
            { status: 200 }
        );
    } catch (error: any) {
        console.error("Error in /api/auth/google:", error);

        return NextResponse.json(
            {
                error: "Internal Server Error",
                detail: error?.message ?? "Unknown error",
            },
            { status: 500 }
        );
    }
}
