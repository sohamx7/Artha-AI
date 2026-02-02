
import React, { useEffect, useState } from 'react';
import { UserProfile, AIAnalysisResult, ChatMessage, StockRecommendation } from '../types';
import { geminiService } from '../services/geminiService';
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { ExternalLink, Bot, Send, RefreshCw, Loader2, Sparkles, TrendingUp, ChevronDown, ChevronUp, Newspaper, Activity, Search } from 'lucide-react';

interface StockCardProps {
  stock: StockRecommendation;
}

const StockCard: React.FC<StockCardProps> = ({ stock }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const getGoogleFinanceUrl = (symbol: string) => {
    // Clean symbol of any extra whitespace
    const cleanSymbol = symbol.trim().toUpperCase();
    // If it already has an exchange prefix like NSE: or BSE:
    if (cleanSymbol.includes(':')) {
      const parts = cleanSymbol.split(':');
      // Google Finance often uses SYMBOL:EXCHANGE format
      return `https://www.google.com/finance/quote/${parts[0]}:${parts[1]}`;
    }
    // Default to NSE for Indian stocks if no exchange is provided
    return `https://www.google.com/finance/quote/${cleanSymbol}:NSE`;
  };

  return (
    <div className={`glass p-6 rounded-2xl group transition-all duration-300 border ${isExpanded ? 'border-emerald-500/50 shadow-emerald-500/10' : 'border-white/10 hover:border-emerald-500/30'}`}>
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="text-emerald-400 font-mono font-bold text-lg">{stock.symbol}</span>
            {stock.targetPrice && (
              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full font-bold">
                Target: {stock.targetPrice}
              </span>
            )}
          </div>
          <h4 className="text-white font-semibold text-lg">{stock.companyName}</h4>
          <span className="text-xs text-gray-500 uppercase tracking-wider">{stock.sector}</span>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-emerald-400">{stock.confidence}%</div>
          <div className="text-[10px] text-gray-500 uppercase font-medium">Confidence</div>
        </div>
      </div>
      
      <p className={`text-sm text-gray-400 mb-4 transition-all duration-300 ${isExpanded ? '' : 'line-clamp-2'}`}>
        {stock.reason}
      </p>

      {isExpanded && (
        <div className="mt-6 pt-6 border-t border-slate-800 space-y-6 animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h5 className="text-xs font-bold text-gray-500 uppercase flex items-center gap-2">
                <Newspaper size={14} className="text-blue-400" /> Recent Highlights
              </h5>
              <ul className="space-y-2">
                {stock.newsHighlights?.map((news, idx) => (
                  <li key={idx} className="text-xs text-gray-300 flex gap-2">
                    <span className="text-emerald-500">•</span>
                    {news}
                  </li>
                )) || <li className="text-xs text-gray-500 italic">No recent snippets found.</li>}
              </ul>
            </div>
            <div className="space-y-3">
              <h5 className="text-xs font-bold text-gray-500 uppercase flex items-center gap-2">
                <Activity size={14} className="text-purple-400" /> Key Metrics
              </h5>
              <div className="grid grid-cols-1 gap-2">
                {stock.keyMetrics?.map((metric, idx) => (
                  <div key={idx} className="bg-slate-900/50 p-2 rounded-lg text-[11px] text-gray-300 border border-slate-800 flex justify-between">
                    {metric}
                  </div>
                )) || <div className="text-xs text-gray-500 italic">Metrics unavailable.</div>}
              </div>
            </div>
          </div>
          
          <a 
            href={getGoogleFinanceUrl(stock.symbol)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full py-3 bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 border border-blue-500/30 rounded-xl text-xs font-bold transition-all group"
          >
            <Search size={14} className="group-hover:scale-110 transition-transform" />
            Verify Live Price on Google Finance
          </a>
        </div>
      )}

      <button 
        onClick={() => setIsExpanded(!isExpanded)}
        className={`w-full mt-4 flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-bold transition-all ${
          isExpanded 
            ? 'bg-slate-800 text-gray-300 hover:bg-slate-700' 
            : 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20'
        }`}
      >
        {isExpanded ? (
          <>Collapse <ChevronUp size={14} /></>
        ) : (
          <>View Details <ChevronDown size={14} /></>
        )}
      </button>
    </div>
  );
};

interface StockDashboardProps {
  profile: UserProfile;
  loading: boolean;
  setLoading: (l: boolean) => void;
  analysis: AIAnalysisResult | null;
  setAnalysis: (a: AIAnalysisResult | null) => void;
}

const StockDashboard: React.FC<StockDashboardProps> = ({ profile, loading, setLoading, analysis, setAnalysis }) => {
  const [chatMessage, setChatMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [chatLoading, setChatLoading] = useState(false);

  useEffect(() => {
    if (loading && !analysis) {
      const fetchAnalysis = async () => {
        try {
          const result = await geminiService.analyzeProfileAndRecommend(profile);
          setAnalysis(result);
        } catch (error) {
          console.error("Failed to fetch analysis", error);
        } finally {
          setLoading(false);
        }
      };
      fetchAnalysis();
    }
  }, [loading, analysis, profile, setAnalysis, setLoading]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatMessage.trim()) return;

    const userMsg: ChatMessage = { role: 'user', text: chatMessage };
    setChatHistory(prev => [...prev, userMsg]);
    setChatMessage('');
    setChatLoading(true);

    try {
      const response = await geminiService.chat(chatMessage, chatHistory, profile);
      setChatHistory(prev => [...prev, { role: 'model', text: response || 'No response' }]);
    } catch (error) {
      setChatHistory(prev => [...prev, { role: 'model', text: "Sorry, I encountered an error. Please try again." }]);
    } finally {
      setChatLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center space-y-4">
        <Loader2 className="animate-spin text-emerald-500" size={48} />
        <div className="text-center">
          <h2 className="text-2xl font-bold">ArthaAI is crunching market data...</h2>
          <p className="text-gray-500">Evaluating Nifty 50 trends & risk parameters</p>
        </div>
      </div>
    );
  }

  if (!analysis) return null;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="glass p-8 rounded-3xl border-l-4 border-l-emerald-500 shadow-xl shadow-emerald-500/5">
        <div className="flex items-center gap-3 mb-4">
          <Sparkles className="text-emerald-400" />
          <h2 className="text-2xl font-bold">Personalized Investment Strategy</h2>
        </div>
        <p className="text-gray-300 leading-relaxed mb-6">
          {analysis.riskProfile}
        </p>
        <div className="flex flex-wrap gap-4">
          <div className="bg-slate-800/50 px-4 py-2 rounded-full border border-slate-700 text-sm">
            <span className="text-gray-500 mr-2">Target Market:</span> Indian Equity
          </div>
          <div className="bg-slate-800/50 px-4 py-2 rounded-full border border-slate-700 text-sm">
            <span className="text-gray-500 mr-2">Focus:</span> {profile.riskTolerance} Risk
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <TrendingUp className="text-blue-400" size={20} />
              Recommended Stocks
            </h3>
            <span className="text-[10px] text-gray-500 bg-slate-800 px-2 py-1 rounded uppercase font-bold tracking-tighter">Powered by Google Search</span>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {analysis.recommendations.map((stock, i) => (
              <StockCard key={`${stock.symbol}-${i}`} stock={stock} />
            ))}
          </div>

          <div className="glass p-8 rounded-3xl">
            <h3 className="text-lg font-bold mb-6">Confidence Distribution</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analysis.recommendations}>
                  <XAxis dataKey="symbol" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                  <Tooltip 
                    cursor={{fill: 'rgba(255,255,255,0.05)'}}
                    contentStyle={{ backgroundColor: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff' }}
                    itemStyle={{ color: '#10b981' }}
                  />
                  <Bar dataKey="confidence" radius={[6, 6, 0, 0]}>
                    {analysis.recommendations.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#10b981' : '#3b82f6'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="glass rounded-3xl flex flex-col h-[600px] overflow-hidden shadow-2xl">
            <div className="p-4 border-b border-slate-800 bg-slate-800/20 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bot className="text-emerald-400" size={20} />
                <span className="font-bold text-sm">Artha AI Advisor</span>
              </div>
              <div className="flex gap-1">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
              </div>
            </div>
            
            <div className="flex-grow overflow-y-auto p-4 space-y-4 scrollbar-hide">
              {chatHistory.length === 0 && (
                <div className="text-center py-8 px-4 space-y-4">
                  <div className="w-12 h-12 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto text-emerald-500">
                    <Sparkles size={24} />
                  </div>
                  <p className="text-gray-500 text-xs leading-relaxed">
                    I'm ready to discuss your financial goals. Ask about sector trends, 
                    tax implications, or specific NSE/BSE stocks.
                  </p>
                </div>
              )}
              {chatHistory.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] px-4 py-2 rounded-2xl text-sm leading-relaxed ${
                    msg.role === 'user' 
                      ? 'bg-emerald-500 text-white rounded-tr-none' 
                      : 'bg-slate-800 text-gray-200 border border-slate-700 rounded-tl-none'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              {chatLoading && (
                <div className="flex justify-start">
                  <div className="bg-slate-800 border border-slate-700 px-4 py-2 rounded-2xl rounded-tl-none flex gap-1 items-center">
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce"></span>
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                  </div>
                </div>
              )}
            </div>

            <form onSubmit={handleSendMessage} className="p-4 border-t border-slate-800 bg-slate-900/50">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Ask about your portfolio..."
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 pr-10 outline-none focus:ring-2 focus:ring-emerald-500 transition-all text-sm"
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  disabled={chatLoading}
                />
                <button 
                  type="submit"
                  className="absolute right-3 top-3.5 text-emerald-500 disabled:text-gray-600 transition-colors"
                  disabled={chatLoading || !chatMessage.trim()}
                >
                  <Send size={18} />
                </button>
              </div>
            </form>
          </div>

          <div className="glass p-6 rounded-3xl border border-slate-800 shadow-lg">
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-4 flex items-center gap-2">
              <RefreshCw size={12} className="animate-spin-slow" /> Grounded In Research
            </h3>
            <div className="space-y-2">
              {analysis.sources.slice(0, 5).map((source, i) => (
                <a 
                  key={i} 
                  href={source.uri} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-2.5 rounded-xl hover:bg-emerald-500/5 border border-transparent hover:border-emerald-500/20 transition-all group"
                >
                  <span className="text-xs text-gray-400 truncate pr-4 group-hover:text-emerald-300 transition-colors">{source.title}</span>
                  <ExternalLink size={12} className="text-gray-600 shrink-0 group-hover:text-emerald-500 transition-colors" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StockDashboard;
