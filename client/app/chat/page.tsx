
"use client"
import { useState, useEffect, useRef } from "react";
import { useAuth } from "../src/hooks/useAuth";
import { useToast } from "../src/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { isUnauthorizedError } from "../src/lib/authUtils";
import { apiRequest } from "../src/lib/queryClient";
import Navigation from "../src/components/navigation";
import ChatInterface from "../src/components/chat-interface";
import { Card, CardContent, CardHeader, CardTitle } from "../src/components/ui/card";
import { MessageCircle, Heart, Sparkles } from "lucide-react";

export default function Chat() {
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

  // Fetch chat messages
  const { data: messages = [], isLoading: messagesLoading } = useQuery<Array<{
    id: string;
    message: string;
    isFromUser: boolean;
    createdAt: string;
  }>>({
    queryKey: ["/api/chat/messages"],
    enabled: !!user,
    queryFn: async () => {
      const res = await apiRequest("GET", "/api/chat/messages");
      return res.json();
    },  
  });

  if (isLoading || messagesLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center space-y-4">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-muted-foreground">Loading chat../src.</p>
          </div>
        </div>
      </div>
    );
  }

  const firstName = (user as any)?.firstName || "there";

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      <Navigation />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="gradient-bg rounded-lg p-8 text-white">
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <MessageCircle className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold" data-testid="text-page-title">
                  Chat with Luna
                </h1>
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 bg-success rounded-full"></span>
                  <span className="text-white/90">Online and ready to help</span>
                </div>
              </div>
            </div>
            <p className="text-white/90 text-lg">
              Your personal AI companion is here to provide emotional support and guidance.
            </p>
          </div>
        </div>

        {/* Welcome Message for First Time */}
        {messages.length === 0 && (
          <Card className="mb-6 border-primary/20 bg-primary/5" data-testid="card-welcome">
            <CardContent className="p-6">
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                  <MessageCircle className="h-5 w-5 text-primary-foreground" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground mb-2 flex items-center">
                    <Sparkles className="h-4 w-4 mr-2 text-primary" />
                    Welcome to your conversation with Luna!
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Hi {firstName}! I'm Luna, your personal AI mental health companion. I'm here to:
                  </p>
                  <ul className="text-sm text-muted-foreground space-y-1 mb-4">
                    <li className="flex items-center">
                      <Heart className="h-3 w-3 mr-2 text-success" />
                      Provide emotional support and active listening
                    </li>
                    <li className="flex items-center">
                      <Heart className="h-3 w-3 mr-2 text-success" />
                      Offer personalized insights based on your journal entries
                    </li>
                    <li className="flex items-center">
                      <Heart className="h-3 w-3 mr-2 text-success" />
                      Suggest coping strategies and wellness techniques
                    </li>
                    <li className="flex items-center">
                      <Heart className="h-3 w-3 mr-2 text-success" />
                      Help you process thoughts and emotions
                    </li>
                  </ul>
                  <p className="text-sm text-muted-foreground">
                    Feel free to share whatever is on your mind. How are you feeling today?
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Chat Interface */}
        <ChatInterface messages={messages} />
      </div>
    </div>
  );
}
