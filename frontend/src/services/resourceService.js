import api from "./api";

export const resourceService = {
  getAll: async (params = {}) => {
    const response = await api.get("/resources", { params });
    return response.data;
  },

  create: async (data) => {
    const response = await api.post("/resources", data);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/resources/${id}`);
    return response.data;
  },

  update: async (id, data) => {
    const response = await api.patch(`/resources/${id}`, data);
    return response.data;
  },
};
