import { NextRequest } from "next/server";
import { cartController } from "@/server/controllers/cart.controller";

export async function GET(req: NextRequest) {
  return cartController.getCart(req);
}

export async function DELETE(req: NextRequest) {
  return cartController.removeItem(req);
}

export async function PUT(req: NextRequest) {
  return cartController.updateQuantityItem(req);
}