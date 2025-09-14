'use client'
import React from 'react';
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import ActivitySection from "@/components/activity-section";
import PlannerComponent from "@/components/planner-component";
import PlannerHeader from "@/components/planner-header";
import ExploreNearbySection from "@/components/explore-nearby-section";
import ThemeSelector from "@/components/theme-selector";
import { DragDropProvider, useDragDrop } from "@/contexts/DragDropContext";
import { DraggableActivity } from '@/components/draggable-activity';
import { Activity } from '@/types/activity';
import SharePlan from '@/components/shareplan';

export default function HomeContent() {
  const { columns, setColumns } = useDragDrop();
  const [activeId, setActiveId] = React.useState<string | null>(null);
  const [activeActivity, setActiveActivity] = React.useState<Activity | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  function handleDragStart(event: DragStartEvent) {
    const { active } = event;
    setActiveId(active.id as string);

    let activity: Activity | null = null;
    for (const column of columns) {
      activity = column.activities.find(act => act.id === active.id) || null;
      if (activity) break;
    }
    
    setActiveActivity(activity);
  }

  function handleDragOver(event: DragOverEvent) {
    const { active, over } = event;
    
    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;
    
    const activeColumn = columns.find(col => 
      col.activities.some(activity => activity.id === activeId)
    );

    if (!activeColumn) return;

    let overColumn = columns.find(col => col.id === overId);
    
    if (!overColumn) {
      for (const column of columns) {
        if (column.activities.some(act => act.id === overId)) {
          overColumn = column;
          break;
        }
      }
    }

    if (!overColumn || activeColumn.id === overColumn.id) return;

    const activityToMove = activeColumn.activities.find(act => act.id === activeId);
    if (!activityToMove) return;

    setColumns(prev => prev.map(col => {
      if (col.id === activeColumn.id) {
        return {
          ...col,
          activities: col.activities.filter(act => act.id !== activeId)
        };
      }
      if (col.id === overColumn.id) {
        const newActivities = [...col.activities];
        
        if (overId !== overColumn.id) {
          const overIndex = col.activities.findIndex(act => act.id === overId);
          if (overIndex !== -1) {
            newActivities.splice(overIndex, 0, activityToMove);
            return {
              ...col,
              activities: newActivities
            };
          }
        }
        
        return {
          ...col,
          activities: [...col.activities, activityToMove]
        };
      }
      return col;
    }));
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    setActiveId(null);
    setActiveActivity(null);

    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    const activeColumn = columns.find(col => 
      col.activities.some(activity => activity.id === activeId)
    );

    if (!activeColumn) return;

    const overActivity = activeColumn.activities.find(act => act.id === overId);
    if (overActivity) {
      const activeIndex = activeColumn.activities.findIndex(act => act.id === activeId);
      const overIndex = activeColumn.activities.findIndex(act => act.id === overId);

      if (activeIndex !== -1 && overIndex !== -1 && activeIndex !== overIndex) {
        setColumns(prev => prev.map(col => {
          if (col.id === activeColumn.id) {
            return {
              ...col,
              activities: arrayMove(col.activities, activeIndex, overIndex)
            };
          }
          return col;
        }));
      }
    }
  }

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className="h-screen w-full flex flex-col-reverse md:flex-row ">
        <div className="w-full md:w-1/4 border-r-0 lg:border-r hidden md:flex md:h-full overflow-hidden border-b lg:border-b-0">
          <ActivitySection/>
        </div>
        <div className="flex-1 relative overflow-hidden flex flex-col h-full">
          <PlannerHeader/>
          <div className="flex-1 overflow-hidden">
            <PlannerComponent/>
          </div>
          <div className='flex w-full md:hidden border-t p-2 justify-evenly items-center'>
            <ExploreNearbySection/>
            <ThemeSelector/>
            <SharePlan/>
          </div>
        </div>
        <div className="w-full hidden md:w-24 h-auto md:h-full lg:flex flex-row md:flex-col items-center justify-center md:justify-start p-2 lg:p-4 border-t lg:border-t-0 lg:border-l pt-2 lg:pt-8 space-x-4 lg:space-x-0 lg:space-y-4">
          <ExploreNearbySection/>
          <ThemeSelector align='start' side='right'/>
          <SharePlan align='start' side='right'/>
        </div>
      </div>
      
      <DragOverlay>
        {activeActivity ? (
          <div className="rotate-5">
            <DraggableActivity activity={activeActivity} />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}


