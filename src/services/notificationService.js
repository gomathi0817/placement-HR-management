import api from './api';

export const notificationService = {
  getAll: async () => {
    const response = await api.get('/notifications');
    return response.data;
  }
};
