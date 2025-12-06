import { useFormContext } from "react-hook-form";
import { ValueType } from "@prisma/client";

export default function SpecsForm({ template, isLoading }) {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  if (isLoading)
    return (
      <div className="p-6 text-center text-gray-500">
        Đang tải mẫu thông số...
      </div>
    );

  if (!template) {
    return (
      <div className="p-8 text-center border-2 border-dashed border-gray-300 rounded-xl bg-gray-50">
        <p className="text-gray-500">
          Vui lòng chọn <strong>Danh mục</strong> ở Tab "Thông tin chung" để tải
          cấu hình thông số.
        </p>
      </div>
    );
  }

  // Lấy danh sách specs từ template (Template định nghĩa những field nào cần điền)
  const specs = template.productSpecs || [];

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
      <h3 className="text-lg font-bold text-gray-900 mb-1">
        Thông số kỹ thuật
      </h3>
      <p className="text-sm text-gray-500 mb-6">
        Cấu hình cho danh mục:{" "}
        <span className="font-medium text-blue-600">{template.name}</span>
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {specs.map((spec) => {
          const isDiscrete = spec.valueType === ValueType.discrete;
          const isRange = spec.valueType === ValueType.range;
          return (
            <div key={spec.id} className="col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                {spec.label}{" "}
                {spec.unit && (
                  <span className="text-gray-400 font-normal">
                    ({spec.unit})
                  </span>
                )}
                {spec.isRequired && (
                  <span className="text-red-500 ml-1">*</span>
                )}
              </label>

              {/* Nếu valueType = discrete → select */}
              {isDiscrete ? (
                <select
                  {...register(`specs.${spec.code}`, {
                    required: spec.isRequired
                      ? `${spec.label} là bắt buộc`
                      : false,
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                >
                  <option value="">-- Chọn --</option>
                  {spec.options?.map((opt) => (
                    <option key={opt.id} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              ) : (
                // Nếu valueType = range hoặc khác → input
                <input
                  type={spec.datatype === "number" ? "number" : "text"}
                  step="any"
                  {...register(`specs.${spec.code}`, {
                    required: spec.isRequired
                      ? `${spec.label} là bắt buộc`
                      : false,
                    valueAsNumber: spec.datatype === "number",
                  })}
                  placeholder={`Nhập ${spec.label.toLowerCase()}...`}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                />
              )}

              {errors.specs?.[spec.code] && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.specs[spec.code].message}
                </p>
              )}
            </div>
          );
        })}

        {specs.length === 0 && (
          <div className="col-span-2 text-center py-4 text-gray-400 italic">
            Danh mục này chưa được cấu hình thông số kỹ thuật.
          </div>
        )}
      </div>
    </div>
  );
}
