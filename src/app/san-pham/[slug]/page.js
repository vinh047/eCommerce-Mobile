import { getProductBySlug, getRelatedProduct } from "@/lib/api/productApi";
import DetailProduct from "../DetailProduct";
// import ImageSilder from "./_components/ImageSilder";

const DetailProductPage = async ({ params }) => {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  const related = await getRelatedProduct({
          productId: product.id,
        });
  return (
   <DetailProduct product={product}/>
  );
};

export default DetailProductPage;
