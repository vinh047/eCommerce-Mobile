import { HttpError } from "../errors/http-errors";
/**
 * Một hàm fetch wrapper tùy chỉnh cho Next.js App Router.
 * - Tự động thêm base URL của API.
 * - Tự động chuyển body thành chuỗi JSON.
 * - Ném ra lỗi HttpError tùy chỉnh cho các response không thành công.
 * - Hỗ trợ các tùy chọn cache/revalidation của Next.js.
 *
 * @param {string} path Đường dẫn API (ví dụ: '/products').
 * @param {RequestInit & { next?: import('next/server').NextFetchRequestConfig }} [options={}] Các tùy chọn fetch chuẩn + tùy chọn của Next.js.
 * @returns {Promise<any>} Dữ liệu trả về từ API.
 */
export async function apiFetch(path, options = {}) {
  // Lấy base URL từ biến môi trường, hoặc dùng đường dẫn tương đối
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "";
  const apiUrl = `${baseUrl}${path}`;

  const defaultHeaders = {
    "Content-Type": "application/json",
  };

  const mergedOptions = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };

  // Tự động stringify body nếu nó là một object
  if (mergedOptions.body && typeof mergedOptions.body !== "string") {
    mergedOptions.body = JSON.stringify(mergedOptions.body);
  }

  try {
    const response = await fetch(apiUrl, mergedOptions);

    // Nếu response không thành công, ném ra lỗi HttpError
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

    // Xử lý trường hợp không có nội dung trả về (ví dụ: 204 No Content)
    if (response.status === 204) {
      return {};
    }

    // Nếu thành công, trả về dữ liệu JSON
    return await response.json();
  } catch (error) {
    console.error("Custom Fetch Error:", error);

    // Ném lại lỗi để có thể bắt ở nơi gọi hàm hoặc bởi Error Boundaries
    if (error instanceof HttpError) {
      throw error;
    }
    // Xử lý các lỗi mạng hoặc lỗi không mong muốn khác
    throw new Error("A network error or an unexpected issue occurred.");
  }
}
