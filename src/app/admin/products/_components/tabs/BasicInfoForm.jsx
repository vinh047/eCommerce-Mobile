import { useFormContext, useWatch } from "react-hook-form";
import { useEffect } from "react";
// Hàm tạo slug đơn giản (có thể chuyển vào utils)
const slugify = (str) => {
  if (!str) return "";
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Bỏ dấu tiếng Việt
    .replace(/[đĐ]/g, "d")
    .replace(/[^a-z0-9\s-]/g, "") // Bỏ ký tự đặc biệt
    .trim()
    .replace(/\s+/g, "-"); // Thay khoảng trắng bằng -
};

export default function BasicInfoForm({ categories, brands }) {
  const {
    register,
    setValue,
    control,
    formState: { errors },
  } = useFormContext();

  // Theo dõi giá trị Name để tự động gen Slug (nếu cần)
  const nameValue = useWatch({ control, name: "name" });
  const slugValue = useWatch({ control, name: "slug" });
  const createdAt = useWatch({ control, name: "createdAt" });

  // Effect: Khi nhập tên, nếu slug đang trống thì tự điền
  useEffect(() => {
    if (nameValue && !slugValue) {
      setValue("slug", slugify(nameValue), { shouldValidate: true });
    }
  }, [nameValue, slugValue, setValue]);

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-5">
        Thông tin chung
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 1. Tên sản phẩm */}
        <div className="col-span-2 md:col-span-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tên sản phẩm <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            {...register("name", { required: "Vui lòng nhập tên sản phẩm" })}
            className={`w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 outline-none transition-all
              ${
                errors.name
                  ? "border-red-500 focus:ring-red-200"
                  : "border-gray-300 focus:ring-blue-200 focus:border-blue-500"
              }
            `}
            placeholder="VD: Samsung Galaxy S25 Ultra"
          />
          {errors.name && (
            <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>
          )}
        </div>

        {/* 2. Slug (Đường dẫn) */}
        <div className="col-span-2 md:col-span-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Slug (URL) <span className="text-red-500">*</span>
          </label>
          <div className="flex">
            <span className="inline-flex items-center px-3 text-gray-500 bg-gray-50 border border-r-0 border-gray-300 rounded-l-lg text-sm">
              /product/
            </span>
            <input
              type="text"
              {...register("slug", { required: "Slug không được để trống" })}
              className="w-full border border-gray-300 rounded-r-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-200 focus:border-blue-500 outline-none"
              placeholder="samsung-galaxy-s25-ultra"
            />
          </div>
          {errors.slug && (
            <p className="text-xs text-red-500 mt-1">{errors.slug.message}</p>
          )}
        </div>

        {/* 3. Danh mục */}
        <div className="col-span-2 md:col-span-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Danh mục <span className="text-red-500">*</span>
          </label>
          <select
            {...register("categoryId", { required: "Vui lòng chọn danh mục" })}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-200 focus:border-blue-500 outline-none"
          >
            <option value="">-- Chọn danh mục --</option>
            {categories?.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
          <p className="text-xs text-gray-500 mt-1">
            Thay đổi danh mục sẽ thay đổi bộ thông số kỹ thuật (Tab 2).
          </p>
          {errors.categoryId && (
            <p className="text-xs text-red-500 mt-1">
              {errors.categoryId.message}
            </p>
          )}
        </div>

        {/* 4. Thương hiệu */}
        <div className="col-span-2 md:col-span-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Thương hiệu <span className="text-red-500">*</span>
          </label>
          <select
            {...register("brandId", { required: "Vui lòng chọn thương hiệu" })}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-200 focus:border-blue-500 outline-none"
          >
            <option value="">-- Chọn thương hiệu --</option>
            {brands?.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name}
              </option>
            ))}
          </select>
          {errors.brandId && (
            <p className="text-xs text-red-500 mt-1">
              {errors.brandId.message}
            </p>
          )}
        </div>

        {/* 5. Mô tả sản phẩm */}
        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Mô tả chi tiết
          </label>
          <textarea
            rows={5}
            {...register("description")}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-200 focus:border-blue-500 outline-none"
            placeholder="Nhập mô tả sản phẩm..."
          />
        </div>

        {/* 6. Trạng thái & Meta Data */}
        <div className="col-span-2 border-t pt-4 flex items-center justify-between">
          {/* Toggle Active */}
          <div className="flex items-center gap-3">
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                {...register("isActive")}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              <span className="ml-3 text-sm font-medium text-gray-700">
                Đang hoạt động (Hiển thị bán)
              </span>
            </label>
          </div>

          {/* Read-only info */}
          {createdAt && (
            <div className="text-xs text-gray-400">
              Ngày tạo: {new Date(createdAt).toLocaleDateString("vi-VN")}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
