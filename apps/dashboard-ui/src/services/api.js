import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

/* ---------------- CORE API ---------------- */
const api = axios.create({
  baseURL: API_BASE_URL,
});

/* ---------------- TOKEN INTERCEPTOR ---------------- */
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

/* =====================================================
   AUTH SERVICE
===================================================== */
export const authService = {
  login: (credentials) => api.post("/auth/login", credentials),

  register: (userData) => api.post("/auth/register", userData),

  getCurrentUser: () => api.get("/auth/me"),

  logout: () => api.post("/auth/logout"),
};

/* =====================================================
   CAMPAIGN SERVICE (MAIN CORE)
===================================================== */
export const campaignService = {
  // Create campaign
  createCampaign: (data) => api.post("/campaigns", data),

  // Get all campaigns (dashboard list)
  getCampaigns: (page = 1, limit = 10) =>
    api.get("/campaigns", {
      params: { page, limit },
    }),

  // Get single campaign (IMPORTANT for UI)
  getCampaign: (id) => api.get(`/campaigns/${id}`),

  // Start calling
  startCampaign: (id) => api.post(`/campaigns/${id}/start`),

  // Stop calling
  stopCampaign: (id) => api.post(`/campaigns/${id}/stop`),

  // Pause campaign (if backend supports)
  pauseCampaign: (id) => api.post(`/campaigns/${id}/pause`),

  // Resume campaign
  resumeCampaign: (id) => api.post(`/campaigns/${id}/resume`),

  // Delete campaign
  deleteCampaign: (id) => api.delete(`/campaigns/${id}`),

  // Upload leads (CSV / Excel)
  uploadPhoneNumbers: (id, file) => {
    const formData = new FormData();
    formData.append("file", file);

    return api.post(`/campaigns/${id}/upload`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
};

/* =====================================================
   LEAD SERVICE
===================================================== */
export const leadService = {
  getLeadsByCampaign: (campaignId) =>
    api.get("/leads", { params: { campaignId } }),

  getInterestedLeads: (campaignId) =>
    api.get("/leads/interested", { params: { campaignId } }),

  getCallbackLaterLeads: (campaignId) =>
    api.get("/leads/callback-later", { params: { campaignId } }),

  getNotInterestedLeads: (campaignId) =>
    api.get("/leads/not-interested", { params: { campaignId } }),

  // Export leads (CSV/PDF ready backend)
  exportLeads: (campaignId, status) =>
    api.get("/leads/export", {
      params: { campaignId, status },
      responseType: "blob",
    }),
};

/* =====================================================
   ANALYTICS SERVICE
===================================================== */
export const analyticsService = {
  // Main dashboard stats
  getDashboardStats: () => api.get("/analytics/dashboard"),

  // Daily report
  getDailyReport: (campaignId, days = 7) =>
    api.get("/analytics/daily-report", {
      params: { campaignId, days },
    }),

  // Campaign performance graph
  getCampaignPerformance: () =>
    api.get("/analytics/campaign-performance"),
};

/* =====================================================
   EXPORT DEFAULT API
===================================================== */
export default api;
