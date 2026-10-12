import { useEffect, useState } from 'react';
import { FiFolder, FiMessageSquare, FiBriefcase, FiFileText } from 'react-icons/fi';
import StatCard from '../components/ui/StatCard';
import PageTitle from '../components/ui/PageTitle';
import { dashboardService } from '../services/dashboardService';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dashboardService
      .stats()
      .then((res) => setStats(res.data))
      .catch((err) => toast.error(err.message || 'Failed to load dashboard stats'))
      .finally(() => setLoading(false));
  }, []);

  const cards = [
    { title: 'Projects', value: stats?.projectsCount ?? '—', icon: FiFolder, color: 'blue' },
    { title: 'Testimonials', value: stats?.testimonialsCount ?? '—', icon: FiMessageSquare, color: 'purple' },
    { title: 'Last Work Items', value: stats?.lastWorkCount ?? '—', icon: FiBriefcase, color: 'amber' },
    { title: 'Resume Status', value: stats?.resumeUploaded ? 'Uploaded' : 'Not Uploaded', icon: FiFileText, color: 'green' },
  ];

  return (
    <div>
      <PageTitle title="Dashboard" subtitle="Overview of your portfolio content" />

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="card p-5 h-24 skeleton" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {cards.map((c) => (
            <StatCard key={c.title} {...c} />
          ))}
        </div>
      )}

      <div className="card p-6 mt-6">
        <h3 className="font-semibold mb-2">Quick Tips</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Use the sidebar to manage your Resume, Projects, Testimonials, and Last Work entries.
          All changes sync directly with your backend API.
        </p>
      </div>
    </div>
  );
};

export default Dashboard;
