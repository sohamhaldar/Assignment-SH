'use client'
import React, { useState } from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { DraggableActivity } from './draggable-activity';
import { Column } from '@/types/activity';
import { Button } from './ui/button';
import { Dialog, DialogContent } from './ui/dialog';
import ActivitySection from './activity-section';

interface DroppableColumnProps {
  column: Column;
}

export function DroppableColumn({ column }: DroppableColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: column.id,
  });
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="bg-muted p-4 rounded-md h-full flex flex-col">
      <div className="mb-4 text-center">
        <h3 className="text-lg font-semibold whitespace-pre-line leading-tight">
          {column.title}
        </h3>
        <span className="text-sm font-normal text-muted-foreground">
          ({column.activities.length} activities)
        </span>
      </div>
      
      <div
        ref={setNodeRef}
        className={`flex-1 transition-colors duration-200 rounded-lg p-2 overflow-y-auto scrollbar scrollbar-track-transparent scrollbar-thumb-primary/70 min-h-0 ${
          isOver ? 'bg-accent border-2 border-dashed border-ring' : 'border-2 border-transparent'
        }`}
      >
        <SortableContext
          items={column.activities.map(activity => activity.id)}
          strategy={verticalListSortingStrategy}
        >
          {column.activities.length === 0 ? (
            <div className="flex items-center justify-center h-32 text-muted-foreground text-sm border-2 border-dashed border-border rounded-lg">
              Drop activities here
            </div>
          ) : (
            <div className="space-y-2">
              {column.activities.map((activity) => (
                <DraggableActivity
                  key={activity.id}
                  activity={activity}
                  isInColumn={true}
                />
              ))}
            </div>
          )}
        </SortableContext>
        
      </div>
  <Button className="md:hidden mt-2 px-3 py-1 bg-primary text-primary-foreground font-bold rounded-xl hover:bg-primary/90 transition-colors" onClick={() => setIsModalOpen(true)}>
          + Add Activity
        </Button>
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto scrollbar scrollbar-track-transparent scrollbar-thumb-primary/70">
          <ActivitySection currentColoumnId={column.id} setActivityModalOpen={setIsModalOpen} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
