"use client"
import { useAuth } from "../src/hooks/useAuth";
import { useToast } from "../src/hooks/use-toast";
import { isUnauthorizedError } from "../src/lib/authUtils";
import Navigation from "../src/components/navigation";
import JournalEntryForm from "../src/components/journal-entry-form";
import { Card, CardContent } from "../src/components/ui/card";
import { Button } from "../src/components/ui/button";
import { Input } from "../src/components/ui/input";
import { BookOpen, Plus, Search, Heart, Tag } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useState,useEffect } from "react";
import { apiRequest } from "../src/lib/queryClient";

export default function Journal() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading, user } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

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

const { data: journalEntries = [], isLoading: entriesLoading } = useQuery<
    Array<{
      id: string;
      title: string;
      content: string;
      tags?: string[];
      moodRating?: number;
      createdAt: string;
    }>
  >({
    queryKey: ["/api/journal-entries"],
    enabled: !!user,
    queryFn: async () => {
      const res = await apiRequest("GET", "/api/journal-entries");
      return res.json();
    },
  });

  if (isLoading || entriesLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center space-y-4">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-muted-foreground">Loading your journal...</p>
          </div>
        </div>
      </div>
    );
  }
{console.log(journalEntries)}
  const filteredEntries = journalEntries.filter((entry: any) =>
    entry.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    entry.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
    entry.tags?.some((tag: string) => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      <Navigation />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 space-y-4 md:space-y-0">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2" data-testid="text-page-title">
              Your Journal
            </h1>
            <p className="text-muted-foreground">
              Capture your thoughts, feelings, and experiences
            </p>
          </div>
          <Button 
            onClick={() => setShowForm(true)}
            className="flex items-center space-x-2"
            data-testid="button-new-entry"
          >
            <Plus className="h-4 w-4" />
            <span>New Entry</span>
          </Button>
        </div>

        {/* Search Bar */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search your entries../src."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
            data-testid="input-search"
          />
        </div>

        {/* New Entry Form */}
        {showForm && (
          <div className="mb-8">
            <JournalEntryForm 
              onSubmitted={() => setShowForm(false)}
              onCancel={() => setShowForm(false)}
            />
          </div>
        )}
        <div className="space-y-6">
          {filteredEntries.length > 0 ? (
            filteredEntries.map((entry: any) => (
              <Card 
                key={entry.id} 
                className="shadow-sm border border-border hover:shadow-md transition-shadow"
                data-testid={`journal-entry-${entry.id}`}
              >
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-semibold text-foreground">
                      {entry.title}
                    </h3>
                    <div className="text-sm text-muted-foreground">
                      {formatDate(entry.createdAt)}
                    </div>
                  </div>
                  
                  <div className="prose prose-sm max-w-none mb-4">
                    <p className="text-foreground whitespace-pre-wrap">
                      {entry.content}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex flex-wrap gap-2">
                      {entry.tags?.map((tag: string, index: number) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-primary/10 text-primary"
                        >
                          <Tag className="h-3 w-3 mr-1" />
                          {tag}
                        </span>
                      ))}
                    </div>
                    
                    {entry.moodRating && (
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Heart className="h-4 w-4 text-success mr-1" />
                        <span>{entry.moodRating}/10</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card className="shadow-sm border border-border">
              <CardContent className="p-12 text-center">
                {searchTerm ? (
                  <>
                    <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      No entries found
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      Try adjusting your search terms or create a new entry.
                    </p>
                    <Button onClick={() => setSearchTerm("")} variant="outline">
                      Clear Search
                    </Button>
                  </>
                ) : (
                  <>
                    <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      Start Your Journal
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      You haven't written any entries yet. Share your thoughts and feelings to begin your mental wellness journey.
                    </p>
                    <Button onClick={() => setShowForm(true)} data-testid="button-start-writing">
                      <Plus className="h-4 w-4 mr-2" />
                      Write Your First Entry
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  if (diffInDays === 0) {
    return `Today at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  } else if (diffInDays === 1) {
    return `Yesterday at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  } else if (diffInDays < 7) {
    return `${diffInDays} days ago`;
  } else {
    return date.toLocaleDateString([], { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  }
}
