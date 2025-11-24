import prisma from "@/lib/prisma";

export const cartItemService = {
  async removeCartItemById(id: number) {
    return await prisma.cartItem.delete({ where: { id } });
  },
  
  async updateQuantity(id: number, quantity: number) {
    return await prisma.cartItem.update({ where: { id }, data: { quantity } });
  },
};
