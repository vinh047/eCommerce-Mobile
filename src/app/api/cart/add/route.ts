import prisma from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ message: "Vui lòng đăng nhập để thực hiện thao tác" }), {
        status: 401,
      });
    }

    const token = authHeader.split(" ")[1];
    const payload = await verifyToken(token);

    if (!payload) {
      return new Response(
        JSON.stringify({ message: "Invalid or expired token" }),
        { status: 401 }
      );
    }

    const userId = payload.id;
    const body = await req.json();
    const { variantId, quantity } = body;

    if (!variantId || !quantity) {
      return new Response(JSON.stringify({ message: "Missing parameters" }), {
        status: 400,
      });
    }

    // 🔥 Lấy variant để kiểm tra stock
    const variant = await prisma.variant.findUnique({
      where: { id: variantId },
    });

    if (!variant) {
      return new Response(JSON.stringify({ message: "Variant not found" }), {
        status: 404,
      });
    }

    // 🔥 Nếu số lượng thêm vượt stock
    if (quantity > variant.stock) {
      return new Response(
        JSON.stringify({
          message: "Số lượng thêm vượt quá số lượng tồn kho",
          available: variant.stock,
        }),
        { status: 400 }
      );
    }

    // 👉 Kiểm tra cart tồn tại
    let cart = await prisma.cart.findFirst({
      where: { userId:Number(userId) },
      include: { items: true },
    });

    if (!cart) {
      // Cart chưa tồn tại → tạo mới
      cart = await prisma.cart.create({
        data: {
          userId: Number(userId),
          items: {
            create: [{ variantId, quantity }],
          },
        },
        include: { items: true },
      });
    } else {
      //  Kiểm tra item đã tồn tại trong cart
      const existingItem = cart.items.find(
        (item) => item.variantId === variantId
      );

      if (existingItem) {
        const newQuantity = existingItem.quantity + quantity;

        //  Check nếu vượt stock
        if (newQuantity > variant.stock) {
          return new Response(
            JSON.stringify({
              message: "Số lượng vượt quá tồn kho",
              available: variant.stock,
            }),
            { status: 400 }
          );
        }

        // Cập nhật số lượng
        await prisma.cartItem.update({
          where: { id: existingItem.id },
          data: { quantity: newQuantity },
        });
      } else {
        // Thêm item mới vào cart
        await prisma.cartItem.create({
          data: { cartId: cart.id, variantId, quantity },
        });
      }

      // Lấy lại cart sau khi update
      cart = await prisma.cart.findUnique({
        where: { id: cart.id },
        include: { items: true },
      });
    }

    return new Response(JSON.stringify({ cart,variantId }), { status: 200 });
  } catch (err: any) {
    console.error(err);
    return new Response(JSON.stringify({ message: "Server error" }), {
      status: 500,
    });
  }
}
