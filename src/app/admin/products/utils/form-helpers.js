/**
 * 1. API -> FORM
 * Chuyển đổi dữ liệu từ Backend (Prisma Nested Object) sang cấu trúc phẳng cho React Hook Form
 */
export const transformProductToFormValues = (product) => {
  if (!product) return null;

  // --- A. Xử lý Product Specs (Thông số kỹ thuật chung) ---
  // Mảng [{ specKey: 'ram', numericValue: 12 }] -> Object { ram: 12 }
  const specs = {};
  product.productSpecValues?.forEach((item) => {
    // Ưu tiên lấy giá trị không null theo thứ tự: String -> Number -> Boolean
    specs[item.specKey] =
      item.stringValue ??
      item.numericValue ??
      (item.booleanValue === true
        ? "true"
        : item.booleanValue === false
        ? "false"
        : "");
  });

  // --- B. Xử lý Variants (Phiên bản) ---
  const variants =
    product.variants?.map((v) => {
      // 1. Gom tất cả thuộc tính (Cứng + Động) vào object `attributes`
      const attributes = {};

      // 1a. Lấy thuộc tính cứng (Cột có sẵn trong bảng Variant)
      if (v.color) {
        attributes.color = v.color;
      }

      // 1b. Lấy thuộc tính động (Từ bảng VariantSpecValue)
      v.variantSpecValues?.forEach((item) => {
        attributes[item.specKey] =
          item.stringValue ?? item.numericValue ?? item.booleanValue;
      });

      // 2. Xử lý ảnh của Variant
      // API trả về: MediaVariant[] -> Media -> url
      // Form cần: Mảng string url ["url1.jpg", "url2.jpg"]
      const assignedImages =
        v.MediaVariant?.map((mv) => mv.Media?.url).filter(Boolean) || [];

      return {
        id: v.id, // Giữ ID để biết là update
        price: Number(v.price),
        compareAtPrice: Number(v.compareAtPrice || 0),
        stock: Number(v.stock),
        sku: v.sku || "",
        attributes: attributes, // Form sẽ hiển thị: { color: "Đỏ", ram: "8GB" }
        assignedImages: assignedImages,
      };
    }) || [];

  // --- C. Xử lý Global Images (Tab Media) ---
  // Vì schema của bạn chỉ link Media qua Variant, ta cần gom tất cả ảnh từ các variants
  // để hiển thị vào "Kho ảnh" (Tab Media) nếu chưa có bảng ProductMedia riêng.
  // Dùng Map để lọc trùng ảnh theo URL.
  const uniqueImagesMap = new Map();

  product.variants?.forEach((v) => {
    v.MediaVariant?.forEach((mv) => {
      if (mv.Media?.url && !uniqueImagesMap.has(mv.Media.url)) {
        uniqueImagesMap.set(mv.Media.url, {
          url: mv.Media.url,
          isPrimary: mv.Media.isPrimary || false,
          id: mv.Media.id, // Lưu ID thực nếu cần xóa
        });
      }
    });
  });

  const images = Array.from(uniqueImagesMap.values());

  // --- D. Trả về Object Form hoàn chỉnh ---
  return {
    ...product,
    categoryId: product.categoryId, // Đảm bảo ID khớp
    brandId: product.brandId,
    specs: specs, // Object phẳng cho Tab Specs
    variants: variants, // Array variants đã clean
    images: images, // Array ảnh cho Tab Media
  };
};

/**
 * 2. FORM -> API
 * Chuyển đổi dữ liệu từ React Hook Form về cấu trúc Backend mong muốn để lưu DB
 */
export const transformFormToAPIValues = (formData) => {
  // --- A. Reverse Specs (Object -> Array) ---
  // { ram: 12 } -> [{ specKey: 'ram', value: 12 }]
  const productSpecValues = Object.entries(formData.specs || {}).map(
    ([key, value]) => ({
      specKey: key,
      value: value, // Gửi raw value, Backend tự parse dựa trên Template
    })
  );

  // --- B. Reverse Variants ---
  const variants = formData.variants?.map((v) => {
    // 1. Tách 'color' (cột cứng) ra khỏi các thuộc tính động khác
    // Lưu ý: Key 'color' phải khớp với code bạn quy định trong SpecTemplate
    const { color, ...otherAttributes } = v.attributes || {};

    // 2. Chuyển các thuộc tính còn lại thành VariantSpecValue
    const variantSpecValues = Object.entries(otherAttributes).map(
      ([key, value]) => ({
        specKey: key,
        value: String(value), // Ép kiểu string cho an toàn, hoặc giữ nguyên tùy logic BE
      })
    );

    return {
      id: v.id, // null nếu là tạo mới

      // Map cột cứng
      color: color || "Default",

      // Các cột số
      price: Number(v.price),
      compareAtPrice: Number(v.compareAtPrice),
      stock: Number(v.stock),
      sku: v.sku,

      // Relation data
      variantSpecValues: variantSpecValues,

      // Gửi danh sách URL ảnh đã gán, Backend sẽ tìm ID Media tương ứng để insert MediaVariant
      assignedImageUrls: v.assignedImages || [],
    };
  });

  // --- C. Trả về Payload ---
  return {
    ...formData,
    // Loại bỏ các field thừa không cần gửi lên (như attributes của variants cũ)
    productSpecValues,
    variants,
  };
};
