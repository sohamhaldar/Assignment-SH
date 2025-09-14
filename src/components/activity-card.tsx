'use client'
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, MapPin, Plus } from "lucide-react";
import { Button } from './ui/button';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Activity, Column } from '@/types/activity';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from './ui/dropdown-menu';

interface ActivityCardProps {
  activity: Activity;
  onAddToColumn: (columnId: string) => void;
  columns: Column[];
}

export const ActivityCard = ({ activity, onAddToColumn, columns }: ActivityCardProps) => {
  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'Wellness': 'bg-green-100 text-green-800 hover:bg-green-200',
      'Food': 'bg-orange-100 text-orange-800 hover:bg-orange-200',
      'Culture': 'bg-purple-100 text-purple-800 hover:bg-purple-200',
      'Outdoors': 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200',
      'Shopping': 'bg-pink-100 text-pink-800 hover:bg-pink-200',
      'Entertainment': 'bg-blue-100 text-blue-800 hover:bg-blue-200',
    };
  return colors[category] || 'bg-muted text-foreground/80 hover:bg-accent';
  };

  const getCategoryIcon = (category: string) => {
    const icons: Record<string, string> = {
      'Wellness': '🧘',
      'Food': '🍽️',
      'Culture': '🎭',
      'Outdoors': '�',
      'Shopping': '🛍️',
      'Entertainment': '�',
    };
    return icons[category] || '📍';
  };

  return (
  <Card className="mb-4 group gap-2 hover:shadow-md transition-all duration-300 border border-border bg-card">
      <CardHeader className="">
        <div className="flex justify-between items-start flex-wrap gap-2">
          <div className="flex-1 ">
      <CardTitle className="text-lg font-semibold leading-tight">
              {activity.title}
            </CardTitle>
            {/* <div className="flex items-center mt-2 text-sm text-gray-600">
              <Clock className="w-4 h-4 mr-2" />
              <span className="font-medium">{activity.duration}</span>
            </div> */}
          </div>
          
            <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
              size="sm" 
              className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 transition-colors duration-200 font-mono"
              >
              <Plus className="w-4 h-4 mr-1" />
              Add
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-60 font-mono">
              <DropdownMenuLabel>Add to:</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {columns.map((column) => (
              <DropdownMenuItem
                key={column.id}
                className="cursor-pointer"
                onClick={() => onAddToColumn(column.id)}
              >
                <span className="mr-2">📅</span>
                {column.title}
              </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
            </DropdownMenu>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <Badge 
            variant="secondary" 
            className={`${getCategoryColor(activity.category)} px-2 py-1 text-xs font-medium rounded-md`}
          >
            <span className="mr-1">{getCategoryIcon(activity.category)}</span>
            {activity.category}
          </Badge>
          
          <div className="flex items-center text-xs text-muted-foreground bg-muted px-2 py-1 rounded-md">
            <MapPin className="w-3 h-3 mr-1" />
            <span>{activity.location}</span>
          </div>
        </div>
        
        <CardDescription className="leading-relaxed text-sm">
          {activity.description}
        </CardDescription>
      </CardContent>
    </Card>
  );
};