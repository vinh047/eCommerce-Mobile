import axiosClient from "./axiosClient";

const usersApi = {
  getUsers: (params) => axiosClient.get("/users", { params }),

  getUserById: (id) => axiosClient.get(`/users/${id}`),

  createUser: (data) => axiosClient.post("/users", data),

  updateUser: (id, data) => axiosClient.put(`/users/${id}`, data),

  deleteUser: (id) => axiosClient.delete(`/users/${id}`),

  bulkAction: (ids, action) => axiosClient.post(`/users/bulk`, { ids, action }),
};

export default usersApi;
