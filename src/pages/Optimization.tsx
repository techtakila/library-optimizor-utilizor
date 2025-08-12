import React, { useState } from 'react';
import { mockSuggestions } from '../data/mockData';
import { 
  Lightbulb, 
  TrendingUp, 
  DollarSign, 
  Clock, 
  AlertTriangle,
  CheckCircle,
  Filter,
  Download,
  Target,
  RefreshCw,
  ArrowRight
} from 'lucide-react';

export const Optimization: React.FC = () => {
  const [suggestions] = useState(mockSuggestions);
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all');

  const filteredSuggestions = suggestions.filter(suggestion => 
    (filterPriority === 'all' || suggestion.priority === filterPriority) &&
    (filterType === 'all' || suggestion.type === filterType)
  );

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'acquisition': return Target;
      case 'reallocation': return RefreshCw;
      case 'removal': return AlertTriangle;
      case 'relocation': return ArrowRight;
      default: return Lightbulb;
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'text-green-600';
      case 'medium': return 'text-orange-600';
      case 'hard': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const totalPotentialSavings = suggestions.reduce((sum, s) => sum + (s.estimatedCost || 0), 0);
  const highPrioritySuggestions = suggestions.filter(s => s.priority === 'high').length;

  const exportSuggestions = () => {
    const data = filteredSuggestions.map(s => ({
      ...s,
      priorityLevel: s.priority,
      suggestionType: s.type
    }));
    
    const csvData = data.map(item => 
      Object.values(item).map(value => 
        typeof value === 'string' ? `"${value}"` : value
      ).join(',')
    );
    
    const headers = Object.keys(data[0]).join(',');
    const csvContent = [headers, ...csvData].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'optimization_suggestions.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">AI Optimization Suggestions</h1>
        <p className="text-gray-600">
          Intelligent recommendations to improve library utilization and efficiency
        </p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-blue-500">
              <Lightbulb className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Suggestions</p>
              <p className="text-2xl font-bold text-gray-900">{suggestions.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-red-500">
              <AlertTriangle className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">High Priority</p>
              <p className="text-2xl font-bold text-gray-900">{highPrioritySuggestions}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-green-500">
              <DollarSign className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Est. Investment</p>
              <p className="text-2xl font-bold text-gray-900">${totalPotentialSavings}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-orange-500">
              <TrendingUp className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Avg. Improvement</p>
              <p className="text-2xl font-bold text-gray-900">18%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <select
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value)}
                className="pl-10 pr-8 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white"
              >
                <option value="all">All Priorities</option>
                <option value="high">High Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="low">Low Priority</option>
              </select>
            </div>
            
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="pl-10 pr-8 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white"
              >
                <option value="all">All Types</option>
                <option value="acquisition">Acquisition</option>
                <option value="reallocation">Reallocation</option>
                <option value="removal">Removal</option>
                <option value="relocation">Relocation</option>
              </select>
            </div>
          </div>
          
          <button
            onClick={exportSuggestions}
            className="flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors duration-200"
          >
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </button>
        </div>
      </div>

      {/* Suggestions Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredSuggestions.map((suggestion) => {
          const TypeIcon = getTypeIcon(suggestion.type);
          
          return (
            <div
              key={suggestion.id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center">
                  <div className="p-2 rounded-lg bg-blue-100">
                    <TypeIcon className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="ml-3">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getPriorityColor(suggestion.priority)}`}>
                      {suggestion.priority.charAt(0).toUpperCase() + suggestion.priority.slice(1)} Priority
                    </span>
                  </div>
                </div>
                <span className="text-sm text-gray-500 capitalize">
                  {suggestion.type.replace(/([A-Z])/g, ' $1').trim()}
                </span>
              </div>

              <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {suggestion.title}
                </h3>
                <p className="text-sm text-gray-600 mb-3">
                  {suggestion.description}
                </p>
                <div className="flex items-center text-sm text-blue-600 bg-blue-50 rounded-md p-2">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  <span className="font-medium">Expected: {suggestion.expectedImprovement}</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <div className="flex items-center">
                    <DollarSign className="h-4 w-4 mr-1" />
                    <span>${suggestion.estimatedCost}</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    <span className={getDifficultyColor(suggestion.implementationDifficulty)}>
                      {suggestion.implementationDifficulty}
                    </span>
                  </div>
                </div>
                <button className="flex items-center text-sm text-blue-600 hover:text-blue-700 font-medium">
                  Implement
                  <ArrowRight className="h-4 w-4 ml-1" />
                </button>
              </div>

              <div className="mt-3 pt-3 border-t border-gray-100">
                <div className="flex items-center text-xs text-gray-500">
                  <span className="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-600 rounded-md">
                    Section: {suggestion.section}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredSuggestions.length === 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <Lightbulb className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Suggestions Found</h3>
          <p className="text-gray-600">
            Try adjusting your filters to see more optimization suggestions.
          </p>
        </div>
      )}
    </div>
  );
};