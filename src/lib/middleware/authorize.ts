// // lib/middleware/authorize.ts
// import { NextResponse } from "next/server";
// import { verifyToken } from "@/lib/auth";

// export function authorize(requiredPermission: string) {
//   return async (req: Request) => {
//     const cookieHeader = req.headers.get("cookie");
//     const token = cookieHeader?.split(";")
//       .find((c) => c.trim().startsWith("admin_token="))
//       ?.split("=")[1];

//     if (!token) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     }

//     const payload = await verifyToken(token);
//     if (!payload || !payload.permissions.includes(requiredPermission)) {
//       return NextResponse.json({ error: "Forbidden" }, { status: 403 });
//     }

//     // Nếu hợp lệ → cho phép tiếp tục
//     return null;
//   };
// }
