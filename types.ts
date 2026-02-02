
export interface UserProfile {
  name: string;
  age: number;
  occupation: string;
  monthlyIncome: number;
  riskTolerance: 'Low' | 'Medium' | 'High';
}

export interface StockRecommendation {
  symbol: string;
  companyName: string;
  reason: string;
  sector: string;
  targetPrice?: string;
  confidence: number;
  newsHighlights?: string[];
  keyMetrics?: string[];
}

export interface GroundingSource {
  title: string;
  uri: string;
}

export interface AIAnalysisResult {
  recommendations: StockRecommendation[];
  marketSummary: string;
  sources: GroundingSource[];
  riskProfile: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}
