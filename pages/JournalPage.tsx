
import React, { useState } from 'react';
import { createJournalEntry, analyzeEntry } from '../services/api';
import type { AnalysisResult } from '../types';
import { Sparkles, Loader2, Wand2, HeartPulse, Smile, Frown } from 'lucide-react';

const JournalPage: React.FC = () => {
  const [content, setContent] = useState('');
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSaveAndAnalyze = async () => {
    if (content.trim().length < 20) {
      setError('Please write at least 20 characters for a meaningful analysis.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setAnalysis(null);

    try {
      // Step 1: Save the journal entry
      const newEntry = await createJournalEntry({ content });
      
      // Step 2: Trigger the analysis on the newly created entry
      const analysisResult = await analyzeEntry(newEntry.id);
      
      setAnalysis(analysisResult);
      setContent(''); // Clear textarea on success
    } catch (err: any) {
      setError(err.message || 'An error occurred during analysis.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case 'Positive': return <Smile className="h-6 w-6 text-green-500" />;
      case 'Negative': return <Frown className="h-6 w-6 text-red-500" />;
      default: return <HeartPulse className="h-6 w-6 text-yellow-500" />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-foreground mb-2">My Journal</h1>
      <p className="text-muted-foreground mb-6">What's on your mind today? Write it down and get instant emotional insights.</p>

      <div className="bg-card p-6 rounded-lg shadow-sm border border-border">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Start writing here..."
          className="w-full h-64 p-4 bg-background border border-input rounded-md resize-none focus:ring-2 focus:ring-primary focus:outline-none"
          disabled={isLoading}
        />
        {error && <p className="text-sm text-destructive mt-2">{error}</p>}
        <div className="mt-4 flex justify-end">
          <button
            onClick={handleSaveAndAnalyze}
            disabled={isLoading || content.trim().length === 0}
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-primary-foreground bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <Loader2 className="animate-spin -ml-1 mr-3 h-5 w-5" />
            ) : (
              <Sparkles className="-ml-1 mr-3 h-5 w-5" />
            )}
            {isLoading ? 'Analyzing...' : 'Save & Analyze Entry'}
          </button>
        </div>
      </div>

      {analysis && (
        <div className="mt-8 bg-card p-6 rounded-lg shadow-sm border border-border animate-fade-in">
          <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center">
            <Wand2 className="h-6 w-6 mr-3 text-primary" />
            Your Analysis
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-background p-4 rounded-md">
                <h3 className="font-semibold text-lg text-foreground mb-2 flex items-center">
                    {getSentimentIcon(analysis.sentiment)}
                    <span className="ml-2">Overall Sentiment</span>
                </h3>
                <p className="text-2xl font-bold text-foreground">{analysis.sentiment}</p>
            </div>
            <div className="bg-background p-4 rounded-md">
                <h3 className="font-semibold text-lg text-foreground mb-2">Detected Emotions</h3>
                <div className="flex flex-wrap gap-2">
                    {analysis.emotions.map((emotion, index) => (
                        <span key={index} className="px-3 py-1 bg-secondary text-secondary-foreground text-sm font-medium rounded-full">
                            {emotion}
                        </span>
                    ))}
                </div>
            </div>
            <div className="bg-background p-4 rounded-md md:col-span-2">
                <h3 className="font-semibold text-lg text-foreground mb-2">Feedback</h3>
                <p className="text-muted-foreground">{analysis.feedback}</p>
            </div>
            <div className="bg-background p-4 rounded-md md:col-span-2 border-l-4 border-primary">
                <h3 className="font-semibold text-lg text-foreground mb-2">Daily Affirmation</h3>
                <p className="text-muted-foreground italic">"{analysis.affirmation}"</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JournalPage;
