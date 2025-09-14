"use client"

import { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import { Slider } from "./ui/slider";

import { useToast } from "../hooks/use-toast";
import { apiRequest } from "../lib/queryClient";
import { X, Plus } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface JournalEntryFormProps {
  onSubmitted: () => void;
  onCancel: () => void;
}

export default function JournalEntryForm({ onSubmitted, onCancel }: JournalEntryFormProps) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [currentTag, setCurrentTag] = useState("");
  const [moodRating, setMoodRating] = useState([7]);

  const queryClient = useQueryClient();
  const { toast } = useToast();

  const createJournalEntry = useMutation({
    mutationFn: async (data: any) => {
      return await apiRequest("POST", "/api/journal-entries", data);
    },
    onSuccess: () => {
      toast({
        title: "Entry Saved",
        description: "Your journal entry has been saved successfully!",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/journal-entries"] });
      onSubmitted();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to save journal entry. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleAddTag = () => {
    const tag = currentTag.trim().toLowerCase();
    if (tag && !tags.includes(tag)) {
      setTags([...tags, tag]);
      setCurrentTag("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddTag();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !content.trim()) {
      toast({
        title: "Missing Information",
        description: "Please fill in both title and content.",
        variant: "destructive",
      });
      return;
    }

    createJournalEntry.mutate({
      title: title.trim(),
      content: content.trim(),
      tags: tags.length > 0 ? tags : null,
      moodRating: moodRating[0],
    });
  };

  return (
    <Card className="shadow-sm border border-border" data-testid="card-journal-form">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>New Journal Entry</CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={onCancel}
            data-testid="button-cancel"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <Label htmlFor="entry-title" className="text-sm font-medium">
              Title
            </Label>
            <Input
              id="entry-title"
              type="text"
              placeholder="Give your entry a title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1"
              data-testid="input-title"
            />
          </div>

          {/* Content */}
          <div>
            <Label htmlFor="entry-content" className="text-sm font-medium">
              Your thoughts
            </Label>
            <Textarea
              id="entry-content"
              placeholder="What's on your mind? How are you feeling today?"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="mt-1 min-h-[200px]"
              data-testid="textarea-content"
            />
          </div>

          {/* Mood Rating */}
          <div>
            <Label className="text-sm font-medium mb-3 block">
              How do you feel about this entry? ({moodRating[0]}/10)
            </Label>
            <div className="px-2">
              <Slider
                value={moodRating}
                onValueChange={setMoodRating}
                max={10}
                min={1}
                step={1}
                className="w-full"
                data-testid="slider-mood-rating"
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>Very Low</span>
                <span>Excellent</span>
              </div>
            </div>
          </div>

          {/* Tags */}
          <div>
            <Label className="text-sm font-medium">
              Tags (optional)
            </Label>
            <div className="mt-1 flex space-x-2">
              <Input
                type="text"
                placeholder="Add a tag..."
                value={currentTag}
                onChange={(e) => setCurrentTag(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-1"
                data-testid="input-tag"
              />
              <Button
                type="button"
                onClick={handleAddTag}
                variant="outline"
                size="sm"
                data-testid="button-add-tag"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-primary/10 text-primary"
                    data-testid={`tag-${tag}`}
                  >
                    #{tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="ml-1 hover:text-primary/70"
                      data-testid={`button-remove-tag-${tag}`}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex space-x-3">
            <Button
              type="submit"
              disabled={createJournalEntry.isPending}
              className="flex-1"
              data-testid="button-save-entry"
            >
              {createJournalEntry.isPending ? "Saving..." : "Save Entry"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              data-testid="button-cancel-form"
            >
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
