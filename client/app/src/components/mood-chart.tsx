"use client"
import { useMemo } from "react";
import { Card } from "./ui/card";

interface MoodChartProps {
  moodEntries: Array<{
    id: string;
    moodScale: number;
    date: string;
    emotions?: string[];
  }>;
}

export default function MoodChart({ moodEntries }: MoodChartProps) {
  const chartData = useMemo(() => {
    if (!moodEntries.length) return [];

    // Sort entries by date and take last 30 days
    const sortedEntries = [...moodEntries]
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(-30);

    return sortedEntries.map(entry => ({
      date: new Date(entry.date).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
      }),
      mood: entry.moodScale,
      emotions: entry.emotions || [],
    }));
  }, [moodEntries]);

  const maxMood = 10;
  const minMood = 1;

  if (!chartData.length) {
    return (
      <div className="h-64 flex items-center justify-center text-muted-foreground" data-testid="chart-empty-state">
        <div className="text-center">
          <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center mx-auto mb-4">
            📊
          </div>
          <p className="font-medium">No mood data yet</p>
          <p className="text-sm">Start tracking your mood to see your trends!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full" data-testid="mood-chart">
      {/* Chart Area */}
      <div className="relative h-64 bg-muted/30 rounded-lg p-4 mb-4">
        {/* Y-axis labels */}
        <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-xs text-muted-foreground py-2">
          {[10, 8, 6, 4, 2].map(value => (
            <span key={value} className="leading-none">{value}</span>
          ))}
        </div>

        {/* Chart bars */}
        <div className="ml-8 h-full flex items-end justify-between space-x-1">
          {chartData.map((entry, index) => {
            const height = ((entry.mood - minMood) / (maxMood - minMood)) * 100;
            const color = getMoodColor(entry.mood);

            return (
              <div
                key={index}
                className="flex-1 flex flex-col items-center"
                data-testid={`chart-bar-${index}`}
              >
                <div
                  className="w-full rounded-t transition-all duration-300 hover:opacity-80 cursor-pointer relative group"
                  style={{
                    height: `${height}%`,
                    backgroundColor: color,
                    minHeight: '4px',
                  }}
                  title={`${entry.date}: ${entry.mood}/10`}
                >
                  {/* Tooltip */}
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="bg-foreground text-background text-xs rounded px-2 py-1 whitespace-nowrap">
                      <div className="font-semibold">{entry.mood}/10</div>
                      <div className="text-xs">{entry.date}</div>
                      {entry.emotions.length > 0 && (
                        <div className="text-xs">
                          {entry.emotions.slice(0, 2).join(", ")}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* X-axis labels */}
      <div className="flex items-center justify-between text-xs text-muted-foreground ml-8">
        {chartData.map((entry, index) => (
          <span
            key={index}
            className={`flex-1 text-center ${index % 3 === 0 ? 'block' : 'hidden'} sm:block`}
          >
            {entry.date}
          </span>
        ))}
      </div>

      {/* Legend */}
      <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-success"></div>
          <span className="text-xs text-muted-foreground">Great (8-10)</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-primary"></div>
          <span className="text-xs text-muted-foreground">Good (6-7)</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-secondary"></div>
          <span className="text-xs text-muted-foreground">Okay (4-5)</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-accent"></div>
          <span className="text-xs text-muted-foreground">Low (1-3)</span>
        </div>
      </div>

      {/* Summary */}
      <div className="mt-4 p-4 bg-muted/50 rounded-lg">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-lg font-semibold text-foreground">
              {calculateAverage(chartData)}
            </div>
            <div className="text-xs text-muted-foreground">Average</div>
          </div>
          <div>
            <div className="text-lg font-semibold text-success">
              {Math.max(...chartData.map(d => d.mood))}
            </div>
            <div className="text-xs text-muted-foreground">Highest</div>
          </div>
          <div>
            <div className="text-lg font-semibold text-accent">
              {Math.min(...chartData.map(d => d.mood))}
            </div>
            <div className="text-xs text-muted-foreground">Lowest</div>
          </div>
          <div>
            <div className="text-lg font-semibold text-primary">
              {calculateTrend(chartData)}
            </div>
            <div className="text-xs text-muted-foreground">Trend</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function getMoodColor(mood: number): string {
  if (mood >= 8) return "hsl(145 63% 49%)"; // Success green
  if (mood >= 6) return "hsl(238 78% 70%)"; // Primary blue
  if (mood >= 4) return "hsl(283 39% 53%)"; // Secondary purple
  return "hsl(4 90% 58%)"; // Accent red
}

function calculateAverage(data: Array<{ mood: number }>): string {
  if (!data.length) return "0";
  const sum = data.reduce((acc, entry) => acc + entry.mood, 0);
  return (sum / data.length).toFixed(1);
}

function calculateTrend(data: Array<{ mood: number }>): string {
  if (data.length < 2) return "→";

  const recentAvg = data.slice(-7).reduce((acc, entry) => acc + entry.mood, 0) / Math.min(7, data.length);
  const olderAvg = data.slice(-14, -7).reduce((acc, entry) => acc + entry.mood, 0) / Math.min(7, data.slice(-14, -7).length);

  if (data.slice(-14, -7).length === 0) return "→";

  const diff = recentAvg - olderAvg;
  if (diff > 0.5) return "↗";
  if (diff < -0.5) return "↘";
  return "→";
}
