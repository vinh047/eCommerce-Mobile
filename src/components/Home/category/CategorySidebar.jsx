import Link from "next/link";
import CategoryIcon from "./CategoryIcon"; // Giả sử bạn có component này

export default function CategorySidebar({ categories }) {
  return (
    <aside className="md:col-span-1">
      <h2 className="text-base font-semibold text-neutral-800 mb-4 border-b pb-2">
        Danh mục sản phẩm
      </h2>
      <div className="space-y-2">
        {categories.map(({ id, icon_key: icon, name, slug }) => (
          <Link
            href={`/${slug}`}
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
  );
}