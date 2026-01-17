import PaymentMethodsClient from "./_components/PaymentMethodsClient";
import { prisma } from "@/lib/prisma";

export const metadata = {
  title: "Quản lý Phương thức thanh toán | Admin",
};

// Hàm lấy data trực tiếp từ DB (Server-side)
async function getPaymentMethods() {
  try {
    const methods = await prisma.paymentMethod.findMany({
      include: {
        accounts: {
          orderBy: { id: "asc" },
        },
      },
      orderBy: { displayOrder: "asc" },
    });
    return methods;
  } catch (error) {
    console.error("Failed to fetch payment methods:", error);
    return [];
  }
}

export default async function PaymentMethodsPage() {
  const initialData = await getPaymentMethods();

  return <PaymentMethodsClient initialData={initialData} />;
}