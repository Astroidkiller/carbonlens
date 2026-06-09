import React, { useState } from 'react';

import { activityService } from '../services/activityService';
import { Bot, Sparkles, CheckCircle2, AlertCircle, X, ArrowRight } from 'lucide-react';
import { GlassCard } from '../components/ui/GlassCard';

export const Diary: React.FC = () => {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Preview state
  const [previewData, setPreviewData] = useState<any>(null);
  const [saving, setSaving] = useState(false);

  const handleExtract = async () => {
    if (!text.trim()) {
      setError('Please enter some text first.');
      return;
    }
    
    setError('');
    setSuccess('');
    setLoading(true);
    setPreviewData(null);

    try {
      const data = await activityService.extractDiary(text);
      setPreviewData(data);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to extract activities from the text.');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = async () => {
    if (!previewData || !previewData.activities) return;
    
    setSaving(true);
    setError('');
    
    try {
      // Just pass the valid activity dicts
      const payload = previewData.activities.map((item: any) => item.activity);
      await activityService.bulkCreate(payload);
      
      setSuccess(`Successfully saved ${previewData.activities_created} activities!`);
      setText('');
      setPreviewData(null);
    } catch (err: any) {
      setError('Failed to save activities.');
    } finally {
      setSaving(false);
    }
  };

  const removeActivityFromPreview = (index: number) => {
    const updatedActivities = [...previewData.activities];
    updatedActivities.splice(index, 1);
    
    // Recalculate totals
    const newTotal = updatedActivities.reduce((sum, item) => sum + item.carbon_emission, 0);
    
    setPreviewData({
      ...previewData,
      activities: updatedActivities,
      activities_created: updatedActivities.length,
      total_carbon_emission: newTotal.toFixed(2)
    });
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#f5f5f7] drop-shadow-md tracking-tight flex items-center">
            <Sparkles className="h-6 w-6 text-[#c0c5d7] mr-2" />
            AI Carbon Diary
          </h1>
          <p className="text-[#aab1c6] mt-1 tracking-tight">
            Describe your day naturally. Our Hybrid AI will extract your footprint.
          </p>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 p-4 rounded-md flex items-center text-red-600 border border-red-100">
          <AlertCircle className="mr-3 h-5 w-5 flex-shrink-0" />
          <p className="text-sm">{error}</p>
        </div>
      )}

      {success && (
        <div className="bg-emerald-50 p-4 rounded-md flex items-center text-emerald-700 border border-emerald-200">
          <CheckCircle2 className="mr-3 h-5 w-5 flex-shrink-0" />
          <p className="text-sm font-medium">{success}</p>
        </div>
      )}

      <GlassCard className="overflow-hidden">
        <div className="p-6">
          <label className="block text-sm font-medium text-[#f5f5f7] mb-2 tracking-tight">
            How was your day?
          </label>
          <textarea
            rows={5}
            placeholder="e.g., Today I drove 15 km to college, ate a chicken biryani for lunch, used about 5 kWh of electricity, and bought a T-shirt."
            className="block w-full rounded-2xl shadow-inner sm:text-sm p-4 resize-none bg-black/20 text-[#f5f5f7] border-0 outline-none ring-0 focus:ring-1 focus:ring-[#c0c5d7]/40 placeholder:text-[#aab1c6]/50 transition-all"
            value={text}
            onChange={(e) => setText(e.target.value)}
            disabled={loading || saving}
          />
          <div className="mt-4 flex justify-end">
            <button
              onClick={handleExtract}
              disabled={loading || !text.trim()}
              className={`inline-flex items-center px-4 py-2 border border-white/10 shadow-[0_4px_12px_rgba(0,0,0,0.2)] text-sm font-medium rounded-full text-[#f5f5f7] bg-white/10 hover:bg-white/20 focus:outline-none transition-all ${loading || !text.trim() ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Analyzing...
                </>
              ) : (
                <>
                  <Bot className="h-4 w-4 mr-2" />
                  Extract Footprint
                </>
              )}
            </button>
          </div>
        </div>
      </GlassCard>

      {previewData && previewData.activities.length > 0 && (
        <GlassCard className="overflow-hidden animate-in slide-in-from-bottom-4 duration-500">
          <div className="p-4 border-b border-white/10 flex items-center justify-between">
            <h3 className="text-lg font-bold text-[#f5f5f7] tracking-tight">Extracted Activities</h3>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-white/10 text-[#c0c5d7] border border-white/5">
              {previewData.extraction_method === 'gemini' ? 'Gemini AI' : 'Rule Engine'}
            </span>
          </div>
          
          <div className="p-4 space-y-3">
            {previewData.activities.map((item: any, idx: number) => (
              <div key={idx} className="bg-black/20 p-4 rounded-[24px] shadow-inner border border-white/5 flex items-start justify-between group">
                <div>
                  <div className="flex items-center">
                    <span className="font-semibold text-[#f5f5f7] capitalize">{item.activity.activity_type}</span>
                    <span className="mx-2 text-white/30">•</span>
                    <span className="text-sm text-[#aab1c6]">{item.activity.quantity} {item.activity.unit}</span>
                  </div>
                  <p className="text-xs text-[#aab1c6]/70 mt-1 capitalize">Category: {item.activity.category}</p>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <span className="block font-bold text-red-400">{item.carbon_emission.toFixed(2)} kg CO₂</span>
                    <span className="block text-[10px] text-[#aab1c6]/50">{item.calculation_explanation}</span>
                  </div>
                  <button 
                    onClick={() => removeActivityFromPreview(idx)}
                    className="text-[#aab1c6] hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Remove item"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 bg-black/10 border-t border-white/10 flex items-center justify-between">
            <div>
              <p className="text-sm text-[#aab1c6]">Total estimated impact</p>
              <p className="text-xl font-black text-red-400">{previewData.total_carbon_emission} kg CO₂</p>
            </div>
            <button
              onClick={handleConfirm}
              disabled={saving || previewData.activities.length === 0}
              className={`inline-flex items-center px-6 py-2 border border-white/10 shadow-[0_4px_12px_rgba(0,0,0,0.2)] text-sm font-medium rounded-full text-[#f5f5f7] bg-white/10 hover:bg-white/20 transition-all ${saving || previewData.activities.length === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {saving ? 'Saving...' : 'Confirm & Save'}
              {!saving && <ArrowRight className="ml-2 h-4 w-4" />}
            </button>
          </div>
        </GlassCard>
      )}
      
      {previewData && previewData.activities.length === 0 && (
        <div className="bg-amber-50 p-6 rounded-xl border border-amber-100 text-center text-amber-800">
          We couldn't extract any valid carbon-emitting activities from your entry. Try being more specific about transport, food, or electricity usage.
        </div>
      )}
    </div>
  );
};
