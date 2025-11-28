// src/lib/utils/shipping.ts

export type AddressSnapshot = {
  line?: string | null;
  ward?: string | null;
  district?: string | null;
  province?: string | null;
};

export const ORIGIN_ADDRESS =
  "273 An Dương Vương, Phường Chợ Quán, Thành phố Hồ Chí Minh, Việt Nam";

// 2 triệu miễn phí ship
const FREE_THRESHOLD = 2_000_000_000;

// geocode từ OpenStreetMap
async function geocode(address: string) {
  const url = `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(address)}`;
  const res = await fetch(url);
  if (!res.ok) return null;

  const data = await res.json();
  if (!data.length) return null;

  return {
    lat: parseFloat(data[0].lat),
    lon: parseFloat(data[0].lon),
  };
}

// gọi OSRM để tính khoảng cách
async function getDistanceMeters(from: any, to: any) {
  const url = `https://router.project-osrm.org/route/v2/driving/${from.lon},${from.lat};${to.lon},${to.lat}?overview=false`;
  const res = await fetch(url);
  if (!res.ok) return null;

  const data = await res.json();
  if (!data.routes?.length) return null;

  return data.routes[0].distance; // mét
}

function buildFullAddress(a?: AddressSnapshot | null): string | null {
  if (!a) return null;
  return [a.line, a.ward, a.district, a.province].filter(Boolean).join(", ");
}

/**
 * ⭐ GIỮ NGUYÊN TÊN → calcShippingSimple
 * ⭐ input/output không đổi
 * ⭐ BÊN TRONG DÙNG DISTANCE API
 */
export async function calcShippingSimple(
  subtotal: number,
  address?: AddressSnapshot | null
): Promise<number> {
  try {
    // miễn phí ship
    if (subtotal >= FREE_THRESHOLD) return 0;

    const destAddress = buildFullAddress(address);
    if (!destAddress) return 25000; // fallback

    // geocode
    const [originGeo, destGeo] = await Promise.all([
      geocode(ORIGIN_ADDRESS),
      geocode(destAddress),
    ]);

    if (!originGeo || !destGeo) return 25000; // fallback

    // distance
    const meters = await getDistanceMeters(originGeo, destGeo);
    console.log("meters: ", meters)
    if (!meters) return 25000; // fallback

    const km = meters / 1000;

    // ⭐ thực sự tính giá theo km
    if (km <= 3) return 20000;
    if (km <= 7) return 30000;

    return 30000 + Math.ceil(km - 7) * 3000; // mỗi km thêm 3k
  } catch (err) {
    console.error("calcShippingSimple distance error:", err);
    return 25000;
  }
}
