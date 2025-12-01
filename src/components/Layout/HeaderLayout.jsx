import Header from "@/components/Header";
import Footer from "../Home/Footer";
export default function HeaderLayout({ children }) {
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );
}
