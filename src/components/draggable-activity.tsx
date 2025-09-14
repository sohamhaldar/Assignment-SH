'use client'
import React, { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, MapPin, GripVertical, Edit, Trash2, MoreVertical, EllipsisVertical } from "lucide-react";
import { Activity } from '@/types/activity';
import { useDragDrop } from '@/contexts/DragDropContext';
import { EditActivityModal } from './edit-activity-modal';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface DraggableActivityProps {
  activity: Activity;
  isInColumn?: boolean;
}

export function DraggableActivity({ activity, isInColumn = false }: DraggableActivityProps) {
  const { editActivity, deleteActivity } = useDragDrop();
  const [showActions, setShowActions] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: activity.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

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
      'Outdoors': '🌲',
      'Shopping': '🛍️',
      'Entertainment': '🎬',
    };
    return icons[category] || '📍';
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditModalOpen(true);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    deleteActivity(activity.id);
    setIsDeleteDialogOpen(false);
  };

  const handleSave = (updatedActivity: Activity) => {
    editActivity(activity.id, updatedActivity);
  };

  return (
    <>
      
      <div className="hidden">
        <div 
          ref={setNodeRef}
          style={style}
          {...attributes}
          className={`flex items-center justify-between p-3 mb-2 bg-card rounded-lg border border-border hover:shadow-sm transition-all duration-300 ${
            isDragging ? 'shadow-lg ring-2 ring-ring scale-105' : ''
          } group relative`}
          onMouseEnter={() => setShowActions(true)}
          onMouseLeave={() => setShowActions(false)}
        >
          <div className="flex items-center space-x-3">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm ${getCategoryColor(activity.category)}`}>
              {getCategoryIcon(activity.category)}
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium line-clamp-2">{activity.title}</span>
              <div className="flex items-center text-xs text-muted-foreground">
                <Clock className="w-3 h-3 mr-1" />
                {activity.duration}
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {isInColumn && (
              <div className={`flex items-center gap-1 transition-opacity duration-200 ${
                showActions ? 'opacity-100' : 'opacity-0'
              }`}>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-6 w-6 p-0 hover:bg-blue-100"
                  onClick={handleEdit}
                >
                  <Edit className="w-3 h-3" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-6 w-6 p-0 hover:bg-red-100"
                  onClick={handleDelete}
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
            )}
            <div
              {...listeners}
              className="cursor-grab hover:bg-accent p-2 rounded opacity-60 hover:opacity-100 touch-none"
            >
              <GripVertical className="w-4 h-4" />
            </div>
          </div>
        </div>
      </div>

      
      <div className="">
        <Card 
          ref={setNodeRef}
          style={style}
          className={`mb-4 gap-2 px-1.5 py-2 pt-3 lg:py-6 group hover:shadow-md transition-all duration-300 border border-border bg-card ${
            isDragging ? 'shadow-lg ring-2 ring-ring' : ''
          }`}
          onMouseEnter={() => setShowActions(true)}
          onMouseLeave={() => setShowActions(false)}
        >
          <CardHeader className="pb-1 hidden lg:block">
            <div className="flex justify-between items-start">
              <div className="flex-1 pr-4">
                <CardTitle className="text-lg font-semibold leading-tight">
                  {activity.title}
                </CardTitle>
                {/* <div className="flex items-center mt-2 text-sm text-gray-600">
                  <Clock className="w-4 h-4 mr-2" />
                  <span className="font-medium">{activity.duration}</span>
                </div> */}
              </div>
              
              <div className="flex items-center gap-2">
                {/* Action buttons - only show for activities in columns */}
                {isInColumn && (
                  <div className={`flex items-center gap-1 transition-opacity duration-200 ${
                    showActions ? 'opacity-100' : 'opacity-0'
                  }`}>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-6 w-6 p-0 hover:bg-accent"
                      onClick={handleEdit}
                    >
                      <Edit className="w-3 h-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-6 w-6 p-0 hover:bg-red-100"
                      onClick={handleDelete}
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                )}
                <div
                  {...attributes}
                  {...listeners}
                  className="cursor-grab hover:bg-accent p-1 rounded opacity-60 hover:opacity-100"
                >
                  <GripVertical className="w-4 h-4" />
                </div>
              </div>
            </div>
          </CardHeader>
          <div className='lg:hidden flex px-1 justify-evenly items-center'>
            <div className="flex items-center space-x-3">
              <div className={`w-8 h-8 rounded-lg flex px-1.5 items-center justify-center text-sm ${getCategoryColor(activity.category)}`}>
                {getCategoryIcon(activity.category)}
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-medium">{activity.title}</span>
                {/* <div className="flex items-center text-xs text-gray-500">
                  <Clock className="w-3 h-3 mr-1" />
                  {activity.duration}
                </div> */}
              </div>
            </div>
            <div className="flex items-center gap-2">
              {isInColumn && (
                <div className={`flex items-center gap-1 transition-opacity duration-200 `}>
                  {/* <Button
                    size="sm"
                    variant="ghost"
                    className="h-6 w-6 p-0 hover:bg-blue-100"
                    onClick={handleEdit}
                  >
                    <Edit className="w-3 h-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-6 w-6 p-0 hover:bg-red-100"
                    onClick={handleDelete}
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button> */}
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger>
                        <EllipsisVertical className="w-5 h-5 p-1 rounded-sm hover:bg-accent" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className='font-mono'>
                      <DropdownMenuLabel>Options</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={handleEdit}>Update</DropdownMenuItem>
                      <DropdownMenuItem onClick={handleDelete}>Delete</DropdownMenuItem>
                      {/* <DropdownMenuItem>Team</DropdownMenuItem>
                      <DropdownMenuItem>Subscription</DropdownMenuItem> */}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              )}
              <div
                {...listeners}
                className="cursor-grab hover:bg-gray-100 p-2 rounded opacity-60 hover:opacity-100 touch-none"
              >
                <GripVertical className="w-4 h-4" />
              </div>
            </div>
          </div>
          <CardContent className="pt-0 ">
            <div className=" flex-wrap items-center gap-2 mb-3 hidden lg:flex">
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
            
            <CardDescription className="leading-relaxed text-sm hidden lg:block">
              {activity.description}
            </CardDescription>
          </CardContent>
        </Card>
      </div>
      
      <EditActivityModal
        activity={activity}
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleSave}
      />

      
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[420px] font-mono">
          <DialogHeader>
            <DialogTitle className='mb-2 text-xl'>Delete activity?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete &quot;{activity.title}&quot; from your plan.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" className="cursor-pointer" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button  className="bg-red-600 hover:bg-red-400 cursor-pointer" onClick={confirmDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
