import { AlertTriangle, Bell } from "lucide-react";
import Link from "next/link";

export default function Alerts({ alerts = [] }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Thông báo hệ thống
        </h3>
      </div>
      <div className="p-6 space-y-4">
        {alerts.length === 0 && (
          <p className="text-green-500 text-sm text-center">
            Hệ thống hoạt động bình thường.
          </p>
        )}

        {alerts.map((alert, index) => (
          <div
            key={index}
            className={`flex items-start space-x-3 p-3 rounded-lg ${
              alert.type === "warning"
                ? "bg-orange-50 dark:bg-orange-900/20"
                : "bg-blue-50 dark:bg-blue-900/20"
            }`}
          >
            {alert.type === "warning" ? (
              <AlertTriangle className="w-5 h-5 text-orange-500 mt-0.5" />
            ) : (
              <Bell className="w-5 h-5 text-blue-500 mt-0.5" />
            )}
            <div>
              <Link href={alert.link || "/admin/variants?stockStatus=low_stock%2Cout_of_stock"}>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {alert.title}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {alert.description}
                </p>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
