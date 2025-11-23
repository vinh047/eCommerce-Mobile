import { apiFetch } from "./utils/apiFetch";

const reviewsApi = {
  getReviews: (params) =>
    apiFetch(`/reviews?${new URLSearchParams(params)}`, {
      method: "GET",
      cache: "no-store",
    }),

  getReviewById: (id) =>
    apiFetch(`/reviews/${id}`, {
      method: "GET",
      cache: "no-store",
    }),

  updateReview: (id, data) =>
    apiFetch(`/reviews/${id}`, {
      method: "PUT",
      body: data,
    }),

  deleteReview: (id) =>
    apiFetch(`/reviews/${id}`, {
      method: "DELETE",
    }),

  bulkAction: (ids, action) =>
    apiFetch(`/reviews/bulk`, {
      method: "POST",
      body: { ids, action },
    }),
};

export default reviewsApi;
