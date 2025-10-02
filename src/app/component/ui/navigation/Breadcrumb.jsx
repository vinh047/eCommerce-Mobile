'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ChevronRight } from 'lucide-react';

export default function Breadcrumb({ customLabels = {} }) {
  const pathname = usePathname();
  const [segments, setSegments] = useState([]);

  useEffect(() => {
    if (!pathname) return;

    const parts = pathname.split('/').filter(Boolean); // ['products', 'dien-thoai']

    const mapped = parts.map((slug, index) => {
      const label =
        customLabels[slug] ||
        (index === 0
          ? capitalize(slug)
          : decodeURIComponent(slug).replace(/-/g, ' '));
      const href = '/' + parts.slice(0, index + 1).join('/');
      return { slug, label, href };
    });

    setSegments(mapped);
  }, [pathname, customLabels]);

  return (
    <nav
      aria-label="Breadcrumb"
      className="flex items-center gap-2 text-sm text-muted-foreground"
    >
      <BreadcrumbItem href="/" label="Trang chủ" />
      {segments.map((item, index) => {
        const isLast = index === segments.length - 1;
        return (
          <div key={item.slug} className="flex items-center gap-2">
            <ChevronRight className="h-4 w-4 text-gray-400" />
            {isLast ? (
              <span className="text-gray-400 font-medium">{item.label}</span>
            ) : (
              <BreadcrumbItem href={item.href} label={item.label} />
            )}
          </div>
        );
      })}
    </nav>
  );
}

function BreadcrumbItem({ href, label }) {
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

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
