"use client";

import { Calendar } from "lucide-react";

export default function ReportsToolbar({ range, setRange }) {
  const ranges = [
    { value: "7days", label: "7 ngày qua" },
    { value: "30days", label: "30 ngày qua" },
    { value: "this_month", label: "Tháng này" },
  ];

  return (
    <div className="flex items-center justify-between bg-white dark:bg-gray-800 p-2 rounded-lg border border-gray-200 dark:border-gray-700 mb-6 shadow-sm max-w-md">
      {ranges.map((r) => (
        <button
          key={r.value}
          onClick={() => setRange(r.value)}
          className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-all ${
            range === r.value
              ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 shadow-sm"
              : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700"
          }`}
        >
          {r.label}
        </button>
      ))}
      <div className="px-3 border-l dark:border-gray-700 ml-2">
         <Calendar className="w-5 h-5 text-gray-400" />
      </div>
    </div>
  );
}