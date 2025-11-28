export const variantBuckets = [
  // --- Cho variantSpecId; 2 (storage_variant của Điện thoại - Giả định) ---
  {
    id: 1,
    variantSpecId: 1,
    gt: null,
    lte: "128",
    label: "< 128GB",
    sortOrder: 0,
  },
  {
    id: 2,
    variantSpecId: 1,
    gt: "128",
    lte: "256",
    label: "128GB - 256GB",
    sortOrder: 1,
  },
  {
    id: 3,
    variantSpecId: 1,
    gt: "256",
    lte: "512",
    label: "256GB - 512GB",
    sortOrder: 2,
  },
  {
    id: 4,
    variantSpecId: 1,
    gt: "512",
    lte: null,
    label: "> 512GB",
    sortOrder: 3,
  },

  // --- Cho variantSpecId; 5 (storage_variant của Laptop - Giả định) ---
  {
    id: 5,
    variantSpecId: 3,
    gt: null,
    lte: "512",
    label: "< 512GB",
    sortOrder: 0,
  },
  {
    id: 6,
    variantSpecId: 3,
    gt: "512",
    lte: "1024",
    label: "512GB - 1TB",
    sortOrder: 1,
  },
  {
    id: 7,
    variantSpecId: 3,
    gt: "1024",
    lte: null,
    label: "> 1TB",
    sortOrder: 2,
  },
];
