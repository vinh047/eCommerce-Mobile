"use client";

import { useState, useEffect, useRef } from "react";
import { X, Image as ImageIcon, Link, Type, Hash, Save, UploadCloud, Loader2, Trash2 } from "lucide-react";
import Image from "next/image"; // Import Image từ Next.js
import productsApi from "@/lib/api/productApi";
import { uploadImage } from "@/lib/api/uploadImageApi"; // Import API upload

export default function BannerModal({ mode, banner, onClose, onSave }) {
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [products, setProducts] = useState([]);
  
  // State cho upload ảnh
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    image: banner?.image || "",
    altText: banner?.altText || "",
    displayOrder: banner?.displayOrder || 0,
    isActive: banner?.isActive ?? true,
    productId: banner?.productId || "",
  });

  // Fetch danh sách sản phẩm
  useEffect(() => {
    const fetchProducts = async () => {
      setLoadingProducts(true);
      try {
        const res = await productsApi.getProducts({ limit: 100, select: "id,name" });
        setProducts(res.data || []);
      } catch (error) {
        console.error("Failed to load products", error);
      } finally {
        setLoadingProducts(false);
      }
    };
    fetchProducts();
  }, []);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // --- XỬ LÝ UPLOAD ẢNH ---
  const handleImageUpload = async (event) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    setIsUploading(true);

    try {
      const formPayload = new FormData();
      formPayload.append("file", file);

      // Gọi API upload
      const res = await uploadImage(formPayload);
      
      // Giả sử API trả về { filename: "..." }
      if (res?.filename) {
        handleInputChange("image", res.filename);
      }
    } catch (error) {
      console.error("Upload banner failed:", error);
      alert("Tải ảnh thất bại, vui lòng thử lại!");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleRemoveImage = () => {
    handleInputChange("image", "");
  };
  // ------------------------

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.image) {
      alert("Vui lòng tải lên hoặc nhập URL ảnh banner!");
      return;
    }
    if (!formData.productId) {
      alert("Vui lòng chọn sản phẩm liên kết!");
      return;
    }

    const payload = {
      ...formData,
      productId: parseInt(formData.productId),
      displayOrder: parseInt(formData.displayOrder),
    };
    onSave(payload);
  };

  // Helper tạo URL ảnh đầy đủ
  const bannerUrl = formData.image 
    ? (formData.image.startsWith("http") ? formData.image : `${process.env.NEXT_PUBLIC_URL_IMAGE || ""}${formData.image}`)
    : null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 text-center">
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose}></div>

        <div className="relative z-10 bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:max-w-2xl w-full">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {mode === "create" ? "Thêm Banner mới" : "Chỉnh sửa Banner"}
            </h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-500 focus:outline-none">
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="px-6 py-6 max-h-[80vh] overflow-y-auto">
            <div className="space-y-6">
              
              {/* Image Upload Area */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Hình ảnh Banner *
                </label>
                
                <div 
                  className={`relative w-full aspect-video (h-48) rounded-lg border-2 border-dashed overflow-hidden transition-all group
                    ${bannerUrl ? "border-blue-500/50" : "border-gray-300 hover:border-blue-400 bg-gray-50 dark:bg-gray-900 dark:border-gray-600"}
                  `}
                >
                    {isUploading && (
                       <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-white/80 dark:bg-black/80 backdrop-blur-[2px]">
                          <Loader2 className="w-8 h-8 text-blue-600 animate-spin mb-2" />
                          <span className="text-xs font-medium text-blue-600">Đang tải lên...</span>
                       </div>
                    )}

                    {bannerUrl ? (
                      <>
                        <Image 
                          src={bannerUrl}
                          alt="Banner Preview"
                          fill
                          className="object-cover"
                        />
                        {/* Action Overlay */}
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                           <button
                             type="button"
                             onClick={() => fileInputRef.current?.click()}
                             className="px-3 py-1.5 bg-white/90 text-gray-800 text-sm font-medium rounded hover:bg-white transition-colors flex items-center gap-2"
                           >
                              <UploadCloud className="w-4 h-4" /> Thay ảnh
                           </button>
                           <button
                             type="button"
                             onClick={handleRemoveImage}
                             className="p-2 bg-red-500/90 text-white rounded hover:bg-red-600 transition-colors"
                             title="Xóa ảnh"
                           >
                              <Trash2 className="w-4 h-4" />
                           </button>
                        </div>
                      </>
                    ) : (
                      <div 
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full h-full flex flex-col items-center justify-center cursor-pointer text-gray-400 hover:text-blue-500 transition-colors"
                      >
                         <UploadCloud className="w-10 h-10 mb-2" />
                         <p className="text-sm font-medium">Nhấn để tải ảnh lên</p>
                         <p className="text-xs mt-1 opacity-70">PNG, JPG, WEBP (Max 5MB)</p>
                      </div>
                    )}

                    <input 
                      type="file" 
                      ref={fileInputRef}
                      onChange={handleImageUpload}
                      accept="image/*"
                      className="hidden" 
                    />
                </div>

                {/* Fallback URL Input */}
                <div className="mt-3">
                   <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <ImageIcon className="h-4 w-4 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        value={formData.image}
                        onChange={(e) => handleInputChange("image", e.target.value)}
                        className="w-full pl-10 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        placeholder="Hoặc nhập đường dẫn URL ảnh tại đây..."
                      />
                   </div>
                </div>
              </div>

              {/* Alt Text */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Văn bản thay thế (Alt Text)
                </label>
                <div className="relative">
                   <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Type className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={formData.altText}
                    onChange={(e) => handleInputChange("altText", e.target.value)}
                    className="w-full pl-10 px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    placeholder="Mô tả ngắn gọn về banner (tốt cho SEO)"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Product Select */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Liên kết sản phẩm *
                  </label>
                  <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Link className="h-4 w-4 text-gray-400" />
                    </div>
                    <select
                      required
                      value={formData.productId}
                      onChange={(e) => handleInputChange("productId", e.target.value)}
                      className="w-full pl-10 px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white appearance-none"
                    >
                      <option value="">-- Chọn sản phẩm --</option>
                      {loadingProducts ? (
                        <option disabled>Đang tải...</option>
                      ) : (
                        products.map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.name} (ID: {p.id})
                          </option>
                        ))
                      )}
                    </select>
                  </div>
                </div>

                {/* Display Order */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Thứ tự hiển thị
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Hash className="h-4 w-4 text-gray-400" />
                    </div>
                    <input
                      type="number"
                      min="0"
                      value={formData.displayOrder}
                      onChange={(e) => handleInputChange("displayOrder", e.target.value)}
                      className="w-full pl-10 px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                  </div>
                </div>
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Trạng thái
                </label>
                <div className="flex items-center space-x-4">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="isActive"
                      checked={formData.isActive === true}
                      onChange={() => handleInputChange("isActive", true)}
                      className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Hiển thị</span>
                  </label>
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="isActive"
                      checked={formData.isActive === false}
                      onChange={() => handleInputChange("isActive", false)}
                      className="w-4 h-4 text-red-600 focus:ring-red-500 border-gray-300"
                    />
                    <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Ẩn</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-8 flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                Hủy bỏ
              </button>
              <button
                type="submit"
                disabled={isUploading}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-sm font-medium flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isUploading ? (
                  <>
                     <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Đang xử lý...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    {mode === "create" ? "Tạo Banner" : "Lưu thay đổi"}
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}