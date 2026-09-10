import api from './api';

export const companyService = {
  getAll: async () => {
    const response = await api.get('/companies');
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/companies/${id}`);
    return response.data;
  },

  create: async (companyData) => {
    const response = await api.post('/companies', companyData);
    return response.data;
  }
};
