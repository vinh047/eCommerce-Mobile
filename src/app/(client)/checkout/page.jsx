import usersApi from "@/lib/api/usersApi";
import CheckoutPage from "./CheckoutPage";
import HeaderLayout from "@/components/Layout/HeaderLayout";

async function CheckoutPageSection() {
  return (
    <HeaderLayout>
      <CheckoutPage />
    </HeaderLayout>
  );
}

export default CheckoutPageSection;
