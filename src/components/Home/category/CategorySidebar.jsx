import Link from "next/link";
import CategoryIcon from "./CategoryIcon";

export default function CategorySidebar({ categories }) {
  if (!categories.length) return null;

  return (
    <section className="w-full  bg-white p-4">
      {/* Wrapper để vừa căn giữa, vừa hỗ trợ scroll ngang */}
      <div className="w-full overflow-x-auto scrollbar-hide">
        <div
          className="
            flex justify-center items-center gap-6 
            min-w-max py-1 px-1
          "
        >
          {categories.map(({ id, icon_key: icon, name, slug }) => (
            <Link
              href={`/${slug}`}
              key={id}
              className="
                flex flex-col items-center justify-start 
                min-w-[90px]
                group cursor-pointer select-none
              "
            >
              {/* Icon tròn */}
              <div
                className="
                  w-16 h-16 rounded-full 
                  bg-white border border-gray-200 shadow-sm
                  flex items-center justify-center
                  transition-all duration-200 
                  group-hover:shadow-lg group-hover:border-blue-400
                  group-hover:bg-blue-50
                "
              >
                <span className="text-blue-600 group-hover:text-blue-700 text-xl transition-colors">
                  <CategoryIcon keyName={icon} />
                </span>
              </div>

              {/* Tên danh mục */}
              <span
                className="
                  mt-2 text-[12px] text-center leading-tight
                  text-neutral-700 font-medium 
                  group-hover:text-blue-700
                  transition-colors duration-200 
                  line-clamp-2
                "
              >
                {name}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
