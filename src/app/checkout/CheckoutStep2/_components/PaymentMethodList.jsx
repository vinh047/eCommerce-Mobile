export default function PaymentMethodList({
  paymentMethods,
  selectedPaymentMethodId,
  onSelect,
}) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">
        Phương thức thanh toán
      </h2>
      <div className="space-y-3">
        {paymentMethods.map((m) => (
          <label
            key={m.id}
            className={`flex items-start gap-3 p-3 border rounded-lg cursor-pointer transition ${
              selectedPaymentMethodId === m.id
                ? "border-blue-500 bg-blue-50"
                : "border-gray-200 bg-white"
            }`}
          >
            <input
              type="radio"
              name="paymentMethod"
              checked={selectedPaymentMethodId === m.id}
              onChange={() => onSelect(m.id)}
              className="mt-1"
            />
            <div className="flex-1">
              <div className="font-medium text-gray-900">{m.name}</div>
              <div className="text-sm text-gray-600">{m.description}</div>
              {m.accounts?.length > 0 && (
                <div className="mt-3">
                  <div className="text-sm font-medium text-gray-700 mb-2">
                    Tài khoản nhận tiền:
                  </div>
                  <ul className="space-y-2">
                    {m.accounts.map((acc) => (
                      <li key={acc.id} className="text-sm text-gray-700">
                        <span className="font-medium">{acc.accountName}</span> •{" "}
                        {acc.bankName
                          ? `${acc.bankName} - ${acc.bankBranch || ""}`
                          : "Ví/khác"}{" "}
                        • <span className="font-mono">{acc.accountNumber}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </label>
        ))}
      </div>
    </div>
  );
}
