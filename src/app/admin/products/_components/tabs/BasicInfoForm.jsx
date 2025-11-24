import { useFormContext } from "react-hook-form";

export default function BasicInfoForm({ categories, brands }) {
  const { register, formState: { errors } } = useFormContext();

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 max-w-4xl">
      <div className="grid grid-cols-2 gap-6">
        <div className="col-span-2">
          <label className="label">Tên sản phẩm *</label>
          <input 
            {...register("name", { required: "Tên là bắt buộc" })} 
            className="input-field" 
            placeholder="VD: iPhone 15 Pro Max"
          />
          {errors.name && <p className="error-text">{errors.name.message}</p>}
        </div>

        <div>
          <label className="label">Danh mục (Quan trọng) *</label>
          <select 
            {...register("categoryId", { required: "Phải chọn danh mục" })} 
            className="input-field"
          >
            <option value="">-- Chọn danh mục --</option>
            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
           <p className="text-xs text-gray-500 mt-1">Chọn danh mục để tải bộ thông số kỹ thuật.</p>
           {errors.categoryId && <p className="error-text">{errors.categoryId.message}</p>}
        </div>

        <div>
          <label className="label">Thương hiệu *</label>
          <select {...register("brandId", { required: "Phải chọn thương hiệu" })} className="input-field">
            <option value="">-- Chọn thương hiệu --</option>
            {brands.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
          </select>
        </div>

        {/* Slug, Description, Active switch... */}
      </div>
    </div>
  );
}