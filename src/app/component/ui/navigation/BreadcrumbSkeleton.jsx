import { ChevronRight } from "lucide-react";

export default function BreadcrumbSkeleton() {
  return (
    <nav
      aria-label="Breadcrumb"
      className="flex items-center gap-2 text-sm text-muted-foreground animate-pulse"
    >
      <div className="h-4 w-20 bg-gray-300 rounded" />
      <ChevronRight className="h-4 w-4 text-gray-400" />
      <div className="h-4 w-24 bg-gray-300 rounded" />
      <ChevronRight className="h-4 w-4 text-gray-400" />
      <div className="h-4 w-28 bg-gray-300 rounded" />
    </nav>
  );
}
