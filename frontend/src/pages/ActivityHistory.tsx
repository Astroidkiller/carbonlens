import { Calendar, Filter } from 'lucide-react';

const mockActivities = [
  { id: 1, text: "Drove to work (15 miles)", category: "Transport", carbon: "+6.0 kg CO₂", date: "Today, 8:30 AM", impact: "high" },
  { id: 2, text: "Vegetarian Lunch", category: "Food", carbon: "+0.5 kg CO₂", date: "Yesterday, 1:00 PM", impact: "low" },
  { id: 3, text: "Ran AC for 4 hours", category: "Energy", carbon: "+4.2 kg CO₂", date: "Yesterday, 6:00 PM", impact: "medium" },
  { id: 4, text: "Bought a new t-shirt", category: "Shopping", carbon: "+2.1 kg CO₂", date: "Mon, 4:15 PM", impact: "medium" },
  { id: 5, text: "Flight from NY to LA", category: "Transport", carbon: "+350.0 kg CO₂", date: "Last Week", impact: "high" },
];

export default function ActivityHistory() {
  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-semibold text-white mb-2">Activity History</h2>
          <p className="text-dark-muted">Review your past entries and their carbon impact.</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 glass-panel hover:bg-white/5 rounded-lg text-sm font-medium text-white transition-colors">
            <Filter className="w-4 h-4" /> Filter
          </button>
          <button className="flex items-center gap-2 px-4 py-2 glass-panel hover:bg-white/5 rounded-lg text-sm font-medium text-white transition-colors">
            <Calendar className="w-4 h-4" /> This Month
          </button>
        </div>
      </div>

      <div className="glass-panel rounded-2xl overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-white/5 text-sm font-medium text-dark-muted">
              <th className="py-4 px-6 font-medium">Activity</th>
              <th className="py-4 px-6 font-medium">Category</th>
              <th className="py-4 px-6 font-medium">Date</th>
              <th className="py-4 px-6 font-medium text-right">Impact</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {mockActivities.map((activity) => (
              <tr key={activity.id} className="hover:bg-white/[0.02] transition-colors">
                <td className="py-4 px-6">
                  <p className="text-sm font-medium text-white">{activity.text}</p>
                </td>
                <td className="py-4 px-6">
                  <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-white/5 text-dark-muted uppercase tracking-wider">
                    {activity.category}
                  </span>
                </td>
                <td className="py-4 px-6">
                  <p className="text-sm text-dark-muted">{activity.date}</p>
                </td>
                <td className="py-4 px-6 text-right">
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium ${
                    activity.impact === 'high' ? 'bg-red-500/10 text-red-400' :
                    activity.impact === 'medium' ? 'bg-yellow-500/10 text-yellow-500' :
                    'bg-brand-500/10 text-brand-400'
                  }`}>
                    {activity.carbon}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
