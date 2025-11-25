import HeaderLayout from "@/components/Layout/HeaderLayout";
import DetailProductPage from "./[slug]/page";
const ProductDetailRootPage = () => {
  return (
    <HeaderLayout>
      <DetailProductPage />
    </HeaderLayout>
  );
};

export default ProductDetailRootPage;
