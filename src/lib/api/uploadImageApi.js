import { apiFetch } from "./utils/apiFetch";

export async function uploadImage(formData) {
  const res = await apiFetch("/upload-product-image", {
    method: "POST",
    body: formData,
  });

  console.log("UPLOAD RESPONSE:", res); // <--- THÊM DÒNG NÀY

  return res;
}
