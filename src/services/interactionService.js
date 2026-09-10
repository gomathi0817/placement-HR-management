import api from './api';

export const interactionService = {
  getAll: async () => {
    const response = await api.get('/interactions');
    return response.data;
  },

  getByHR: async (hrId) => {
    const response = await api.get(`/hr/${hrId}/interactions`);
    return response.data;
  },

  create: async (interactionData) => {
    const response = await api.post('/interactions', interactionData);
    return response.data;
  }
};
