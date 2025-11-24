// client-transition.jsx (Client Component)
"use client";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function ClientTransition() {
  const pathname = usePathname();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const timeout = setTimeout(() => setLoading(false), 150);
    return () => clearTimeout(timeout);
  }, [pathname]);

  if (!loading) return null;

  return (
    <div className="fixed inset-0 bg-white/70 backdrop-blur-sm z-[9999] flex items-center justify-center">
      <div className="animate-spin rounded-full w-8 h-8 border-2 border-black border-t-transparent"></div>
    </div>
  );
}
