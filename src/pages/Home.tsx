import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { mockStats, mockDistribution } from '../data/mockData';
import { 
  BookOpen, 
  BarChart3, 
  Lightbulb, 
  TrendingUp, 
  ArrowRight,
  Users,
  Target,
  Activity
} from 'lucide-react';

export const Home: React.FC = () => {
  const { user } = useAuth();
  const stats = mockStats;

  const StatCard: React.FC<{
    icon: React.ComponentType<{ className?: string }>;
    title: string;
    value: string | number;
    subtitle: string;
    color: string;
  }> = ({ icon: Icon, title, value, subtitle, color }) => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center">
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
        <div className="ml-4 flex-1">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
        </div>
      </div>
    </div>
  );

  const QuickActionCard: React.FC<{
    to: string;
    icon: React.ComponentType<{ className?: string }>;
    title: string;
    description: string;
    color: string;
  }> = ({ to, icon: Icon, title, description, color }) => (
    <Link
      to={to}
      className="group bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md hover:border-blue-200 transition-all duration-200"
    >
      <div className="flex items-start">
        <div className={`p-3 rounded-lg ${color} group-hover:scale-105 transition-transform duration-200`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
        <div className="ml-4 flex-1">
          <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-200">
            {title}
          </h3>
          <p className="text-sm text-gray-600 mt-1 mb-3">{description}</p>
          <div className="flex items-center text-sm text-blue-600 group-hover:text-blue-700">
            <span>Explore</span>
            <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform duration-200" />
          </div>
        </div>
      </div>
    </Link>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome back, {user?.username}!
        </h1>
        <p className="text-gray-600">
          Your library optimization dashboard is ready. Here's what's happening today.
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          icon={BookOpen}
          title="Total Books"
          value={stats.totalBooks.toLocaleString()}
          subtitle="Across all sections"
          color="bg-blue-500"
        />
        <StatCard
          icon={Activity}
          title="Average Utilization"
          value={`${stats.averageUtilization}%`}
          subtitle="Library efficiency"
          color="bg-green-500"
        />
        <StatCard
          icon={TrendingUp}
          title="Total Borrowings"
          value={stats.totalBorrowings.toLocaleString()}
          subtitle="This month"
          color="bg-orange-500"
        />
        <StatCard
          icon={Target}
          title="Active Sections"
          value={stats.totalSections}
          subtitle="Organized categories"
          color="bg-purple-500"
        />
      </div>

      {/* Performance Insights */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-8">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center">
            <BarChart3 className="h-5 w-5 mr-2 text-blue-600" />
            Performance Insights
          </h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-center p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="p-2 bg-green-100 rounded-lg">
                <TrendingUp className="h-5 w-5 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-green-800">Top Performing Section</p>
                <p className="text-lg font-bold text-green-900">{stats.topSection}</p>
                <p className="text-sm text-green-600">Highest utilization rate</p>
              </div>
            </div>
            <div className="flex items-center p-4 bg-orange-50 rounded-lg border border-orange-200">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Target className="h-5 w-5 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-orange-800">Needs Attention</p>
                <p className="text-lg font-bold text-orange-900">{stats.lowSection}</p>
                <p className="text-sm text-orange-600">Low utilization rate</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <QuickActionCard
            to="/distribution"
            icon={BarChart3}
            title="View Distribution Data"
            description="Analyze current book distribution across all library sections"
            color="bg-blue-500"
          />
          <QuickActionCard
            to="/optimization"
            icon={Lightbulb}
            title="AI Optimization"
            description="Get intelligent suggestions to improve library utilization"
            color="bg-green-500"
          />
          {user?.role === 'admin' && (
            <QuickActionCard
              to="/admin"
              icon={Users}
              title="Admin Panel"
              description="Manage books, users, and system settings"
              color="bg-purple-500"
            />
          )}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Recent Activity</h2>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            <div className="flex items-center text-sm">
              <div className="w-2 h-2 bg-blue-400 rounded-full mr-3"></div>
              <span className="text-gray-600">System generated 4 new optimization suggestions</span>
              <span className="ml-auto text-gray-400">2 hours ago</span>
            </div>
            <div className="flex items-center text-sm">
              <div className="w-2 h-2 bg-green-400 rounded-full mr-3"></div>
              <span className="text-gray-600">Philosophy section reached 77.8% utilization</span>
              <span className="ml-auto text-gray-400">4 hours ago</span>
            </div>
            <div className="flex items-center text-sm">
              <div className="w-2 h-2 bg-orange-400 rounded-full mr-3"></div>
              <span className="text-gray-600">Monthly report generated successfully</span>
              <span className="ml-auto text-gray-400">1 day ago</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};