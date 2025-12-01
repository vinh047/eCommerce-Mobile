// utils/form-helpers.js

/**
 * ------------------------------------------------------------------
 * 1. API -> FORM
 * Chuyển đổi dữ liệu từ Backend (Nested) sang cấu trúc Form (Flat/UI optimized)
 * ------------------------------------------------------------------
 */
export const transformProductToFormValues = (product) => {
  if (!product) return null;

  // --- A. Xử lý Product Specs (Tab 2) ---
  // API: [{ specKey: 'ram', numericValue: 12 }, { specKey: 'os', stringValue: 'Android' }]
  // Form (SpecsForm): { ram: 12, os: 'Android' }
  const specs = {};
  if (product.productSpecValues && Array.isArray(product.productSpecValues)) {
    product.productSpecValues.forEach((item) => {
      // Ưu tiên lấy giá trị không null.
      // Boolean convert sang string "true"/"false" để bind vào <select> dễ hơn
      specs[item.specKey] =
        item.stringValue ??
        item.numericValue ??
        (item.booleanValue === true
          ? "true"
          : item.booleanValue === false
          ? "false"
          : "");
    });
  }

  // --- B. Xử lý Variants (Tab 3) ---
  // Cần giữ nguyên cấu trúc mảng MediaVariant để component Drag & Drop hoạt động
  const variants =
    product.variants?.map((v) => {
      // Sắp xếp ảnh theo sortOrder
      const sortedMedia = (v.MediaVariant || []).sort(
        (a, b) => (a.Media?.sortOrder || 0) - (b.Media?.sortOrder || 0)
      );

      return {
        id: v.id, // ID thực để update
        productId: product.id,

        // Basic Info
        color: v.color || "",
        // sku: v.sku || "",
        isActive: v.isActive ?? true,

        // Pricing & Stock
        price: Number(v.price),
        compareAtPrice: Number(v.compareAtPrice || 0),
        stock: Number(v.stock),
        lowStockThreshold: Number(v.lowStockThreshold || 5),

        // Specs Variant (Giữ nguyên mảng object cho VariantEditor render)
        variantSpecValues: v.variantSpecValues || [],

        // Media (Giữ nguyên cấu trúc MediaVariant cho UI)
        MediaVariant: sortedMedia,
      };
    }) || [];

  // --- C. Xử lý Global Images (Tab 4 - Optional) ---
  // Gom tất cả ảnh từ variants để hiển thị vào "Kho ảnh" nếu cần
  const uniqueImagesMap = new Map();
  product.variants?.forEach((v) => {
    v.MediaVariant?.forEach((mv) => {
      if (mv.Media?.url && !uniqueImagesMap.has(mv.Media.url)) {
        uniqueImagesMap.set(mv.Media.url, {
          url: mv.Media.url,
          isPrimary: mv.Media.isPrimary || false,
          id: mv.Media.id,
        });
      }
    });
  });
  const images = Array.from(uniqueImagesMap.values());

  // --- D. Trả về Object Form hoàn chỉnh ---
  return {
    ...product,
    categoryId: product.categoryId || "",
    brandId: product.brandId || "",

    specs: specs, // Object phẳng cho Tab 2
    variants: variants, // Array object chuẩn cho Tab 3
    images: images, // Array ảnh cho Tab 4
  };
};

/**
 * ------------------------------------------------------------------
 * 2. FORM -> API
 * Chuyển đổi dữ liệu từ Form về cấu trúc Backend mong muốn để lưu DB
 * ------------------------------------------------------------------
 */
export const transformFormToAPIValues = (formData) => {
  // --- A. Xử lý Product Specs ---
  // Input: { ram: 12, os: 'Android', nfc: 'true' }
  // Output: Mảng các object chứa 3 cột giá trị (string, number, boolean)

  const specs = Object.entries(formData.specs || {}).map(([key, value]) => {
    const isNumber = typeof value === "number";
    // Kiểm tra boolean (bao gồm cả string "true"/"false" từ thẻ select)
    const isBoolean =
      value === "true" || value === "false" || typeof value === "boolean";

    return {
      specKey: key,
      label: key, // Backend có thể tự lookup label từ template, gửi tạm key
      type: isNumber ? "number" : isBoolean ? "boolean" : "string",
      unit: "", // Form hiện tại không lưu unit

      // Map giá trị vào đúng cột
      stringValue: !isNumber && !isBoolean ? String(value) : null,
      numericValue: isNumber ? value : null,
      booleanValue: isBoolean ? value === "true" || value === true : null,
    };
  });

  // --- B. Xử lý Variants ---
  const variants = formData.variants?.map((v) => {
    // 1. Xử lý Media
    // Chuyển từ cấu trúc UI (MediaVariant) sang cấu trúc API (media)
    // Backend API bạn gửi mong đợi key là "media" trong vòng lặp variants
    const processedMedia = (v.MediaVariant || []).map((item, index) => ({
      url: item.Media?.url || item.url, // Handle cả URL cũ hoặc Blob mới upload
      isPrimary: item.Media?.isPrimary || index === 0, // Mặc định cái đầu là primary nếu chưa set
      sortOrder: index, // Lưu thứ tự sắp xếp hiện tại
    }));

    // 2. Xử lý Variant Specs
    // Form lưu: [{ specKey: 'storage', value: '256GB' }]
    // API cần: logic tương tự Product Specs hoặc đơn giản hơn tùy backend
    const processedSpecs = (v.variantSpecValues || []).map((s) => ({
      specKey: s.specKey,
      label: s.label || s.specKey,
      type: s.type || "",
      unit: s.unit || "",
      stringValue: s.stringValue || null,
      numericValue: s.numericValue || null,
      booleanValue: s.booleanValue || null,
    }));

    return {
      // Logic ID: Nếu là ID tạm (do UI tạo: temp-123) hoặc null -> Gửi null để Backend tạo mới
      id: v.id && !String(v.id).startsWith("temp-") ? v.id : null,

      color: v.color,
      // sku: v.sku,
      isActive: v.isActive,

      price: Number(v.price),
      compareAtPrice: Number(v.compareAtPrice || 0),
      stock: Number(v.stock),
      lowStockThreshold: Number(v.lowStockThreshold || 5),

      // Mapping quan hệ
      variantSpecValues: processedSpecs,
      media: processedMedia, // Key này phải khớp với backend (v.media)
    };
  });

  // --- C. Trả về Payload cuối cùng ---
  return {
    name: formData.name,
    slug: formData.slug,
    description: formData.description,
    categoryId: formData.categoryId,
    brandId: formData.brandId,
    isActive: formData.isActive,

    // Specs chung (Tab 2)
    specs: specs,

    // Danh sách biến thể (Tab 3)
    variants: variants,
  };
};
