import { apiFetch } from "./utils/apiFetch";

const reportsApi = {
  getReports: (range = "7days") =>
    apiFetch(`/reports?range=${range}`, {
      method: "GET",
      cache: "force-cache",
    }),
};

export default reportsApi;