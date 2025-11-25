import { apiFetch } from "./utils/apiFetch";

const dashboardApi = {
  getStats: () =>
    apiFetch(`/dashboard`, {
      method: "GET",
      cache: "no-store", 
    }),
};

export default dashboardApi;