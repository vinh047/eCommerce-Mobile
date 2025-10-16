/**
 * Lớp lỗi tùy chỉnh để xử lý các response không thành công từ API.
 * Chứa status code và payload lỗi từ server.
 */
export class HttpError extends Error {
  constructor({ status, payload, message }) {
    super(message || `HTTP Error: ${status}`);
    this.status = status;
    this.payload = payload;
    this.name = "HttpError";
  }
}
