import React, { useState } from 'react';

import { activityService } from '../services/activityService';
import { Bot, Sparkles, CheckCircle2, AlertCircle, X, ArrowRight } from 'lucide-react';
import { LiquidCard } from '../components/ui/LiquidCard';
import { LiquidButton } from '../components/ui/LiquidButton';

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
          <h1 className="text-3xl font-bold text-slate-800 drop-shadow-sm tracking-tight flex items-center">
            <Sparkles className="h-6 w-6 text-indigo-500 mr-2" />
            AI Carbon Diary
          </h1>
          <p className="text-slate-500 mt-1 tracking-tight">
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

      <LiquidCard className="overflow-hidden">
        <div className="p-6">
          <label className="block text-sm font-semibold text-slate-700 mb-2 tracking-tight">
            How was your day?
          </label>
          <textarea
            rows={5}
            placeholder="e.g., Today I drove 15 km to college, ate a chicken biryani for lunch, used about 5 kWh of electricity, and bought a T-shirt."
            className="block w-full rounded-[24px] shadow-inner sm:text-sm p-4 resize-none bg-white/40 text-slate-800 border-0 outline-none ring-0 focus:ring-2 focus:ring-indigo-300 placeholder:text-slate-400 transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)]"
            value={text}
            onChange={(e) => setText(e.target.value)}
            disabled={loading || saving}
          />
          <div className="mt-4 flex justify-end">
            <LiquidButton
              onClick={handleExtract}
              disabled={loading || !text.trim()}
              gradient={true}
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
            </LiquidButton>
          </div>
        </div>
      </LiquidCard>

      {previewData && previewData.activities.length > 0 && (
        <LiquidCard className="overflow-hidden animate-in slide-in-from-bottom-4 duration-500">
          <div className="p-4 border-b border-black/5 flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-800 tracking-tight">Extracted Activities</h3>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-white/60 text-indigo-700 border border-white/80 shadow-sm">
              {previewData.extraction_method === 'gemini' ? 'Gemini AI' : 'Rule Engine'}
            </span>
          </div>
          
          <div className="p-4 space-y-3">
            {previewData.activities.map((item: any, idx: number) => (
              <div key={idx} className="bg-white/40 p-4 rounded-[24px] shadow-sm border border-white/80 flex items-start justify-between group hover:bg-white/60 hover:shadow-md transition-all duration-300">
                <div>
                  <div className="flex items-center">
                    <span className="font-semibold text-slate-800 capitalize tracking-tight">{item.activity.activity_type}</span>
                    <span className="mx-2 text-slate-300">•</span>
                    <span className="text-sm font-medium text-slate-600">{item.activity.quantity} {item.activity.unit}</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1 capitalize font-medium">Category: {item.activity.category}</p>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <span className="block font-bold text-rose-500">{item.carbon_emission.toFixed(2)} kg CO₂</span>
                    <span className="block text-[10px] text-slate-400 font-medium">{item.calculation_explanation}</span>
                  </div>
                  <button 
                    onClick={() => removeActivityFromPreview(idx)}
                    className="text-slate-400 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Remove item"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 bg-black/5 border-t border-black/5 flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-slate-500">Total estimated impact</p>
              <p className="text-xl font-black text-rose-500">{previewData.total_carbon_emission} kg CO₂</p>
            </div>
            <LiquidButton
              onClick={handleConfirm}
              disabled={saving || previewData.activities.length === 0}
              gradient={true}
            >
              {saving ? 'Saving...' : 'Confirm & Save'}
              {!saving && <ArrowRight className="ml-2 h-4 w-4" />}
            </LiquidButton>
          </div>
        </LiquidCard>
      )}
      
      {previewData && previewData.activities.length === 0 && (
        <div className="bg-amber-50 p-6 rounded-xl border border-amber-100 text-center text-amber-800">
          We couldn't extract any valid carbon-emitting activities from your entry. Try being more specific about transport, food, or electricity usage.
        </div>
      )}
    </div>
  );
};
