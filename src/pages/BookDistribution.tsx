import React, { useState } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from 'recharts';
import { mockDistribution, mockBooks } from '../data/mockData';
import { 
  Search, 
  Filter, 
  Download, 
  TrendingUp, 
  AlertTriangle,
  CheckCircle,
  BarChart3,
  PieChart as PieChartIcon,
  TableIcon
} from 'lucide-react';

export const BookDistribution: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSection, setSelectedSection] = useState<string>('all');
  const [viewType, setViewType] = useState<'chart' | 'table' | 'pie'>('chart');
  
  const distribution = mockDistribution;
  const books = mockBooks;

  const filteredBooks = books.filter(book => 
    (selectedSection === 'all' || book.section === selectedSection) &&
    (searchTerm === '' || 
     book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
     book.author.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const sections = ['all', ...Array.from(new Set(books.map(book => book.section)))];

  const COLORS = ['#2563EB', '#059669', '#EA580C', '#7C3AED', '#DC2626', '#0891B2'];

  const getUtilizationStatus = (rate: number) => {
    if (rate >= 70) return { color: 'text-red-600 bg-red-50', icon: AlertTriangle, label: 'High Demand' };
    if (rate >= 50) return { color: 'text-green-600 bg-green-50', icon: CheckCircle, label: 'Optimal' };
    return { color: 'text-orange-600 bg-orange-50', icon: TrendingUp, label: 'Underused' };
  };

  const exportData = (format: 'csv' | 'json') => {
    let data;
    let filename;
    
    if (format === 'csv') {
      const csvData = distribution.map(item => 
        Object.values(item).join(',')
      );
      const headers = Object.keys(distribution[0]).join(',');
      data = [headers, ...csvData].join('\n');
      filename = 'book_distribution.csv';
    } else {
      data = JSON.stringify(distribution, null, 2);
      filename = 'book_distribution.json';
    }

    const blob = new Blob([data], { type: format === 'csv' ? 'text/csv' : 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium text-gray-900">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {entry.value}
              {entry.name.includes('Rate') ? '%' : ''}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Book Distribution Analysis</h1>
        <p className="text-gray-600">
          Comprehensive view of book distribution and utilization across library sections
        </p>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex flex-col sm:flex-row gap-4 flex-1">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search books by title or author..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <select
                value={selectedSection}
                onChange={(e) => setSelectedSection(e.target.value)}
                className="pl-10 pr-8 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white"
              >
                {sections.map(section => (
                  <option key={section} value={section}>
                    {section === 'all' ? 'All Sections' : section}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="flex gap-2">
            <div className="flex border border-gray-300 rounded-md">
              <button
                onClick={() => setViewType('chart')}
                className={`p-2 ${viewType === 'chart' ? 'bg-blue-50 text-blue-600' : 'text-gray-400 hover:text-gray-600'} rounded-l-md transition-colors duration-200`}
              >
                <BarChart3 className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewType('pie')}
                className={`p-2 ${viewType === 'pie' ? 'bg-blue-50 text-blue-600' : 'text-gray-400 hover:text-gray-600'} transition-colors duration-200`}
              >
                <PieChartIcon className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewType('table')}
                className={`p-2 ${viewType === 'table' ? 'bg-blue-50 text-blue-600' : 'text-gray-400 hover:text-gray-600'} rounded-r-md transition-colors duration-200`}
              >
                <TableIcon className="h-4 w-4" />
              </button>
            </div>
            
            <div className="relative">
              <button 
                onClick={() => exportData('csv')}
                className="flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors duration-200"
              >
                <Download className="h-4 w-4 mr-2" />
                Export CSV
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Visualization */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-8">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Distribution Visualization</h2>
        </div>
        <div className="p-6">
          {viewType === 'chart' && (
            <div className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={distribution}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="section" />
                  <YAxis />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="totalBooks" fill="#2563EB" name="Total Books" />
                  <Bar dataKey="borrowedBooks" fill="#059669" name="Borrowed Books" />
                  <Bar dataKey="availableBooks" fill="#EA580C" name="Available Books" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}

          {viewType === 'pie' && (
            <div className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={distribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ section, totalBooks }) => `${section}: ${totalBooks}`}
                    outerRadius={120}
                    fill="#8884d8"
                    dataKey="totalBooks"
                  >
                    {distribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}

          {viewType === 'table' && (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Section
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total Books
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Borrowed
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Available
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Utilization
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {distribution.map((item, index) => {
                    const status = getUtilizationStatus(item.utilizationRate);
                    const StatusIcon = status.icon;
                    return (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {item.section}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {item.totalBooks}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {item.borrowedBooks}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {item.availableBooks}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {item.utilizationRate}%
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${status.color}`}>
                            <StatusIcon className="h-3 w-3 mr-1" />
                            {status.label}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Detailed Book List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            Book Details
            <span className="ml-2 text-sm text-gray-500">
              ({filteredBooks.length} books)
            </span>
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Author
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Section
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Copies
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Borrowed Count
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredBooks.map((book, index) => (
                <tr key={book.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{book.title}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {book.author}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {book.section}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {book.availableCopies} / {book.totalCopies}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {book.borrowCount}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};