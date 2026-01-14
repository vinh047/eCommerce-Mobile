import { apiFetch } from "./utils/apiFetch";

const dashboardApi = {
  getStats: () =>
    apiFetch(`/dashboard`, {
      method: "GET",
      next: { revalidate: 600 },
    }),
};

export default dashboardApi;
