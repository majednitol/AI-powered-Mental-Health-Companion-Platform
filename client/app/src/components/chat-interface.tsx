
"use client"
import { useState, useRef, useEffect } from "react";

import { Send, MessageCircle, User } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "../hooks/use-toast";
import { useAuth } from "../hooks/useAuth";
import { apiRequest } from "../lib/queryClient";
import { Card, CardContent } from "./ui/card";

import { Input } from "./ui/input";
import { Button } from "./ui/button";

interface ChatInterfaceProps {
  messages: any[];
}

export default function ChatInterface({ messages }: ChatInterfaceProps) {
  const [inputMessage, setInputMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { user } = useAuth();

  const sendMessage = useMutation({
    mutationFn: async (message: string) => {
      const response = await apiRequest("POST", "/api/chat/message", { message });
      console.log("response",response.json())
      return response.json();
    },
    onSuccess: () => {
      setInputMessage("");
      queryClient.invalidateQueries({ queryKey: ["/api/chat/messages"] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSendMessage = () => {
    const message = inputMessage.trim();
    if (message && !sendMessage.isPending) {
      sendMessage.mutate(message);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const firstName = (user as any)?.firstName || "User";
  const userInitial = (user as any)?.firstName?.[0] || (user as any)?.email?.[0] || "U";

  return (
    <Card className="shadow-sm border border-border" data-testid="card-chat-interface">
      <CardContent className="p-0">
        {/* Messages Container */}
        <div 
          className="h-96 overflow-y-auto p-6 space-y-4"
          data-testid="div-messages-container"
        >
          {messages.length > 0 ? (
            messages.map((message: any, index: number) => (
              <div
                key={message.id || index}
                className={`chat-bubble flex items-start space-x-3 ${
                  message.isFromUser ? "justify-end" : ""
                }`}
                data-testid={`message-${index}`}
              >
                {!message.isFromUser && (
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                    <MessageCircle className="text-primary-foreground h-4 w-4" />
                  </div>
                )}
                
                <div
                  className={`rounded-lg p-3 max-w-[80%] ${
                    message.isFromUser
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{message.message}</p>
                  <span
                    className={`text-xs ${
                      message.isFromUser
                        ? "text-primary-foreground/70"
                        : "text-muted-foreground"
                    }`}
                  >
                    {formatMessageTime(message.createdAt)}
                  </span>
                </div>

                {message.isFromUser && (
                  <div className="w-8 h-8 bg-success rounded-full flex items-center justify-center flex-shrink-0">
                    {(user as any)?.profileImageUrl ? (
                      <img
                        src={(user as any).profileImageUrl}
                        alt="Profile"
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    ) : (
                      <span className="text-white text-xs font-medium">
                        {userInitial}
                      </span>
                    )}
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Start a conversation with Luna!</p>
              <p className="text-sm">She's here to listen and support you.</p>
            </div>
          )}
          
          {/* Loading indicator when sending message */}
          {sendMessage.isPending && (
            <div className="chat-bubble flex items-start space-x-3">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                <MessageCircle className="text-primary-foreground h-4 w-4" />
              </div>
              <div className="bg-muted rounded-lg p-3 max-w-[80%]">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Chat Input */}
        <div className="border-t border-border p-4">
          <div className="flex space-x-2">
            <Input
              type="text"
              placeholder="Type your message..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={sendMessage.isPending}
              className="flex-1"
              data-testid="input-chat-message"
            />
            <Button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || sendMessage.isPending}
              className="px-4"
              data-testid="button-send-message"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Press Enter to send • Shift+Enter for new line
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

function formatMessageTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInMinutes = diffInMs / (1000 * 60);
  
  if (diffInMinutes < 1) return "Just now";
  if (diffInMinutes < 60) return `${Math.floor(diffInMinutes)}m ago`;
  
  const diffInHours = diffInMinutes / 60;
  if (diffInHours < 24) return `${Math.floor(diffInHours)}h ago`;
  
  const diffInDays = diffInHours / 24;
  if (diffInDays < 7) return `${Math.floor(diffInDays)}d ago`;
  
  return date.toLocaleDateString();
}
