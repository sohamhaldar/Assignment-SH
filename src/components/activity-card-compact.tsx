'use client'
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, MapPin, Plus, Trash } from "lucide-react";
import { Button } from './ui/button';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Activity, Column } from '@/types/activity';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from './ui/dropdown-menu';



interface ActivityCardProps {
  activity: Activity;
  onAddToColumn: (columnId: string) => void;
  columns: Column[];
  currentColoumnId?: string;
  setActivityModalOpen?: (isOpen: boolean) => void;
  deleteAvailableActivity: (activityId: string) => void;
}

export const ActivityCardCompact = ({ activity, onAddToColumn, columns,currentColoumnId ,setActivityModalOpen,deleteAvailableActivity }: ActivityCardProps) => {
  const getCategoryIcon = (category: string) => {
    const icons: Record<string, string> = {
      'Wellness': '🧘',
      'Food': '🍽️',
      'Culture': '🎭',
      'Outdoors': '🌲',
      'Shopping': '🛍️',
      'Entertainment': '🎬',
    };
    return icons[category] || '📍';
  };

  return (
  <div className="relative flex items-center justify-between p-4 border-b border-border hover:bg-accent transition-colors duration-200">
      <div className="flex flex-wrap items-center space-x-3">
    <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center text-sm">
          {getCategoryIcon(activity.category)}
        </div>
    <span className="text-base font-medium">{activity.title}</span>
      </div>
      {currentColoumnId?(
        <div className='flex flex-wrap items-center gap-2'>
        <Button 
            variant="ghost" 
            size="icon"
            className="w-8 h-8 rounded-full border border-border hover:bg-muted"
            onClick={() => {
              onAddToColumn(currentColoumnId)
              if(setActivityModalOpen) setActivityModalOpen(false);
            }}
          >
          <Plus className="w-4 h-4" />
        </Button>
        <Button
            variant="ghost"
            size="icon"
            aria-label="Delete activity"
            className="w-8 h-8 rounded-full border border-border text-destructive hover:text-destructive hover:bg-destructive/10"
            onClick={() => deleteAvailableActivity(activity.id)}
          >
            <Trash className="w-4 h-4" />
          </Button>
        </div>
      ):(
        <div className="flex flex-wrap items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon"
                className="w-8 h-8 rounded-full border border-border hover:bg-muted"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-60 font-mono">
              <DropdownMenuLabel>Add to:</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {columns.map((column) => (
                <DropdownMenuItem
                  key={column.id}
                  onClick={() => onAddToColumn(column.id)}
                  className="cursor-pointer"
                >
                  📅 {column.title}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <Button
            variant="ghost"
            size="icon"
            aria-label="Delete activity"
            className="w-8 h-8 rounded-full border border-border text-destructive hover:text-destructive hover:bg-destructive/10"
            onClick={() => deleteAvailableActivity(activity.id)}
          >
            <Trash className="w-4 h-4" />
          </Button>
        </div>
      )}
      
      
    </div>
  );
};