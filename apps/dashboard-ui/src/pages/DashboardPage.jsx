import React, { useEffect, useState } from 'react';
import api from '../services/api';

const DashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get(
          '/analytics/dashboard'
        );

        setStats(response.data.statistics || {});

      } catch (error) {
        console.error(
          'Failed to fetch statistics:',
          error
        );

      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl text-gray-600">
          Loading...
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 bg-gray-50 min-h-screen">

      <h1 className="text-4xl font-bold text-gray-800 mb-8">
        Dashboard
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">

        <StatCard
          title="Total Leads"
          value={stats?.totalLeads}
          color="blue"
        />

        <StatCard
          title="Answered Calls"
          value={stats?.answeredCalls}
          color="green"
        />

        <StatCard
          title="Interested"
          value={stats?.interestedLeads}
          color="purple"
        />

        <StatCard
          title="Conversion Rate"
          value={stats?.conversionRate}
          color="orange"
        />

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        <div className="bg-white rounded-lg shadow p-6">

          <h2 className="text-xl font-bold text-gray-800 mb-4">
            Lead Status
          </h2>

          <div className="space-y-4">

            <div className="flex justify-between">
              <span>Interested</span>

              <span className="font-bold">
                {stats?.interestedLeads || 0}
              </span>
            </div>

            <div className="flex justify-between">
              <span>Callback Later</span>

              <span className="font-bold">
                {stats?.callbackLater || 0}
              </span>
            </div>

            <div className="flex justify-between">
              <span>Not Interested</span>

              <span className="font-bold">
                {stats?.notInterested || 0}
              </span>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({
  title,
  value,
  color
}) => {

  const colorMap = {
    blue: 'bg-blue-100 text-blue-800',
    green: 'bg-green-100 text-green-800',
    purple: 'bg-purple-100 text-purple-800',
    orange: 'bg-orange-100 text-orange-800'
  };

  return (
    <div className={`rounded-lg p-6 ${colorMap[color]}`}>
      <p className="text-sm font-medium">
        {title}
      </p>

      <p className="text-3xl font-bold mt-2">
        {value || 0}
      </p>
    </div>
  );
};

export default DashboardPage;
