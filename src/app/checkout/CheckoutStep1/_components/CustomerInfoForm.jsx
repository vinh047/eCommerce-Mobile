import Field from "./Field";

export default function CustomerInfoForm({ customer, onChange }) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">
        Thông tin khách hàng
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field
          label="Họ tên"
          value={customer.name}
          onChange={(v) => onChange({ ...customer, name: v })}
        />
        <Field
          label="Email"
          value={customer.email}
          onChange={(v) => onChange({ ...customer, email: v })}
          className="md:col-span-2"
        />
      </div>
    </div>
  );
}