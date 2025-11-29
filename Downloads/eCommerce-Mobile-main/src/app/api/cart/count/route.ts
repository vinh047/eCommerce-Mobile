// src/app/api/cart/count/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";
import { parse as parseCookie } from "cookie";

const JWT_SECRET = process.env.JWT_SECRET || "";

type GuestCartItem = { variantId: number; quantity: number };

/**
 * GET /api/cart/count
 *
 * Behavior:
 * - If request contains a Bearer JWT (Authorization header) and the token decodes to { userId },
 *   the route will look up the user's cart items in the database and return the total quantity.
 * - Else if a cookie named "guest_cart" exists (JSON array of items), it will parse and sum quantities.
 * - Otherwise returns { count: 0 }.
 *
 * Response: { count: number }
 */

export async function GET(req: Request) {
  try {
    // 1) Try Authorization: Bearer <token>
    const authHeader = req.headers.get("authorization") || "";
    if (authHeader.startsWith("Bearer ")) {
      const token = authHeader.slice(7).trim();
      try {
        const payload = jwt.verify(token, JWT_SECRET) as any;
        const userId = Number(payload?.userId || payload?.id);
        if (userId && Number.isFinite(userId)) {
          // Find cart items for user and sum quantities
          const cart = await prisma.cart.findUnique({
            where: { userId },
            include: { items: true },
          });

          const count =
            cart?.items?.reduce((s, it) => s + (Number(it.quantity) || 0), 0) || 0;

          return NextResponse.json({ count });
        }
      } catch (e) {
        // invalid token -> fallthrough to cookie/guest handling
      }
    }

    // 2) Try cookie-based guest cart (cookie name: guest_cart)
    const cookieHeader = req.headers.get("cookie") || "";
    if (cookieHeader) {
      const cookies = parseCookie(cookieHeader);
      const guest = cookies["guest_cart"];
      if (guest) {
        try {
          const parsed = JSON.parse(guest) as GuestCartItem[] | { items?: GuestCartItem[] };
          const items = Array.isArray(parsed) ? parsed : parsed.items ?? [];
          const count = items.reduce((s, it) => s + (Number(it.quantity) || 0), 0);
          return NextResponse.json({ count });
        } catch (e) {
          // invalid cookie JSON -> ignore and continue
        }
      }
    }

    // 3) If no auth and no guest cart, try to infer from session cookie "userId" (optional)
    if (cookieHeader) {
      const cookies = parseCookie(cookieHeader);
      const userIdCookie = cookies["userId"] || cookies["user_id"];
      const userId = userIdCookie ? Number(userIdCookie) : NaN;
      if (userId && Number.isFinite(userId)) {
        const cart = await prisma.cart.findUnique({
          where: { userId },
          include: { items: true },
        });
        const count =
          cart?.items?.reduce((s, it) => s + (Number(it.quantity) || 0), 0) || 0;
        return NextResponse.json({ count });
      }
    }

    // Default: 0
    return NextResponse.json({ count: 0 });
  } catch (err) {
    console.error("api/cart/count error:", err);
    return NextResponse.json({ count: 0 }, { status: 500 });
  }
}
