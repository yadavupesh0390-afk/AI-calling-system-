import React, { useEffect, useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

const DashboardPage = () => {
  const [stats, setStats] = useState({
    totalLeads: 0,
    answeredCalls: 0,
    interestedLeads: 0,
    callbackLater: 0,
    notInterested: 0,
    conversionRate: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get("/analytics/dashboard");

        setStats({
          totalLeads: response.data.statistics?.totalLeads || 0,
          answeredCalls: response.data.statistics?.answeredCalls || 0,
          interestedLeads: response.data.statistics?.interestedLeads || 0,
          callbackLater: response.data.statistics?.callbackLater || 0,
          notInterested: response.data.statistics?.notInterested || 0,
          conversionRate: response.data.statistics?.conversionRate || 0,
        });
      } catch (error) {
        console.error(error);
        setError("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();

    // 🔥 AUTO REFRESH (LIVE SaaS FEEL)
    const interval = setInterval(fetchStats, 10000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black text-white">
        <div className="animate-pulse text-lg">Loading Dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-purple-950 to-black text-white p-6">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold">📊 AI Calling SaaS</h1>
          <p className="text-gray-400">
            Live Lead & Campaign Monitoring System
          </p>
        </div>

        <button
          onClick={() => navigate("/create-campaign")}
          className="bg-cyan-400 text-black px-5 py-2 rounded-xl font-bold hover:scale-105 transition"
        >
          + Create Campaign
        </button>
      </div>

      {/* ERROR */}
      {error && (
        <div className="bg-red-500/20 border border-red-500 text-red-200 p-3 rounded-lg mb-4">
          {error}
        </div>
      )}

      {/* STATS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">

        <Card title="Total Leads" value={stats.totalLeads} />
        <Card title="Answered Calls" value={stats.answeredCalls} />
        <Card title="Interested Leads" value={stats.interestedLeads} />
        <Card title="Conversion Rate" value={`${stats.conversionRate}%`} />

      </div>
        <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
  <h2 className="text-xl font-bold mb-4">⚡ Campaign Controls</h2>

  <button
    onClick={() => campaignService.startCampaign("YOUR_CAMPAIGN_ID")}
    className="w-full bg-green-500 p-3 rounded-xl font-bold mb-3 hover:scale-105 transition"
  >
    ▶ Start Calling
  </button>

  <button
    onClick={() => campaignService.stopCampaign("YOUR_CAMPAIGN_ID")}
    className="w-full bg-red-500 p-3 rounded-xl font-bold mb-3 hover:scale-105 transition"
  >
    ⛔ Stop Calling
  </button>

  <button
    onClick={() => navigate("/campaigns")}
    className="w-full bg-purple-500 p-3 rounded-xl font-bold hover:scale-105 transition"
  >
    📁 View Campaigns
  </button>
</div>
      {/* DETAILS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* LEAD STATUS */}
        <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
          <h2 className="text-xl font-bold mb-4">📞 Lead Breakdown</h2>

          <StatusRow label="Interested" value={stats.interestedLeads} color="text-green-400" />
          <StatusRow label="Callback Later" value={stats.callbackLater} color="text-yellow-400" />
          <StatusRow label="Not Interested" value={stats.notInterested} color="text-red-400" />
        </div>

        {/* QUICK ACTIONS */}
        <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
          <h2 className="text-xl font-bold mb-4">⚡ Quick Actions</h2>

          <button
            onClick={() => navigate("/campaigns")}
            className="w-full bg-green-500 p-3 rounded-xl font-bold mb-3 hover:scale-105 transition"
          >
            ▶ Manage Campaigns
          </button>

          <button
            onClick={() => navigate("/leads")}
            className="w-full bg-purple-500 p-3 rounded-xl font-bold mb-3 hover:scale-105 transition"
          >
            📁 View Leads
          </button>

          <button className="w-full bg-pink-500 p-3 rounded-xl font-bold hover:scale-105 transition">
            📊 Download Report
          </button>
        </div>

      </div>
    </div>
  );
};

/* CARD */
const Card = ({ title, value }) => (
  <div className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:scale-105 transition">
    <p className="text-gray-400 text-sm">{title}</p>
    <p className="text-3xl font-bold mt-2">{value || 0}</p>
  </div>
);

/* STATUS ROW */
const StatusRow = ({ label, value, color }) => (
  <div className="flex justify-between py-2 border-b border-white/10">
    <span>{label}</span>
    <span className={`font-bold ${color}`}>{value || 0}</span>
  </div>
);

export default DashboardPage;
