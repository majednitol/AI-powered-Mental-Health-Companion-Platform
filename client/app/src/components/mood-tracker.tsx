"use client"
import React, { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "../hooks/use-toast";
import { apiRequest } from "../lib/queryClient";
import { TrendingUp } from "lucide-react";

interface MoodTrackerProps {
  existingEntry?: any;
}

const emotions = [
  { emoji: "😊", label: "Happy", color: "bg-success/10 text-success" },
  { emoji: "😔", label: "Sad", color: "bg-blue-100 text-blue-600" },
  { emoji: "😰", label: "Anxious", color: "bg-accent/10 text-accent" },
  { emoji: "😴", label: "Tired", color: "bg-purple-100 text-purple-600" },
  { emoji: "😤", label: "Angry", color: "bg-red-100 text-red-600" },
  { emoji: "🤗", label: "Grateful", color: "bg-green-100 text-green-600" },
  { emoji: "😐", label: "Neutral", color: "bg-gray-100 text-gray-600" },
  { emoji: "🤔", label: "Confused", color: "bg-yellow-100 text-yellow-600" },
];

export default function MoodTracker({ existingEntry }: MoodTrackerProps) {
  const [moodScale, setMoodScale] = useState(existingEntry?.moodScale || 5);
  const [selectedEmotions, setSelectedEmotions] = useState<string[]>(existingEntry?.emotions || []);
  const [notes, setNotes] = useState(existingEntry?.notes || "");

  const queryClient = useQueryClient();
  const { toast } = useToast();

  const createMoodEntry = useMutation({
    mutationFn: async (data: any) => {
      return await apiRequest("POST", "/api/mood-entries", data);
    },
    onSuccess: () => {
      toast({
        title: "Mood Saved",
        description: "Your mood has been recorded successfully!",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/mood-entries"] });
      queryClient.invalidateQueries({ queryKey: ["/api/mood-entries/today"] });
      queryClient.invalidateQueries({ queryKey: ["/api/analytics/stats"] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to save mood entry. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleEmotionToggle = (emotion: string) => {
    setSelectedEmotions(prev =>
      prev.includes(emotion)
        ? prev.filter(e => e !== emotion)
        : [...prev, emotion]
    );
  };

  const handleSubmit = () => {
    createMoodEntry.mutate({
      moodScale,
      emotions: selectedEmotions,
      notes: notes.trim() || null,
      date: new Date().toISOString(),
    });
  };

  return (
    <Card className="shadow-sm border border-border" data-testid="card-mood-tracker">
      <CardContent className="p-6">
        <h2 className="text-xl font-semibold mb-6 flex items-center">
          <TrendingUp className="text-primary mr-3 h-5 w-5" />
          Today's Mood Check
        </h2>

        {/* Mood Scale */}
        <div className="mb-6">
          <Label className="block text-sm font-medium mb-3">
            How would you rate your overall mood? (1-10)
          </Label>
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm text-muted-foreground">Very Low</span>
            <span className="text-sm text-muted-foreground">Excellent</span>
          </div>
          <div className="flex space-x-1">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((value) => (
              <button
                key={value}
                onClick={() => setMoodScale(value)}
                className={`w-8 h-8 rounded-full text-sm transition-colors ${moodScale === value
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted hover:bg-primary hover:text-primary-foreground"
                  }`}
                data-testid={`mood-scale-${value}`}
              >
                {value}
              </button>
            ))}
          </div>
        </div>

        {/* Emotion Categories */}
        <div className="mb-6">
          <Label className="block text-sm font-medium mb-3">
            What emotions are you feeling?
          </Label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {emotions.map((emotion) => (
              <button
                key={emotion.label}
                onClick={() => handleEmotionToggle(emotion.label)}
                className={`p-3 rounded-lg transition-colors flex flex-col items-center ${selectedEmotions.includes(emotion.label)
                    ? emotion.color
                    : "bg-muted hover:bg-primary/20"
                  }`}
                data-testid={`emotion-${emotion.label.toLowerCase()}`}
              >
                <span className="text-2xl mb-1">{emotion.emoji}</span>
                <span className="text-xs">{emotion.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Notes */}
        <div className="mb-6">
          <Label htmlFor="mood-notes" className="block text-sm font-medium mb-2">
            Additional notes (optional)
          </Label>
          <Textarea
            id="mood-notes"
            placeholder="How are you feeling today? What's on your mind?"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="min-h-[80px]"
            data-testid="textarea-mood-notes"
          />
        </div>

        <Button
          onClick={handleSubmit}
          disabled={createMoodEntry.isPending}
          className="w-full"
          data-testid="button-save-mood"
        >
          {createMoodEntry.isPending ? "Saving..." : existingEntry ? "Update Today's Mood" : "Save Today's Mood"}
        </Button>
      </CardContent>
    </Card>
  );
}
