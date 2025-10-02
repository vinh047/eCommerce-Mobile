import BannerSlider from "@/component/ui/banner/BannerSlider";
import CategoryIcon from "@/component/ui/category/CategoryIcon";
import CategorySection from "@/component/ui/category/CategorySection";
import Link from "next/link";

const categories = [
  {
    id: 1,
    name: "Điện thoại",
    slug: "dien-thoai",
    icon_key: "phones",
  },
  {
    id: 2,
    name: "Máy tính bảng",
    slug: "may-tinh-bang",
    icon_key: "tablets",
  },
  {
    id: 3,
    name: "Phụ kiện",
    slug: "phu-kien",
    icon_key: "accessories",
  },
  {
    id: 4,
    name: "Đồng hồ",
    slug: "dong-ho-thong-minh",
    icon_key: "watches",
  },
  {
    id: 5,
    name: "Âm thanh",
    slug: "am-thanh",
    icon_key: "audio",
  },
];

export default function HomePage() {
  // const [loading, setLoading] = useState(false);

  // const [ready, setReady] = useState(false);
  // useEffect(() => {
  //   const timer = setTimeout(() => setReady(true), 100);
  //   return () => clearTimeout(timer);
  // }, []);
  return (
    <main>
      <div className="max-w-screen-xl mx-auto px-4 py-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pb-4">
          {/* Danh mục sản phẩm bên trái */}
          <aside className="md:col-span-1">
            <h2 className="text-base font-semibold text-neutral-800 mb-4 border-b pb-2">
              Danh mục sản phẩm
            </h2>
            <div className="space-y-2">
              {categories.map(({ id, icon_key: icon, name }) => (
                <Link
                href={"/category"}
                  key={id}
                  className="group flex items-center gap-3 px-3 py-2 bg-gradient-to-r from-white to-slate-50 rounded-lg shadow-sm hover:shadow-md hover:from-blue-50 transition-all duration-300 cursor-pointer"
                >
                  <div className="p-2 rounded-md bg-blue-100 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                    <CategoryIcon keyName={icon} />
                  </div>
                  <span className="text-sm text-neutral-700 group-hover:text-blue-700 font-medium transition-colors duration-300">
                    {name}
                  </span>
                </Link>
              ))}
            </div>
          </aside>

          {/* Banner bên phải */}
          <section className="md:col-span-3">
            <BannerSlider />
          </section>
        </div>

        {categories.map((cat) => (
          <CategorySection key={cat.id} category={cat} limit={10} />
        ))}
      </div>
    </main>
  );
}