
import React, { useState, useEffect } from 'react';
import { UserProfile, AIAnalysisResult } from './types';
import Header from './components/Header';
import UserProfileForm from './components/UserProfileForm';
import StockDashboard from './components/StockDashboard';
import { TrendingUp, ShieldAlert } from 'lucide-react';

const App: React.FC = () => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<AIAnalysisResult | null>(null);

  const handleProfileSubmit = (profile: UserProfile) => {
    setUserProfile(profile);
    setLoading(true);
  };

  const resetProfile = () => {
    setUserProfile(null);
    setAnalysis(null);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header onLogoClick={resetProfile} />
      
      <main className="flex-grow container mx-auto px-4 py-8 max-w-6xl">
        {!userProfile ? (
          <div className="flex flex-col items-center justify-center space-y-12 py-12">
            <div className="text-center space-y-4 max-w-2xl">
              <h1 className="text-5xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-blue-500">
                AI-Powered Wealth Intelligence
              </h1>
              <p className="text-gray-400 text-lg">
                ArthaAI uses the power of Gemini 3 to analyze your financial footprint and recommend the best-performing Indian stocks tailored just for you.
              </p>
            </div>
            
            <div className="w-full max-w-xl">
              <UserProfileForm onSubmit={handleProfileSubmit} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl text-sm">
              <div className="glass p-6 rounded-2xl flex flex-col items-center text-center space-y-3">
                <div className="p-3 bg-emerald-500/20 rounded-full text-emerald-400">
                  <TrendingUp size={24} />
                </div>
                <h3 className="font-semibold">Nifty 50 Insights</h3>
                <p className="text-gray-500">Real-time analysis of blue-chip stocks using Google Search grounding.</p>
              </div>
              <div className="glass p-6 rounded-2xl flex flex-col items-center text-center space-y-3">
                <div className="p-3 bg-blue-500/20 rounded-full text-blue-400">
                  <ShieldAlert size={24} />
                </div>
                <h3 className="font-semibold">Risk Mapping</h3>
                <p className="text-gray-500">Sophisticated risk profiling based on your age, income, and life goals.</p>
              </div>
              <div className="glass p-6 rounded-2xl flex flex-col items-center text-center space-y-3 text-emerald-300">
                <div className="p-3 bg-purple-500/20 rounded-full text-purple-400">
                  <TrendingUp size={24} />
                </div>
                <h3 className="font-semibold">Portfolio Growth</h3>
                <p className="text-gray-500">Long-term wealth generation strategies backed by LLM reasoning.</p>
              </div>
            </div>
          </div>
        ) : (
          <StockDashboard 
            profile={userProfile} 
            loading={loading}
            setLoading={setLoading}
            analysis={analysis}
            setAnalysis={setAnalysis}
          />
        )}
      </main>

      <footer className="py-8 text-center text-gray-600 border-t border-slate-800 text-xs">
        <p>© 2024 ArthaAI. Not a SEBI registered entity. For educational purposes only. Investing in stocks involves market risk.</p>
      </footer>
    </div>
  );
};

export default App;
