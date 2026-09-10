import api from './api';

export const followUpService = {
  getAll: async (filter = '') => {
    const params = {};
    if (filter) params.filter = filter.toLowerCase();
    const response = await api.get('/follow-ups', { params });
    return response.data;
  },

  create: async (followUpData) => {
    const response = await api.post('/follow-ups', followUpData);
    return response.data;
  },

  markCompleted: async (id) => {
    const response = await api.patch(`/follow-ups/${id}/complete`);
    return response.data;
  },

  reschedule: async (id, date, time) => {
    const response = await api.patch(`/follow-ups/${id}/reschedule`, { date, time });
    return response.data;
  },

  updateStatus: async (id, status) => {
    const response = await api.patch(`/follow-ups/${id}/status`, { status });
    return response.data;
  }
};
