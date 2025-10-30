import axios from "axios";
import queryString from "query-string";

const axiosClient = axios.create({
  baseURL: "", // gọi trực tiếp bằng "/api/..."
  headers: { "Content-Type": "application/json" },
  paramsSerializer: (params) => queryString.stringify(params),
});

axiosClient.interceptors.request.use(
  async (config) => {
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("accessToken")
        : null;
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) console.error("Server error:", error.response.data);
    else console.error("Network error:", error.message);
    return Promise.reject(error);
  }
);

export default axiosClient;
