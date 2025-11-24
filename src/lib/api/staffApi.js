import { apiFetch } from "./utils/apiFetch";

const staffApi = {
  getStaffs: (params) =>
    apiFetch(`/staffs?${new URLSearchParams(params)}`, {
      method: "GET",
      cache: "no-store",
    }),

  getStaffById: (id) =>
    apiFetch(`/staffs/${id}`, {
      method: "GET",
      cache: "no-store",
    }),

  createStaff: (data) =>
    apiFetch("/staffs", {
      method: "POST",
      body: data,
    }),

  updateStaff: (id, data) =>
    apiFetch(`/staffs/${id}`, {
      method: "PUT",
      body: data,
    }),

  deleteStaff: (id) =>
    apiFetch(`/staffs/${id}`, {
      method: "DELETE",
    }),

  bulkAction: (ids, action) =>
    apiFetch(`/staffs/bulk`, {
      method: "POST",
      body: { ids, action },
    }),
};

export default staffApi;
