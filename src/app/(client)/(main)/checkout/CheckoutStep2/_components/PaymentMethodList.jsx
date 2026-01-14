import { CreditCard, Banknote, Wallet } from "lucide-react";

export default function PaymentMethodList({
  paymentMethods,
  selectedPaymentMethodId,
  onSelect,
}) {
  // Hàm helper chọn icon dựa trên code (nếu backend có trả về code)
  const getIcon = (code) => {
    switch (code) {
      case "cod": return <Banknote className="w-6 h-6" />;
      case "bank_transfer": return <CreditCard className="w-6 h-6" />;
      default: return <Wallet className="w-6 h-6" />;
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="font-bold text-gray-900 text-lg flex items-center gap-2">
        1. Chọn phương thức thanh toán
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {paymentMethods.map((m) => {
          const isSelected = selectedPaymentMethodId === m.id;
          return (
            <div
              key={m.id}
              onClick={() => onSelect(m.id)}
              className={`relative cursor-pointer rounded-xl border-2 p-4 transition-all duration-200 flex items-start gap-4 hover:shadow-md
                ${
                  isSelected
                    ? "border-blue-600 bg-blue-50/50 shadow-sm"
                    : "border-gray-100 bg-white hover:border-gray-300"
                }
              `}
            >
              {/* Icon Box */}
              <div
                className={`p-3 rounded-lg flex items-center justify-center shrink-0 transition-colors
                  ${
                    isSelected
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-500"
                  }`}
              >
                {getIcon(m.code)}
              </div>

              {/* Content */}
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className={`font-semibold ${isSelected ? "text-blue-900" : "text-gray-900"}`}>
                    {m.name}
                  </h4>
                  {isSelected && (
                    <div className="w-4 h-4 rounded-full bg-blue-600 flex items-center justify-center">
                      <div className="w-1.5 h-1.5 bg-white rounded-full" />
                    </div>
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                  {m.description || "Thanh toán an toàn & tiện lợi"}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}