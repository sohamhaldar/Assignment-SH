'use client'
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Edit as EditIcon } from "lucide-react";
import { Activity } from '@/types/activity';

interface EditActivityModalProps {
  activity: Activity | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (activity: Activity) => void;
}

export function EditActivityModal({ activity, isOpen, onClose, onSave }: EditActivityModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    duration: '',
    category: '',
    location: '',
  });

  useEffect(() => {
    if (activity) {
      setFormData({
        title: activity.title,
        description: activity.description,
        duration: activity.duration,
        category: activity.category,
        location: activity.location,
      });
    }
  }, [activity]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activity) return;

    const updatedActivity: Activity = {
      ...activity,
      ...formData,
    };

    onSave(updatedActivity);
    onClose();
  };

  const categories = [
    { name: 'Wellness', icon: '🧘' },
    { name: 'Food', icon: '🍽️' },
    { name: 'Culture', icon: '🎭' },
    { name: 'Outdoors', icon: '🌲' },
    { name: 'Shopping', icon: '🛍️' },
    { name: 'Entertainment', icon: '🎬' },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="font-mono max-w-md sm:max-w-lg md:max-w-xl lg:max-w-xl border-0 shadow-xl bg-popover/95 backdrop-blur-sm">
        <DialogHeader className="text-center space-y-6 pb-2 sm:pb-3 md:pb-4">
          <div className="mx-auto w-14 h-14 bg-muted rounded-2xl flex items-center justify-center ring-1 ring-border/50 drop-shadow-md">
            <EditIcon className="w-6 h-6" />
          </div>
          <div>
            <DialogTitle className="text-xl sm:text-2xl font-semibold mb-1 sm:mb-2">
              Edit Activity
            </DialogTitle>
            <p className="text-sm text-muted-foreground">Update your plan</p>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5 mt-2 sm:mt-4">
          <div className="group relative">
            <Input
              placeholder="What's the activity?"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="transition-all duration-200 h-11 sm:h-12 px-3 sm:px-4 rounded-xl border-border bg-muted/50 focus:bg-background"
              required
            />
          </div>

          <div className="group relative">
            <Input
              placeholder="Tell us more about it..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="transition-all duration-200 h-11 sm:h-12 px-3 sm:px-4 rounded-xl border-border bg-muted/50 focus:bg-background"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div className="group relative">
              <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
        <SelectTrigger className="transition-all duration-200 h-11 sm:h-12 px-3 sm:px-4 rounded-xl border-border bg-muted/50 focus:bg-background">
                  <SelectValue placeholder="Pick a vibe" />
                </SelectTrigger>
        <SelectContent className="rounded-xl border-border bg-popover/95 backdrop-blur-sm shadow-xl">
                  {categories.map((category) => (
                    <SelectItem
                      key={category.name}
                      value={category.name}
          className="font-mono cursor-pointer rounded-lg my-1 hover:bg-accent focus:bg-accent transition-colors duration-200"
                    >
                      <span className="flex items-center gap-3">
                        <span className="text-lg">{category.icon}</span>
                        <span className="font-medium">{category.name}</span>
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* <div className="group relative">
              <Input
                placeholder="How long?"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                className="border-gray-200 focus:border-gray-400 transition-all duration-200 h-11 sm:h-12 px-3 sm:px-4 bg-gray-50/50 focus:bg-white rounded-xl"
              />
            </div> */}
          </div>

          <div className="group relative">
            <Input
              placeholder="Where will this happen?"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="transition-all duration-200 h-11 sm:h-12 px-3 sm:px-4 rounded-xl border-border bg-muted/50 focus:bg-background"
            />
          </div>

          <div className="pt-4 sm:pt-6 flex gap-2">
            <Button type="button" variant="outline" className="w-1/2 h-12 rounded-xl" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              className="w-1/2 h-12 rounded-xl font-medium transition-all duration-200 bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl"
            >
              Save Changes
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
