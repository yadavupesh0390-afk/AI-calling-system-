import React, { useEffect, useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

const DashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get("/analytics/dashboard");
        setStats(response.data.statistics || {});
      } catch (error) {
        console.error("Failed to fetch statistics:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-700 text-white">
        <div className="text-xl animate-pulse">Loading Dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-700 text-white p-6">

      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold">📊 AI Calling Dashboard</h1>
          <p className="text-purple-200">Welcome back, manage your campaigns</p>
        </div>

        <button
          onClick={() => navigate("/create-campaign")}
          className="bg-cyan-400 text-black px-5 py-2 rounded-xl font-bold hover:scale-105 transition"
        >
          + Create Campaign
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">

        <Card title="Total Leads" value={stats?.totalLeads} />
        <Card title="Answered Calls" value={stats?.answeredCalls} />
        <Card title="Interested Leads" value={stats?.interestedLeads} />
        <Card title="Conversion Rate" value={`${stats?.conversionRate || 0}%`} />

      </div>

      {/* Lead Status Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-xl">
          <h2 className="text-xl font-bold mb-4">📞 Lead Status</h2>

          <div className="space-y-4">

            <StatusRow label="Interested" value={stats?.interestedLeads} color="text-green-300" />
            <StatusRow label="Callback Later" value={stats?.callbackLater} color="text-yellow-300" />
            <StatusRow label="Not Interested" value={stats?.notInterested} color="text-red-300" />

          </div>
        </div>

        {/* Right Panel */}
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-xl">
          <h2 className="text-xl font-bold mb-4">⚡ Quick Actions</h2>

          <div className="space-y-3">

            <button
              onClick={() => navigate("/create-campaign")}
              className="w-full bg-cyan-400 text-black p-3 rounded-xl font-bold hover:scale-105 transition"
            >
              Create New Campaign
            </button>

            <button className="w-full bg-purple-500 p-3 rounded-xl font-bold hover:scale-105 transition">
              View Leads
            </button>

            <button className="w-full bg-pink-500 p-3 rounded-xl font-bold hover:scale-105 transition">
              Analytics Report
            </button>

          </div>
        </div>

      </div>

    </div>
  );
};

/* ---------------- CARD ---------------- */
const Card = ({ title, value }) => {
  return (
    <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 shadow-lg hover:scale-105 transition">
      <p className="text-sm text-purple-200">{title}</p>
      <p className="text-3xl font-bold mt-2">{value || 0}</p>
    </div>
  );
};

/* ---------------- STATUS ROW ---------------- */
const StatusRow = ({ label, value, color }) => {
  return (
    <div className="flex justify-between border-b border-white/10 pb-2">
      <span className="text-white">{label}</span>
      <span className={`font-bold ${color}`}>{value || 0}</span>
    </div>
  );
};

export default DashboardPage;
