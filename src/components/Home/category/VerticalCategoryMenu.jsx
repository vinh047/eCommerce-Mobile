import Link from "next/link";
import { ChevronRight, List } from "lucide-react";
import CategoryIcon from "./CategoryIcon";

export default function VerticalCategoryMenu({ categories }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 h-[400px] flex flex-col overflow-hidden">
      <div className="px-4 py-3 border-b border-gray-100 bg-white z-10 shrink-0">
        <h3 className="font-bold text-gray-800 text-sm uppercase flex items-center gap-2">
          <List className="w-4 h-4" />
          Danh mục
        </h3>
      </div>

      <div className="flex-1 overflow-y-auto subtle-scroll min-h-0 bg-white">
        <div className="py-1">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/${cat.slug}`}
              className="flex items-center justify-between px-4 py-2.5 hover:bg-blue-50 group transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-3 overflow-hidden">
                <span className="text-gray-400 group-hover:text-blue-600 transition-colors shrink-0">
                  <CategoryIcon keyName={cat.iconKey} className="w-4 h-4" />
                </span>
                <span className="text-sm text-gray-700 font-medium group-hover:text-blue-700 truncate">
                  {cat.name}
                </span>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-300 opacity-0 group-hover:opacity-100 group-hover:text-blue-500 transition-all shrink-0" />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
