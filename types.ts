
export interface User {
  id: number;
  username: string;
  email: string;
}

export interface JournalEntry {
  id: number;
  user: number;
  content: string;
  created_at: string;
  sentiment: 'Positive' | 'Negative' | 'Neutral' | null;
  emotions: string[] | null;
}

export interface AnalysisResult {
  sentiment: 'Positive' | 'Negative' | 'Neutral';
  emotions: string[];
  feedback: string;
  affirmation: string;
}
