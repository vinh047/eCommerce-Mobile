import OrderDetailClient from "./OrderDetailClient"; // 

export default async function OrderDetailPage({ params }) {
  const resolved = await params;
  const orderId = resolved.orderId;

  return <OrderDetailClient orderId={orderId} />;
}

