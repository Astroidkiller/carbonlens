import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { activityService } from '../services/activityService';
import type { Activity } from '../types';
import { PlusCircle, Search, Trash2, AlertCircle } from 'lucide-react';

export const Activities: React.FC = () => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState('');

  const fetchActivities = async () => {
    try {
      const data = await activityService.getAll();
      setActivities(data);
    } catch (err) {
      setError('Failed to load activities.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this activity?')) return;
    try {
      await activityService.delete(id);
      setActivities(activities.filter(a => a.id !== id));
    } catch (err) {
      alert('Failed to delete activity');
    }
  };

  const filteredActivities = activities.filter(a => {
    const matchesSearch = (a.activity_type.toLowerCase().includes(search.toLowerCase()) || 
                          (a.description || '').toLowerCase().includes(search.toLowerCase()));
    const matchesCategory = filterCategory ? a.category === filterCategory : true;
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-900">Your Activities</h1>
        <Link
          to="/add-activity"
          className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-emerald-600 hover:bg-emerald-700"
        >
          <PlusCircle className="mr-2 h-5 w-5" />
          Log Activity
        </Link>
      </div>

      {error && (
        <div className="bg-red-50 p-4 rounded-md flex items-center text-red-600">
          <AlertCircle className="mr-3 h-5 w-5" />
          {error}
        </div>
      )}

      <div className="bg-white shadow-sm border border-gray-100 rounded-xl overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search activities..."
              className="pl-10 w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm border p-2"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <select
            className="rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm border p-2 bg-white"
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
          >
            <option value="">All Categories</option>
            <option value="transport">Transport</option>
            <option value="food">Food</option>
            <option value="electricity">Electricity</option>
            <option value="shopping">Shopping</option>
            <option value="waste">Waste</option>
          </select>
        </div>

        {filteredActivities.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            <p>No activities found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Emissions</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredActivities.map((act) => (
                  <tr key={act.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(act.activity_date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-gray-900 capitalize">{act.activity_type}</span>
                        <span className="text-xs text-gray-500 capitalize">{act.category}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {act.quantity} {act.unit}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        {act.carbon_emission} kg CO₂
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button 
                        onClick={() => handleDelete(act.id)}
                        className="text-red-600 hover:text-red-900 transition-colors"
                        title="Delete Activity"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
