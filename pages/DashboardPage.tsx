
import React, { useEffect, useState, useMemo } from 'react';
import { getJournalEntries } from '../services/api';
import type { JournalEntry } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Loader2, AlertTriangle } from 'lucide-react';

const DashboardPage: React.FC = () => {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEntries = async () => {
      try {
        const data = await getJournalEntries();
        setEntries(data);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch journal entries.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchEntries();
  }, []);

  const emotionFrequencyData = useMemo(() => {
    const emotionCount: { [key: string]: number } = {};
    entries.forEach(entry => {
      entry.emotions?.forEach(emotion => {
        emotionCount[emotion] = (emotionCount[emotion] || 0) + 1;
      });
    });
    return Object.entries(emotionCount)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);
  }, [entries]);

  const sentimentOverTimeData = useMemo(() => {
    return entries
      .filter(entry => entry.sentiment)
      .map(entry => {
        let sentimentScore = 0;
        if (entry.sentiment === 'Positive') sentimentScore = 1;
        if (entry.sentiment === 'Negative') sentimentScore = -1;
        return {
          date: new Date(entry.created_at).toLocaleDateString(),
          sentimentScore,
        };
      })
      .reverse(); // Show oldest first
  }, [entries]);

  const recentEntries = useMemo(() => {
    return entries.slice(0, 5);
  }, [entries]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading dashboard...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-destructive">
        <AlertTriangle className="h-12 w-12 mb-4" />
        <h2 className="text-xl font-semibold">Error Loading Data</h2>
        <p>{error}</p>
      </div>
    );
  }

  if (entries.length === 0) {
    return (
        <div className="flex flex-col items-center justify-center h-full text-center">
            <h2 className="text-2xl font-bold mb-2">Your Dashboard is Empty</h2>
            <p className="text-muted-foreground">Start by writing a journal entry to see your emotional insights here.</p>
        </div>
    );
  }

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-foreground">Your Emotional Dashboard</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-card p-6 rounded-lg shadow-sm border border-border">
          <h2 className="text-xl font-semibold mb-4">Emotion Frequency</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={emotionFrequencyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" />
              <YAxis stroke="hsl(var(--muted-foreground))" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--background))',
                  borderColor: 'hsl(var(--border))',
                }}
              />
              <Legend />
              <Bar dataKey="count" fill="hsl(var(--primary))" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-card p-6 rounded-lg shadow-sm border border-border">
          <h2 className="text-xl font-semibold mb-4">Sentiment Over Time</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={sentimentOverTimeData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" />
              <YAxis domain={[-1, 1]} ticks={[-1, 0, 1]} tickFormatter={(val) => {
                  if (val === 1) return 'Positive';
                  if (val === 0) return 'Neutral';
                  if (val === -1) return 'Negative';
                  return '';
              }} stroke="hsl(var(--muted-foreground))" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--background))',
                  borderColor: 'hsl(var(--border))',
                }}
              />
              <Legend />
              <Line type="monotone" dataKey="sentimentScore" name="Sentiment" stroke="hsl(var(--primary))" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-card p-6 rounded-lg shadow-sm border border-border">
        <h2 className="text-xl font-semibold mb-4">Recent Entries Overview</h2>
        <div className="space-y-4">
          {recentEntries.map(entry => (
            <div key={entry.id} className="p-4 bg-background rounded-md border border-input">
              <p className="text-muted-foreground truncate">{entry.content}</p>
              <div className="flex justify-between items-center mt-2 text-sm">
                <span className="text-muted-foreground">{new Date(entry.created_at).toLocaleString()}</span>
                <div className="flex items-center gap-2">
                  <span className={`font-semibold ${
                    entry.sentiment === 'Positive' ? 'text-green-500' : 
                    entry.sentiment === 'Negative' ? 'text-red-500' : 'text-yellow-500'
                  }`}>{entry.sentiment}</span>
                  <div className="flex flex-wrap gap-1">
                    {entry.emotions?.slice(0, 2).map((emo, i) => (
                      <span key={i} className="px-2 py-0.5 bg-secondary text-secondary-foreground text-xs rounded-full">{emo}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
