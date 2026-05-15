import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authService = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getCurrentUser: () => api.get('/auth/me'),
  logout: () => api.post('/auth/logout')
};

export const campaignService = {
  createCampaign: (data) => api.post('/campaigns', data),
  getCampaigns: (page, limit) => api.get('/campaigns', { params: { page, limit } }),
  startCampaign: (id) => api.post(`/campaigns/${id}/start`),
  stopCampaign: (id) => api.post(`/campaigns/${id}/stop`),
  uploadPhoneNumbers: (id, file) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post(`/campaigns/${id}/upload`, formData);
  }
};

export const leadService = {
  getInterestedLeads: (campaignId) => api.get('/leads/interested', { params: { campaignId } }),
  getCallbackLaterLeads: (campaignId) => api.get('/leads/callback-later', { params: { campaignId } }),
  getNotInterestedLeads: (campaignId) => api.get('/leads/not-interested', { params: { campaignId } }),
  exportLeads: (campaignId, status) => api.get('/leads/export', { params: { campaignId, status }, responseType: 'blob' })
};

export const analyticsService = {
  getDashboardStats: () => api.get('/analytics/dashboard'),
  getDailyReport: (campaignId, days) => api.get('/analytics/daily-report', { params: { campaignId, days } }),
  getCampaignPerformance: () => api.get('/analytics/campaign-performance')
};

export default api;