import OrderDetailClient from "./OrderDetailClient";

export default async function OrderDetailPage({ params }) {
  const { orderId } = await params;
  return <OrderDetailClient orderId={orderId} />;
}
