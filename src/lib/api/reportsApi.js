import { apiFetch } from "./utils/apiFetch";

const reportsApi = {
  getReports: (range = "7days") =>
    apiFetch(`/reports?range=${range}`, {
      method: "GET",
      cache: "no-store",
    }),
};

export default reportsApi;