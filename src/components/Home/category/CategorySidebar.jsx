import Link from "next/link";
import CategoryIcon from "./CategoryIcon";

export default function CategorySidebar({ categories }) {
  if (!categories.length) return null;

  return (
    <section className="w-full bg-white py-4">
      {/* Scroll ngang */}
      <div className="w-full overflow-x-auto scrollbar-hide px-2">
        <div
          className="
            flex justify-center items-center gap-6 
            min-w-max
          "
        >
          {categories.map(({ id, iconKey: icon, name, slug }) => {
            return (
              <Link
                href={`/${slug}`}
                key={id}
                className="
                  flex flex-col items-center justify-start 
                  min-w-[100px] max-w-[120px]
                  group cursor-pointer select-none
                  transition-transform duration-200 hover:-translate-y-1
                "
                prefetch={true}
              >
                {/* Icon card */}
                <div
                  className="
                    w-16 h-16 rounded-xl 
                    bg-gradient-to-br from-blue-100 to-blue-300
                    shadow-md flex items-center justify-center
                    transition-all duration-200 
                    group-hover:shadow-xl group-hover:from-blue-200 group-hover:to-blue-400
                  "
                >
                  <span className="text-blue-700 group-hover:text-white text-2xl transition-colors">
                    <CategoryIcon keyName={icon} />
                  </span>
                </div>

                {/* Tên danh mục */}
                <span
                  className="
                    mt-3 text-[13px] text-center leading-tight
                    text-gray-800 font-semibold 
                    group-hover:text-blue-600
                    transition-colors duration-200 
                    line-clamp-2
                  "
                >
                  {name}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
