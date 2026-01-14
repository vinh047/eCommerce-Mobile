"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo } from "react";
import { ChevronRight } from "lucide-react";
import { ROUTES } from "@/config/routes";

/**
 * Breadcrumb
 *
 * Props:
 * - items?: [{ href, label }]              // nếu truyền -> dùng luôn, bỏ qua pathname
 * - customLabels?: { [slug]: string | (ctx) => string }
 * - transformLabel?: (label, ctx) => string
 * - hide?: (ctx) => boolean                // ẩn segment bất kỳ
 * - maxItems?: number                      // mặc định: hiển thị hết
 * - separator?: ReactNode                  // mặc định: ChevronRight
 * - home?: { href: string, label: string } // mặc định: { '/', 'Trang chủ' }
 * - capitalizeFirst?: boolean              // mặc định: true
 *
 * ctx = { slug, index, parts, href }
 */
export default function Breadcrumb({
  items,
  customLabels = {},
  transformLabel,
  hide,
  maxItems = Infinity,
  separator,
  home = { href: ROUTES.HOME, label: "Trang chủ" },
  capitalizeFirst = true,
}) {
  const pathname = usePathname();

  const segments = useMemo(() => {
    // Nếu truyền items thủ công -> dùng luôn
    if (Array.isArray(items) && items.length > 0) {
      return items.map((it, i) => ({
        slug: it.href ?? String(i),
        href: it.href,
        label: it.label,
      }));
    }

    // Tạo từ pathname
    const parts = (pathname || "/").split("/").filter(Boolean); // ['products', 'dien-thoai']

    const derived = parts.map((slug, index) => {
      const href = "/" + parts.slice(0, index + 1).join("/");

      // 1) label theo customLabels (string hoặc function)
      let label =
        typeof customLabels[slug] === "function"
          ? customLabels[slug]({ slug, index, parts, href })
          : customLabels[slug];

      // 2) mặc định: decode & thay '-' = ' '
      if (!label) {
        label = decodeURIComponent(slug).replace(/-/g, " ");
        if (index === 0 && capitalizeFirst) label = capitalize(label);
      }

      // 3) transform toàn cục (nếu có)
      if (typeof transformLabel === "function") {
        label = transformLabel(label, { slug, index, parts, href });
      }

      return { slug, href, label, index, parts };
    });

    // 4) filter theo hide
    const filtered =
      typeof hide === "function"
        ? derived.filter((seg) => !hide(seg))
        : derived;

    // 5) rút gọn theo maxItems
    if (Number.isFinite(maxItems) && filtered.length > maxItems) {
      const first = filtered[0];
      const last = filtered[filtered.length - 1];
      return [first, { slug: "...", href: null, label: "…" }, last];
    }

    return filtered;
  }, [
    items,
    pathname,
    customLabels,
    transformLabel,
    hide,
    maxItems,
    capitalizeFirst,
  ]);

  if (!segments.length) return null;

  const Sep = separator ?? (
    <ChevronRight className="h-4 w-4 text-gray-400" aria-hidden />
  );

  return (
    <nav
      aria-label="Breadcrumb"
      className="flex items-center gap-2 text-sm text-muted-foreground"
    >
      {/* Home */}
      <Crumb href={home.href} label={home.label} />

      {segments.map((seg, i) => {
        const isLast = i === segments.length - 1;
        return (
          <div
            key={`${seg.href ?? seg.slug}-${i}`}
            className="flex items-center gap-2"
          >
            {Sep}
            {isLast || !seg.href ? (
              <span className="text-gray-400 font-medium">{seg.label}</span>
            ) : (
              <Crumb href={seg.href} label={seg.label} />
            )}
          </div>
        );
      })}
    </nav>
  );
}

function Crumb({ href, label }) {
  return (
    <Link
      href={href}
      className="relative text-gray-600 hover:text-blue-600 transition-colors font-medium group"
    >
      <span>{label}</span>
      <span className="absolute left-0 bottom-0 w-0 h-[1px] bg-blue-600 transition-all duration-300 group-hover:w-full" />
    </Link>
  );
}

function capitalize(str = "") {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
