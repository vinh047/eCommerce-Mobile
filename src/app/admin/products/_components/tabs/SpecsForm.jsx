import { useFormContext } from "react-hook-form";

export default function SpecsForm({ template, isLoading }) {
  const { register } = useFormContext();

  if (isLoading) return <div>Đang tải mẫu thông số...</div>;
  if (!template) return <div className="text-gray-500 italic">Vui lòng chọn Danh mục ở Tab 1 trước.</div>;

  // Lấy ProductSpecs (thông số chung)
  const specs = template.productSpecs || [];

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 max-w-4xl">
      <h3 className="text-lg font-semibold mb-4">Thông số kỹ thuật ({template.name})</h3>
      
      <div className="grid grid-cols-2 gap-6">
        {specs.map((spec) => (
          <div key={spec.id} className="col-span-1">
            <label className="label">
              {spec.label} {spec.unit ? `(${spec.unit})` : ""}
              {spec.isRequired && <span className="text-red-500">*</span>}
            </label>
            
            {/* Render Input dựa trên Control Type */}
            {spec.control === "select" ? (
              <select 
                {...register(`specs.${spec.code}`)} // Lưu vào object 'specs'
                className="input-field"
              >
                <option value="">-- Chọn --</option>
                {spec.options?.map(opt => (
                   <option key={opt.id} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            ) : (
              <input
                type={spec.datatype === "number" ? "number" : "text"}
                {...register(`specs.${spec.code}`)}
                className="input-field"
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}