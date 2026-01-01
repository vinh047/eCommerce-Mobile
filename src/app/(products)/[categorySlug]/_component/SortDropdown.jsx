// SortDropdown.jsx
"use client";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ArrowUpDown, Check, ChevronDown } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion"; // 1. Import Framer Motion

const SORT_OPTIONS = [
  { label: "Nổi bật nhất", value: "latest" },
  { label: "Giá tăng dần", value: "price-asc" },
  { label: "Giá giảm dần", value: "price-desc" },
  { label: "Tên A-Z", value: "name-asc" },
];

export default function SortDropdown() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentSort = searchParams.get("sort") || "latest";

  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const currentLabel = SORT_OPTIONS.find((opt) => opt.value === currentSort)?.label || "Sắp xếp";

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSortChange = (value) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("sort", value);
    params.set("page", "1");
    router.push(pathname + "?" + params.toString());
    setIsOpen(false);
  };

  // 2. Cấu hình Animation Dropdown
  const dropdownVariants = {
    hidden: { 
      opacity: 0, 
      y: -10, // Trượt từ trên xuống 1 xíu
      scale: 0.95, // Hơi nhỏ lại
      transition: { duration: 0.15, ease: "easeInOut" }
    },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1, 
      transition: { duration: 0.2, ease: "easeOut" }
    },
    exit: { 
      opacity: 0, 
      y: -10, 
      scale: 0.95, 
      transition: { duration: 0.15, ease: "easeIn" }
    }
  };

  return (
    <div className="flex items-center gap-2" ref={dropdownRef}>
      <span className="text-sm font-medium text-gray-700 hidden sm:block">Sắp xếp:</span>
      
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`flex items-center gap-2 px-3 py-2 bg-white border rounded-lg shadow-sm text-sm font-medium transition-all duration-200
            ${isOpen ? "border-blue-500 ring-2 ring-blue-100 text-blue-700" : "border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50"}
          `}
        >
          <ArrowUpDown className="w-4 h-4" />
          <span>{currentLabel}</span>
          <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
        </button>

        {/* 3. Dùng AnimatePresence để giữ animation khi đóng */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              variants={dropdownVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-1 z-50 origin-top-right overflow-hidden"
            >
              {SORT_OPTIONS.map((option) => {
                const isActive = currentSort === option.value;
                return (
                  <button
                    key={option.value}
                    onClick={() => handleSortChange(option.value)}
                    className={`w-full text-left px-4 py-2.5 text-sm flex items-center justify-between group transition-colors
                      ${isActive ? "bg-blue-50 text-blue-700 font-medium" : "text-gray-700 hover:bg-gray-50"}
                    `}
                  >
                    {option.label}
                    {isActive && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                      >
                        <Check className="w-4 h-4 text-blue-600" />
                      </motion.div>
                    )}
                  </button>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}