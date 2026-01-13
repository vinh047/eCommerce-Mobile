import { getProductBySlug, getRelatedProduct } from "@/lib/api/productApi";
import DetailProduct from "../DetailProduct";
import HeaderLayout from "@/components/Layout/HeaderLayout";
// import ImageSilder from "./_components/ImageSilder";

const DetailProductPage = async ({ params }) => {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  const related = await getRelatedProduct({
    productId: product.id,
  });
  return (
    <HeaderLayout>
      <DetailProduct product={product} />
    </HeaderLayout>
  );
};

export default DetailProductPage;
