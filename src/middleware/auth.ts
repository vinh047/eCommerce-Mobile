import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "secret";

export async function verifyToken(req: Request) {
    try {
        const authHeader = req.headers.get("authorization");
        if (!authHeader) throw new Error("Thiếu header Authorization");

        const token = authHeader.split(" ")[1];
        if (!token) throw new Error("Token không hợp lệ");

        const decoded = jwt.verify(token, JWT_SECRET);
        return decoded; // Trả lại thông tin user (id, email)
    } catch (err) {
        throw new Error("Token không hợp lệ hoặc đã hết hạn");
    }
}
