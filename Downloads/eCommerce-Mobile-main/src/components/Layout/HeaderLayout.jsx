import Header from "@/components/Header";
export default function HeaderLayout({ children }) {
  return (
    <>
      <Header />
      {children}
    </>
  );
}
