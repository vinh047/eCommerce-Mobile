import { Check } from "lucide-react";

export default function CheckoutStepper({ currentStep }) {
  const steps = [
    { number: 1, label: "Thông tin giao hàng" },
    { number: 2, label: "Thanh toán & Đặt hàng" },
  ];

  return (
    <div className="flex items-center justify-center w-full mb-8">
      {steps.map((step, index) => {
        const isCompleted = currentStep > step.number;
        const isActive = currentStep === step.number;

        return (
          <div key={step.number} className="flex items-center">
            {/* Step Circle */}
            <div className="relative flex flex-col items-center group">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 border-2
                  ${
                    isCompleted
                      ? "bg-blue-600 border-blue-600 text-white"
                      : isActive
                      ? "bg-white border-blue-600 text-blue-600 shadow-[0_0_0_4px_rgba(37,99,235,0.2)]"
                      : "bg-white border-gray-300 text-gray-400"
                  }
                `}
              >
                {isCompleted ? <Check className="w-5 h-5" /> : step.number}
              </div>
              <div
                className={`absolute top-12 whitespace-nowrap text-sm font-medium transition-colors duration-300
                  ${isActive || isCompleted ? "text-blue-700" : "text-gray-500"}
                `}
              >
                {step.label}
              </div>
            </div>

            {/* Connector Line */}
            {index < steps.length - 1 && (
              <div className="w-24 sm:w-32 h-1 mx-4 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className={`h-full bg-blue-600 transition-all duration-500 ease-out`}
                  style={{ width: isCompleted ? "100%" : "0%" }}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
