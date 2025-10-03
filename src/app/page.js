import DetailProduct from "./page/DetailProduct";
import product from "@/app/page/productTest.json";
import variant from "@/app/page/VariantTest.json";
import media from "@/app/page/mediaTest.json";

export default function Home() {
  return (
    <>
      <DetailProduct product={product} media={media} variant={variant}/>
    </>
  );
}
