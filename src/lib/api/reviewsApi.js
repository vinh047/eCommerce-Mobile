import { apiFetch } from "./utils/apiFetch";

const reviewsApi = {
  getReviews: (params) =>
    apiFetch(`/reviews?${new URLSearchParams(params)}`, {
      method: "GET",
      cache: "force-cache",
    }),

  getReviewById: (id) =>
    apiFetch(`/reviews/${id}`, {
      method: "GET",
      cache: "force-cache",
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
