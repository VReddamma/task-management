import { useEffect, useState } from 'react';
import {
  getDashboardStats,
  type DashboardStats,
} from '../services/dashboardService';

const Dashboard = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      setError('');

      try {
        const data = await getDashboardStats();
        setStats(data);
        console.log(data);
      } catch (error) {
        console.error('Failed to fetch dashboard stats:', error);
        setError('Something went wrong');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Something Error Occurred</div>;
  if (!stats) return <div>No dashboard data available</div>;

  const dashboardstats = [
    {
      title: 'Total Tasks',
      value: stats.total_tasks,
      icon: '📋',
      color: 'blue',
    },
    {
      title: 'Completed',
      value: stats.completed_tasks,
      icon: '✅',
      color: 'green',
    },
    {
      title: 'Pending',
      value: stats.pending_tasks,
      icon: '⏳',
      color: 'yellow',
    },
    {
      title: 'In Progress',
      value: stats.in_progress_tasks,
      icon: '⚡',
      color: 'purple',
    },
    {
      title: 'In Review Tasks',
      value: stats.in_review_tasks,
      icon: '👥',
      color: 'cyan',
    },
    {
      title: 'Overdue Tasks',
      value: stats.overdue_tasks,
      icon: '⚠️',
      color: 'red',
    },
  ];

  const colorStyles: Record<string, string> = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    yellow: 'bg-yellow-50 text-yellow-600',
    purple: 'bg-purple-50 text-purple-600',
    cyan: 'bg-cyan-50 text-cyan-600',
    red: 'bg-red-50 text-red-600',
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {dashboardstats?.map((item) => (
        <div
          key={item.title}
          className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-500">{item.title}</h3>

            <div
              className={`w-12 h-12 rounded-lg flex items-center justify-center text-xl ${colorStyles[item.color]}`}
            >
              {item.icon}
            </div>
          </div>

          <h2 className="text-3xl font-bold text-gray-800 mt-4">
            {item.value ?? 0}
          </h2>

          <p className="text-sm text-gray-400 mt-2">Updated just now</p>
        </div>
      ))}
    </div>
  );
};
export default Dashboard;
