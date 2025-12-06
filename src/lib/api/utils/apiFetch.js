import { HttpError } from "../errors/http-errors";

/**
 * Một hàm fetch wrapper tùy chỉnh cho Next.js App Router.
 * - Tự động thêm base URL của API.
 * - Tự động chuyển body thành chuỗi JSON (trừ khi là FormData).
 * - Ném ra lỗi HttpError tùy chỉnh cho các response không thành công.
 * - Hỗ trợ các tùy chọn cache/revalidation của Next.js.
 *
 * @param {string} path Đường dẫn API (ví dụ: '/products').
 * @param {RequestInit & { next?: import('next/server').NextFetchRequestConfig }} [options={}] Các tùy chọn fetch chuẩn + tùy chọn của Next.js.
 * @returns {Promise<any>} Dữ liệu trả về từ API.
 */
export async function apiFetch(path, options = {}) {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "";
  const apiUrl = `${baseUrl}${path}`;

  const isFormData = options.body instanceof FormData;

  // Nếu KHÔNG phải FormData thì mới đặt Content-Type: application/json
  const defaultHeaders = isFormData
    ? {}
    : {
        "Content-Type": "application/json",
      };

  const mergedOptions = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...(options.headers || {}),
    },
  };

  // Nếu body là object/string → xử lý khác với FormData
  if (mergedOptions.body && !isFormData && typeof mergedOptions.body !== "string") {
    mergedOptions.body = JSON.stringify(mergedOptions.body);
  }
  // Nếu là FormData thì giữ nguyên, KHÔNG đụng vào mergedOptions.body

  try {
    const response = await fetch(apiUrl, mergedOptions);

    if (!response.ok) {
      const errorPayload = await response.json().catch(() => ({
        message:
          "An unexpected error occurred and the error response could not be parsed.",
      }));

      const detailedErrorMessage =
        errorPayload.error ||
        errorPayload.message ||
        `API request to ${path} failed with status ${response.status}`;

      throw new HttpError({
        status: response.status,
        payload: errorPayload,
        message: detailedErrorMessage,
      });
    }

    if (response.status === 204) {
      return {};
    }

    return await response.json();
  } catch (error) {
    console.error("Custom Fetch Error:", error);

    if (error instanceof HttpError) {
      throw error;
    }
    throw new Error("A network error or an unexpected issue occurred.");
  }
}
