
import React, { useState } from 'react';
import { UserProfile } from '../types';
import { User, Briefcase, IndianRupee, Activity } from 'lucide-react';

interface UserProfileFormProps {
  onSubmit: (profile: UserProfile) => void;
}

const UserProfileForm: React.FC<UserProfileFormProps> = ({ onSubmit }) => {
  const [formData, setFormData] = useState<UserProfile>({
    name: '',
    age: 25,
    occupation: '',
    monthlyIncome: 50000,
    riskTolerance: 'Medium',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="glass p-8 rounded-3xl shadow-2xl space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-400 flex items-center gap-2">
            <User size={16} /> Full Name
          </label>
          <input
            required
            type="text"
            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
            placeholder="John Doe"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-400 flex items-center gap-2">
            <Activity size={16} /> Age
          </label>
          <input
            required
            type="number"
            min="18"
            max="100"
            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
            value={formData.age}
            onChange={(e) => setFormData({ ...formData, age: parseInt(e.target.value) })}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-400 flex items-center gap-2">
            <Briefcase size={16} /> Occupation
          </label>
          <input
            required
            type="text"
            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
            placeholder="Software Engineer"
            value={formData.occupation}
            onChange={(e) => setFormData({ ...formData, occupation: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-400 flex items-center gap-2">
            <IndianRupee size={16} /> Monthly Income (₹)
          </label>
          <input
            required
            type="number"
            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
            value={formData.monthlyIncome}
            onChange={(e) => setFormData({ ...formData, monthlyIncome: parseInt(e.target.value) })}
          />
        </div>
      </div>

      <div className="space-y-3">
        <label className="text-sm font-medium text-gray-400">Risk Appetite</label>
        <div className="grid grid-cols-3 gap-4">
          {(['Low', 'Medium', 'High'] as const).map((risk) => (
            <button
              key={risk}
              type="button"
              onClick={() => setFormData({ ...formData, riskTolerance: risk })}
              className={`py-3 rounded-xl border transition-all ${
                formData.riskTolerance === risk
                  ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400'
                  : 'bg-slate-900 border-slate-700 text-gray-500 hover:border-slate-500'
              }`}
            >
              {risk}
            </button>
          ))}
        </div>
      </div>

      <button
        type="submit"
        className="w-full py-4 bg-gradient-to-r from-emerald-500 to-blue-600 hover:from-emerald-400 hover:to-blue-500 text-white font-bold rounded-xl transition-all shadow-xl shadow-emerald-500/10 transform active:scale-[0.98]"
      >
        Analyze & Suggest Stocks
      </button>
    </form>
  );
};

export default UserProfileForm;
