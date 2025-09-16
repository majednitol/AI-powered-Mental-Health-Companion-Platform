"use client"
import { useEffect } from "react";
import { useAuth } from "../src/hooks/useAuth";
import { useToast } from "../src/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";

import Navigation from "../src/components/navigation";
import MoodChart from "../src/components/mood-chart";
import { Card, CardContent, CardHeader, CardTitle } from "../src/components/ui/card";
import { Badge } from "../src/components/ui/badge";
import { TrendingUp, BarChart3, Calendar, Target, Lightbulb, Brain, Heart, Zap } from "lucide-react";
import { apiRequest } from "../src/lib/queryClient";

export default function Analytics() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading, user } = useAuth();

  // Redirect to home if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
      return;
    }
  }, [isAuthenticated, isLoading, toast]);

  // Fetch analytics stats
  const { data: stats, isLoading: statsLoading } = useQuery<{
    currentStreak: number;
    weeklyAverage: number;
    monthlyAverage: number;
    totalJournalEntries: number;
    totalMoodEntries: number;
    weeklyJournalEntries: number;
  }>({
    queryKey: ["/api/analytics/stats"],
    enabled: !!user,
    queryFn: async () => {
      const res = await apiRequest("GET", "/api/analytics/stats");
      return res.json();
    },  

  });

  // Fetch mood entries for chart
  const { data: moodEntries = [], isLoading: moodLoading } = useQuery<Array<{
    id: string;
    moodScale: number;
    date: string;
    emotions?: string[];
  }>>({
    queryKey: ["/api/mood-entries"],
    enabled: !!user,
    queryFn: async () => {
      const res = await apiRequest("GET", "/api/mood-entries");
      return res.json();
    }, 
  });

  // Fetch AI insights
  const { data: insights, isLoading: insightsLoading } = useQuery<{
    insights: string[];
    recommendations: string[];
    patterns: string[];
  }>({
    queryKey: ["/api/analytics/insights"],
    enabled: !!user,
    queryFn: async () => {
      const res = await apiRequest("GET", "/api/analytics/insights");
      return res.json();
    }, 
  });

  if (isLoading || statsLoading || moodLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center space-y-4">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-muted-foreground">Loading analytics...</p>
          </div>
        </div>
      </div>
    );
  }

  const firstName = (user as any)?.firstName || "there";

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2" data-testid="text-page-title">
            Your Mental Health Analytics
          </h1>
          <p className="text-muted-foreground text-lg">
            Insights into your mental wellness journey and progress over time
          </p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="shadow-sm border border-border" data-testid="card-monthly-average">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">30-Day Average</p>
                  <div className="text-2xl font-bold text-primary" data-testid="text-monthly-average">
                    {stats?.monthlyAverage || "N/A"}
                  </div>
                </div>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm border border-border" data-testid="card-total-entries">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Journal Entries</p>
                  <div className="text-2xl font-bold text-success" data-testid="text-total-entries">
                    {stats?.totalJournalEntries || 0}
                  </div>
                </div>
                <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center">
                  <Brain className="h-6 w-6 text-success" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm border border-border" data-testid="card-current-streak">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Current Streak</p>
                  <div className="text-2xl font-bold text-secondary" data-testid="text-current-streak">
                    {stats?.currentStreak || 0}
                  </div>
                </div>
                <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center">
                  <Calendar className="h-6 w-6 text-secondary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm border border-border" data-testid="card-weekly-average">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">This Week</p>
                  <div className="text-2xl font-bold text-accent" data-testid="text-weekly-average">
                    {stats?.weeklyAverage || "N/A"}
                  </div>
                </div>
                <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
                  <Zap className="h-6 w-6 text-accent" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Mood Trend Chart */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <div className="lg:col-span-2">
            <Card className="shadow-sm border border-border" data-testid="card-mood-trend">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="text-success mr-3 h-5 w-5" />
                  30-Day Mood Trend
                </CardTitle>
              </CardHeader>
              <CardContent>
                <MoodChart moodEntries={moodEntries} />
              </CardContent>
            </Card>
          </div>

          {/* Quick Stats */}
          <div className="space-y-6">
            <Card className="shadow-sm border border-border" data-testid="card-mood-distribution">
              <CardHeader>
                <CardTitle className="text-lg">Mood Distribution</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {getMoodDistribution(moodEntries).map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: item.color }}
                      ></div>
                      <span className="text-sm text-muted-foreground">{item.range}</span>
                    </div>
                    <span className="text-sm font-medium">{item.percentage}%</span>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="shadow-sm border border-border" data-testid="card-progress-summary">
              <CardHeader>
                <CardTitle className="text-lg">Progress Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Days Tracked</span>
                  <span className="font-medium" data-testid="text-days-tracked">
                    {stats?.totalMoodEntries || 0}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">This Week</span>
                  <span className="font-medium" data-testid="text-week-entries">
                    {stats?.weeklyJournalEntries || 0} entries
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Consistency</span>
                  <Badge variant="secondary" data-testid="badge-consistency">
                    {getConsistencyLevel(stats?.currentStreak || 0)}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* AI Insights */}
        {insights && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {/* Positive Patterns */}
            <Card className="shadow-sm border border-success/20 bg-success/5" data-testid="card-positive-patterns">
              <CardHeader>
                <CardTitle className="text-success flex items-center">
                  <Lightbulb className="mr-2 h-5 w-5" />
                  Positive Patterns
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {insights.patterns?.slice(0, 3).map((pattern: string, index: number) => (
                    <p key={index} className="text-sm text-success/80">
                      • {pattern}
                    </p>
                  )) || (
                    <p className="text-sm text-success/80">
                      • Keep tracking your mood to identify positive patterns
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Key Insights */}
            <Card className="shadow-sm border border-primary/20 bg-primary/5" data-testid="card-key-insights">
              <CardHeader>
                <CardTitle className="text-primary flex items-center">
                  <Brain className="mr-2 h-5 w-5" />
                  Key Insights
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {insights.insights?.slice(0, 3).map((insight: string, index: number) => (
                    <p key={index} className="text-sm text-primary/80">
                      • {insight}
                    </p>
                  )) || (
                    <p className="text-sm text-primary/80">
                      • Continue your tracking to unlock personalized insights
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Recommendations */}
            <Card className="shadow-sm border border-secondary/20 bg-secondary/5" data-testid="card-recommendations">
              <CardHeader>
                <CardTitle className="text-secondary flex items-center">
                  <Target className="mr-2 h-5 w-5" />
                  Recommendations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {insights.recommendations?.slice(0, 3).map((rec: string, index: number) => (
                    <p key={index} className="text-sm text-secondary/80">
                      • {rec}
                    </p>
                  )) || (
                    <p className="text-sm text-secondary/80">
                      • Set a daily reminder to track your mood consistently
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Achievement Section */}
        <Card className="shadow-sm border border-border" data-testid="card-achievements">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Heart className="text-accent mr-3 h-5 w-5" />
              Your Mental Wellness Journey
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Calendar className="h-8 w-8 text-success" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">Consistency Champion</h3>
                <p className="text-sm text-muted-foreground">
                  {stats?.currentStreak || 0} days of mood tracking shows your commitment to mental wellness
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Brain className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">Self-Reflection Master</h3>
                <p className="text-sm text-muted-foreground">
                  {stats?.totalJournalEntries || 0} journal entries demonstrate your dedication to self-awareness
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <TrendingUp className="h-8 w-8 text-secondary" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">Progress Tracker</h3>
                <p className="text-sm text-muted-foreground">
                  Your average mood of {stats?.monthlyAverage || "N/A"} shows your emotional awareness
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function getMoodDistribution(moodEntries: any[]) {
  if (!moodEntries.length) return [];

  const ranges = [
    { range: "Great (8-10)", min: 8, max: 10, color: "#2ECC71" },
    { range: "Good (6-7)", min: 6, max: 7, color: "#6B73FF" },
    { range: "Okay (4-5)", min: 4, max: 5, color: "#9B59B6" },
    { range: "Low (1-3)", min: 1, max: 3, color: "#E74C3C" },
  ];

  const distribution = ranges.map(range => {
    const count = moodEntries.filter(entry => 
      entry.moodScale >= range.min && entry.moodScale <= range.max
    ).length;
    
    return {
      ...range,
      count,
      percentage: Math.round((count / moodEntries.length) * 100),
    };
  });

  return distribution;
}

function getConsistencyLevel(streak: number): string {
  if (streak >= 30) return "Excellent";
  if (streak >= 14) return "Great";
  if (streak >= 7) return "Good";
  if (streak >= 3) return "Building";
  return "Getting Started";
}
