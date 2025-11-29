// src/lib/utils/shipping.ts
export type AddressSnapshot = {
  province?: string | null;
  district?: string | null;
  ward?: string | null;
};

export const ORIGIN_PROVINCE = "Hồ Chí Minh";
export const ORIGIN_ADDRESS =
  "273 An Dương Vương, Phường Chợ Quán, Thành phố Hồ Chí Minh 700000, Việt Nam";

// Ngưỡng miễn phí (2.000.000 VND)
const FREE_THRESHOLD = 2_000_000_000; // VND

// Fee defaults (tùy chỉnh)
const baseLocal = 25000; // mặc định cho quận thường
const basePremium = 35000; // quận xa hơn hoặc phí cao hơn
const baseRemote = 45000; // quận/ huyện xa hơn nữa
const baseFar = 80000; // tỉnh khác

// Bản đồ phí theo quận (chuẩn hóa tên quận => phí)
// Bạn có thể mở rộng hoặc điều chỉnh giá cho từng quận theo thực tế vận hành.
const districtRates: Record<string, number> = {
  // Trung tâm (giữ baseLocal)
  "quận 1": baseLocal,
  "quận 3": baseLocal,
  "quận 4": baseLocal,
  "quận 5": baseLocal,
  "quận 10": baseLocal,
  "quận 11": baseLocal,
  "quận phú nhuận": baseLocal,
  "quận bình thạnh": baseLocal,
  "quận 6": baseLocal,
  "quận 8": baseLocal,

  // Quận có thể tính phí cao hơn (ví dụ quận 7, gò vấp)
  "quận 7": basePremium,
  "quận gò vấp": basePremium,
  "quận tân bình": basePremium,
  "quận tân phú": basePremium,
  "quận thủ đức": basePremium,
  "quận bình tân": basePremium,

  // Huyện / vùng xa trong HCMC
  "huyện bình chánh": baseRemote,
  "huyện hóc môn": baseRemote,
  "huyện củ chi": baseRemote,
  "huyện nhà bè": baseRemote,
  "huyện cần giờ": baseRemote,

  // Bạn có thể thêm mapping chi tiết hơn ở đây
};

// Simple neighbor map (giữ để mở rộng nếu cần)
const neighborMap: Record<string, string[]> = {
  "Hồ Chí Minh": ["Bình Dương", "Bình Phước", "Long An", "Tiền Giang"],
  "Hà Nội": ["Hưng Yên", "Hà Nam", "Hải Dương", "Bắc Ninh"],
};

function normalizeText(s?: string | null) {
  if (!s) return "";
  return String(s).trim().toLowerCase();
}

/**
 * Kiểm tra địa chỉ có nằm trong vùng phục vụ (Hồ Chí Minh) hay không.
 * Trả về true nếu province là "Hồ Chí Minh".
 */
export function isDeliverableTo(address?: AddressSnapshot | null): boolean {
  const prov = normalizeText(address?.province);
  return prov === normalizeText(ORIGIN_PROVINCE);
}

/**
 * Lấy phí vận chuyển theo quận (nếu có mapping).
 * Trả về:
 *  - số >= 0: phí vận chuyển (VND)
 *  - -1: không giao (ngoài vùng phục vụ)
 *
 * Luồng:
 * 1) Nếu address undefined => trả -1 (không xác định)
 * 2) Nếu province !== ORIGIN_PROVINCE => trả -1 (không giao)
 * 3) Nếu subtotal >= FREE_THRESHOLD => trả 0
 * 4) Nếu district có mapping => trả phí tương ứng
 * 5) Nếu district không có mapping => trả baseLocal (mặc định)
 */
export function calcShippingSimple(
  subtotal: number,
  address?: AddressSnapshot | null
): number {
  if (!address) return -1;

  const prov = normalizeText(address.province);
  if (prov !== normalizeText(ORIGIN_PROVINCE)) {
    // Nếu muốn hỗ trợ tỉnh lân cận, có thể kiểm tra neighborMap ở đây
    return -1;
  }

  if (subtotal >= FREE_THRESHOLD) return 0;

  const district = normalizeText(address.district);

  if (district) {
    // tìm mapping chính xác
    if (districtRates.hasOwnProperty(district)) {
      return districtRates[district];
    }

    // thử loại bỏ tiền tố "quận"/"huyện"/"tp." để so khớp
    const cleaned = district.replace(/^quận\s*/i, "").replace(/^huyện\s*/i, "").trim();
    if (cleaned && districtRates.hasOwnProperty(`quận ${cleaned}`)) {
      return districtRates[`quận ${cleaned}`];
    }
    if (cleaned && districtRates.hasOwnProperty(`huyện ${cleaned}`)) {
      return districtRates[`huyện ${cleaned}`];
    }

    // thử so khớp một số biến thể phổ biến (ví dụ "thủ đức" vs "quận thủ đức")
    for (const key of Object.keys(districtRates)) {
      if (key.includes(cleaned) || cleaned.includes(key.replace(/^quận\s*/i, "").replace(/^huyện\s*/i, ""))) {
        return districtRates[key];
      }
    }
  }

  // fallback: nếu không có mapping cụ thể, trả phí mặc định trong HCMC
  return baseLocal;
}

/**
 * Hữu ích để cập nhật hoặc mở rộng phí theo quận runtime (nếu cần).
 * Ví dụ: updateDistrictRate("Quận 7", 30000)
 */
export function updateDistrictRate(districtName: string, fee: number) {
  const key = normalizeText(districtName);
  if (!key) return;
  (districtRates as Record<string, number>)[key] = fee;
}
