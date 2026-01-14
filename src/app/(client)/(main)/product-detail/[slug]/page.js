import { getProductBySlug, getRelatedProduct } from "@/lib/api/productApi";
import ProductDetail from "../ProductDetail";
import HeaderLayout from "@/components/Layout/HeaderLayout";
// import ImageSilder from "./_components/ImageSilder";

const DetailProductPage = async ({ params }) => {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  const related = await getRelatedProduct({
    productId: product.id,
  });
  return <ProductDetail product={product} />;
};

export default DetailProductPage;
