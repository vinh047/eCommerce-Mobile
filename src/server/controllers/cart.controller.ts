import { NextRequest, NextResponse } from "next/server";
import { cartService } from "../services/cart.service";
import { verifyToken } from "@/lib/auth";
import { cartItemService } from "../services/cartItem.service";

export const cartController = {
  getCart: async (req: NextRequest) => {
    try {
      const token = req.cookies.get("token")?.value;
      if (!token) {
        return NextResponse.json(
          { message: "Unauthorized: Vui lòng đăng nhập" },
          { status: 401 }
        );
      }

      const payload = await verifyToken(token);
      if (!payload || !payload.id) {
        return NextResponse.json(
          { message: "Unauthorized: Token không hợp lệ" },
          { status: 401 }
        );
      }

      const cart = await cartService.getCartByUserId(Number(payload.id));

      return NextResponse.json(cart || { items: [] }, { status: 200 });
    } catch (error) {
      console.error("Error getting cart:", error);
      return NextResponse.json(
        { message: "Lỗi server khi lấy giỏ hàng", error: String(error) },
        { status: 500 }
      );
    }
  },

  async removeItem(req: NextRequest) {
    try {
      const { id } = await req.json(); 
      const deletedItem = await cartItemService.removeCartItemById(Number(id));

      return NextResponse.json(
        { message: "Đã xóa sản phẩm khỏi giỏ hàng", item: deletedItem },
        { status: 200 }
      );
    } catch (error) {
      console.error("Error removing cart item:", error);
      return NextResponse.json(
        { message: "Lỗi server khi xóa sản phẩm", error: String(error) },
        { status: 500 }
      );
    }
  },

  async updateQuantityItem(req: NextRequest) {
    try {
      const { id, quantity } = await req.json();

      if (!id || typeof quantity !== "number") {
        return NextResponse.json(
          { message: "Thiếu id hoặc quantity không hợp lệ" },
          { status: 400 }
        );
      }

      const updatedItem = await cartItemService.updateQuantity(
        Number(id),
        quantity
      );

      return NextResponse.json(
        { message: "Đã cập nhật số lượng sản phẩm", item: updatedItem },
        { status: 200 }
      );
    } catch (error) {
      console.error("Error updating cart item quantity:", error);
      return NextResponse.json(
        { message: "Lỗi server khi cập nhật số lượng", error: String(error) },
        { status: 500 }
      );
    }
  },
};
