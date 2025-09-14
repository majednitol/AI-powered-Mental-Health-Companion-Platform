"use client"

import React, { useEffect } from "react";

import { Heart, BookOpen, MessageCircle, TrendingUp, Flame, BarChart3, Navigation } from "lucide-react";
import Link from "next/link";
import { useToast } from "../src/hooks/use-toast";
import { useAuth } from "../src/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import MoodTracker from "../src/components/mood-tracker";
import { Card, CardContent } from "../src/components/ui/card";
import { Button } from "../src/components/ui/button";
import { apiRequest } from "../src/lib/queryClient";

export default function Dashboard() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading, user } = useAuth();
console.log("isAuthenticated",user)
  // Redirect to home if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        // window.location.href = "/api/login";
      }, 500);
      return;
    }
  }, [isAuthenticated, isLoading, toast]);

  // Fetch analytics stats
  const { data: stats } = useQuery<{
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

  // Fetch recent journal entries
  const { data: journalEntries = [] } = useQuery<Array<{
    id: string;
    title: string;
    content: string;
    tags?: string[];
    moodRating?: number;
    createdAt: string;
  }>>({
    queryKey: ["/api/journal-entries"],
    enabled: !!user,
    queryFn: async () => {
      const res = await apiRequest("GET", "/api/journal-entries");
      return res.json();
    },
  });

  // Fetch today's mood entry
  const { data: todaysMood } = useQuery({
    queryKey: ["/api/mood-entries/today"],
    enabled: !!user,
    queryFn: async () => {
      const res = await apiRequest("GET", "/api/mood-entries/today");
      return res.json();
    },  
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  const firstName = (user as any)?.firstName || "there";

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="gradient-bg rounded-lg p-8 text-white">
            <h1 className="text-3xl font-bold mb-2" data-testid="text-welcome">
              Good {getTimeOfDay()}, {firstName}! {getTimeEmoji()}
            </h1>
            <p className="text-white/90 text-lg">
              How are you feeling today? Let's check in with your mental wellness.
            </p>
            <div className="mt-6 flex flex-wrap gap-4">
              <Link href="/chat">
                <Button className="bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 transition-colors" data-testid="button-quick-mood">
                  <Heart className="mr-2 h-4 w-4" />
                  Quick Mood Check
                </Button>
              </Link>
              <Link href="/journal">
                <Button className="bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 transition-colors" data-testid="button-new-entry">
                  <BookOpen className="mr-2 h-4 w-4" />
                  New Journal Entry
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Today's Mood Tracking & Quick Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <div className="lg:col-span-2">
            <MoodTracker existingEntry={todaysMood} />
          </div>

          {/* Quick Stats */}
          <div className="space-y-6">
            <Card className="shadow-sm border border-border" data-testid="card-streak">
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4 flex items-center">
                  <Flame className="text-accent mr-2 h-5 w-5" />
                  Current Streak
                </h3>
                <div className="text-center">
                  <div className="text-3xl font-bold text-success mb-1" data-testid="text-streak">
                    {stats?.currentStreak || 0}
                  </div>
                  <div className="text-sm text-muted-foreground">days logging mood</div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-sm border border-border" data-testid="card-this-week">
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4 flex items-center">
                  <BarChart3 className="text-secondary mr-2 h-5 w-5" />
                  This Week
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Average Mood</span>
                    <span className="font-medium" data-testid="text-weekly-average">
                      {stats?.weeklyAverage || "N/A"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Journal Entries</span>
                    <span className="font-medium" data-testid="text-weekly-entries">
                      {stats?.weeklyJournalEntries || 0}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Journal & Chat Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Recent Journal Entries */}
          <Card className="shadow-sm border border-border" data-testid="card-recent-journals">
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold flex items-center">
                  <BookOpen className="text-secondary mr-3 h-5 w-5" />
                  Recent Journal Entries
                </h2>
                <Link href="/journal">
                  <Button variant="ghost" className="text-primary hover:text-primary/80 font-medium" data-testid="button-new-journal-entry">
                    <span className="mr-1">+</span>New Entry
                  </Button>
                </Link>
              </div>

              <div className="space-y-4">
                {journalEntries.slice(0, 3).map((entry: any) => (
                  <div
                    key={entry.id}
                    className="border border-border rounded-lg p-4 hover:bg-muted/50 transition-colors cursor-pointer"
                    data-testid={`journal-entry-${entry.id}`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium">{entry.title}</h4>
                      <span className="text-xs text-muted-foreground">
                        {formatRelativeTime(entry.createdAt)}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                      {entry.content.substring(0, 150)}../src.
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex space-x-2">
                        {entry.tags?.slice(0, 2).map((tag: string, index: number) => (
                          <span
                            key={index}
                            className="bg-primary/10 text-primary px-2 py-1 rounded-full text-xs"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                      {entry.moodRating && (
                        <div className="flex items-center text-xs text-muted-foreground">
                          <Heart className="h-3 w-3 text-success mr-1" />
                          <span>{entry.moodRating}/10</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                {journalEntries.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No journal entries yet.</p>
                    <p className="text-sm">Start writing to track your thoughts!</p>
                  </div>
                )}

                <Link href="/journal">
                  <Button variant="ghost" className="w-full mt-4 text-primary hover:text-primary/80 font-medium" data-testid="button-view-all-entries">
                    View All Entries
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* AI Chat Companion Preview */}
          <Card className="shadow-sm border border-border" data-testid="card-ai-companion">
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold flex items-center">
                  <MessageCircle className="text-primary mr-3 h-5 w-5" />
                  AI Companion - Luna
                </h2>
                <span className="bg-success/10 text-success px-2 py-1 rounded-full text-xs">Online</span>
              </div>

              <div className="space-y-4 mb-6">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                    <MessageCircle className="text-primary-foreground h-4 w-4" />
                  </div>
                  <div className="bg-muted rounded-lg p-3 max-w-[80%]">
                    <p className="text-sm">
                      Hi {firstName}! I'm here to support you on your mental wellness journey.
                      {stats?.currentStreak ? ` I see you've been tracking your mood for ${stats.currentStreak} days - that's amazing! 🌟` : " How are you feeling today?"}
                    </p>
                    <span className="text-xs text-muted-foreground">Just now</span>
                  </div>
                </div>
              </div>

              <Link href="/chat">
                <Button className="w-full" data-testid="button-start-chat">
                  Start Conversation with Luna
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link href="/journal">
            <Button className="w-full h-32 bg-primary text-primary-foreground hover:bg-primary/90 transition-colors p-6 flex flex-col items-start text-left" data-testid="button-write-journal">
              <BookOpen className="h-8 w-8 mb-3" />
              <h3 className="font-semibold text-lg mb-2">Write in Journal</h3>
              <p className="text-primary-foreground/80 text-sm">Capture your thoughts and feelings</p>
            </Button>
          </Link>

          <Link href="/chat">
            <Button className="w-full h-32 bg-secondary text-secondary-foreground hover:bg-secondary/90 transition-colors p-6 flex flex-col items-start text-left" data-testid="button-ai-chat">
              <MessageCircle className="h-8 w-8 mb-3" />
              <h3 className="font-semibold text-lg mb-2">Chat with Luna</h3>
              <p className="text-secondary-foreground/80 text-sm">Get emotional support and guidance</p>
            </Button>
          </Link>

          <Link href="/analytics">
            <Button className="w-full h-32 bg-success text-white hover:bg-success/90 transition-colors p-6 flex flex-col items-start text-left" data-testid="button-view-analytics">
              <TrendingUp className="h-8 w-8 mb-3" />
              <h3 className="font-semibold text-lg mb-2">View Progress</h3>
              <p className="text-white/80 text-sm">See your mental health journey</p>
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

function getTimeOfDay() {
  const hour = new Date().getHours();
  if (hour < 12) return "morning";
  if (hour < 17) return "afternoon";
  return "evening";
}

function getTimeEmoji() {
  const hour = new Date().getHours();
  if (hour < 12) return "🌅";
  if (hour < 17) return "☀️";
  return "🌙";
}

function formatRelativeTime(dateString: string) {
  const date = new Date(dateString);
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInHours = diffInMs / (1000 * 60 * 60);

  if (diffInHours < 1) return "Just now";
  if (diffInHours < 24) return `${Math.floor(diffInHours)} hours ago`;

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays === 1) return "Yesterday";
  if (diffInDays < 7) return `${diffInDays} days ago`;

  return date.toLocaleDateString();
}
