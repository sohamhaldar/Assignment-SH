'use client'
import React, { createContext, useContext, useEffect, useMemo, useState, ReactNode } from 'react';
import { Activity, Column } from '@/types/activity';

interface DragDropContextType {
  columns: Column[];
  setColumns: React.Dispatch<React.SetStateAction<Column[]>>;
  availableActivities: Activity[];
  setAvailableActivities: React.Dispatch<React.SetStateAction<Activity[]>>;
  deleteAvailableActivity: (activityId: string) => void;
  addActivityToColumn: (activity: Activity, columnId: string) => void;
  editActivity: (activityId: string, updatedActivity: Activity) => void;
  deleteActivity: (activityId: string) => void;
  updateColumnsForDateRange: (startDate: Date, endDate: Date) => void;
  
  currentWeekendKey?: string | null;
  isHydrated: boolean;
  getSavedRange: (weekendKey: string) => {start: Date, end: Date} | null;
  getAllSavedRanges: () => Record<string, {start: Date, end: Date}>;
  cleanupOldRanges: (newStartDate: Date, newEndDate: Date) => void;
}

const DragDropContext = createContext<DragDropContextType | undefined>(undefined);

const initialAvailableActivities: Activity[] = [
  {
    id: 'act-1',
    title: 'Morning Yoga',
    description: 'Start your day with relaxing yoga session in the park',
    duration: '1 hour',
    category: 'Wellness',
    location: 'Park'
  },
  {
    id: 'act-2',
    title: 'Coffee Shop Visit',
    description: 'Enjoy a freshly brewed coffee and pastry at local cafe',
    duration: '45 minutes',
    category: 'Food',
    location: 'Cafe'
  },
  {
    id: 'act-3',
    title: 'Museum Tour',
    description: 'Explore the local art museum and learn about history',
    duration: '2 hours',
    category: 'Culture',
    location: 'Museum'
  },
  {
    id: 'act-4',
    title: 'Beach Walk',
    description: 'Take a peaceful walk along the beach during sunset',
    duration: '1.5 hours',
    category: 'Outdoors',
    location: 'Beach'
  },
  {
    id: 'act-5',
    title: 'Shopping',
    description: 'Browse through local markets and shops',
    duration: '2 hours',
    category: 'Shopping',
    location: 'Mall'
  },
  {
    id: 'act-6',
    title: 'Movie Night',
    description: 'Watch the latest blockbuster at the cinema',
    duration: '2.5 hours',
    category: 'Entertainment',
    location: 'Cinema'
  }
];

const initialColumns: Column[] = [];

export function DragDropProvider({ children }: { children: ReactNode }) {
  const [columnsData, setColumnsData] = useState<Record<string, Activity[]>>({});
  const [ranges, setRanges] = useState<Record<string, {start: string, end: string}>>({});
  const [currentWeekendKey, setCurrentWeekendKey] = useState<string | null>(null);
  const [columnsState, setColumnsState] = useState<Column[]>(initialColumns);
  const [availableActivities, setAvailableActivities] = useState<Activity[]>(initialAvailableActivities);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    try {
      const columnsRaw = typeof window !== 'undefined' ? window.localStorage.getItem('planner.columnsData') : null;
      const rangesRaw = typeof window !== 'undefined' ? window.localStorage.getItem('planner.ranges') : null;
      const currentKey = typeof window !== 'undefined' ? window.localStorage.getItem('planner.currentWeekendKey') : null;

      if (columnsRaw) {
        setColumnsData(JSON.parse(columnsRaw));
      }
      if (rangesRaw) {
        setRanges(JSON.parse(rangesRaw));
      }
      const availRaw = typeof window !== 'undefined' ? window.localStorage.getItem('planner.availableActivities') : null;
      if (availRaw) {
        try {
          const parsed = JSON.parse(availRaw);
          if (Array.isArray(parsed)) {
            setAvailableActivities(parsed);
          }
        } catch {}
      }
      if (currentKey) {
        setCurrentWeekendKey(currentKey);
        
        const savedColumnsData = columnsRaw ? JSON.parse(columnsRaw) : {};
        const savedRanges = rangesRaw ? JSON.parse(rangesRaw) : {};
        if (savedRanges[currentKey]) {
          restoreColumnsFromData(savedColumnsData, savedRanges[currentKey]);
        }
      }
      setIsHydrated(true);
    } catch {
      setIsHydrated(true);
    }
  }, []);

  
  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        window.localStorage.setItem('planner.columnsData', JSON.stringify(columnsData));
      }
    } catch {  }
  }, [columnsData]);

  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        window.localStorage.setItem('planner.ranges', JSON.stringify(ranges));
      }
    } catch { }
  }, [ranges]);

  
  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        window.localStorage.setItem('planner.availableActivities', JSON.stringify(availableActivities));
      }
    } catch {  }
  }, [availableActivities]);

  useEffect(() => {
    try {
      if (typeof window !== 'undefined' && currentWeekendKey) {
        window.localStorage.setItem('planner.currentWeekendKey', currentWeekendKey);
      }
    } catch {  }
  }, [currentWeekendKey]);

  
  const restoreColumnsFromData = (savedColumnsData: Record<string, Activity[]>, range: {start: string, end: string}) => {
    const startDate = new Date(range.start);
    const endDate = new Date(range.end);
    const timeDiff = endDate.getTime() - startDate.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24)) + 1;

    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const newColumns: Column[] = [];

    for (let i = 0; i < daysDiff; i++) {
      const currentDate = new Date(startDate);
      currentDate.setDate(startDate.getDate() + i);

      const dayName = dayNames[currentDate.getDay()];
      const dayNumber = currentDate.getDate();
      const monthName = currentDate.toLocaleDateString('en-US', { month: 'short' });

      const dateKey = `${currentDate.getFullYear()}-${currentDate.getMonth()}-${dayNumber}`;
      const title = `${dayName}\n${monthName} ${dayNumber}`;
      const activities = savedColumnsData[dateKey] || [];

      newColumns.push({ id: dateKey, title, activities });
    }

    setColumnsState(newColumns);
  };

  
  const setColumns: React.Dispatch<React.SetStateAction<Column[]>> = (updater) => {
    setColumnsState(prev => {
      const next = typeof updater === 'function' ? (updater as (prev: Column[]) => Column[])(prev) : updater;
      
      
      if (currentWeekendKey) {
        const newColumnsData = { ...columnsData };
        next.forEach(column => {
          newColumnsData[column.id] = column.activities;
        });
        setColumnsData(newColumnsData);
      }
      
      return next;
    });
  };

  
  const getWeekendKey = (date: Date) => {
    const saturday = new Date(date);
    const dow = saturday.getDay();
    if (dow !== 6) {
      if (dow === 0) {
        saturday.setDate(saturday.getDate() - 1);
      } else {
        saturday.setDate(saturday.getDate() + (6 - dow));
      }
    }
    return `${saturday.getFullYear()}-${saturday.getMonth()}-${saturday.getDate()}`;
  };

  const addActivityToColumn = (activity: Activity, columnId: string) => {
    setColumns(prev => prev.map(col => {
      if (col.id === columnId) {
        
        const newActivity = {
          ...activity,
          id: `${activity.id}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
        };
        return {
          ...col,
          activities: [...col.activities, newActivity]
        };
      }
      return col;
    }));
  };

  const editActivity = (activityId: string, updatedActivity: Activity) => {

    setColumns(prev => prev.map(col => ({
      ...col,
      activities: col.activities.map(act => 
        act.id === activityId ? updatedActivity : act
      )
    })));
    
    
    setAvailableActivities(prev => prev.map(act =>
      act.id === activityId ? updatedActivity : act
    ));
  };

  const deleteActivity = (activityId: string) => {
    
    setColumns(prev => prev.map(col => ({
      ...col,
      activities: col.activities.filter(act => act.id !== activityId)
    })));
    
  };

  const deleteAvailableActivity = (activityId: string) => {
    setAvailableActivities(prev => prev.filter(act => act.id !== activityId));
  };

  const updateColumnsForDateRange = (startDate: Date, endDate: Date) => {
    const weekendKey = getWeekendKey(startDate);
    setCurrentWeekendKey(weekendKey);
    
    const allWeekendKeys: string[] = [];
    const currentSaturday = new Date(startDate);
    
    const startDow = currentSaturday.getDay();
    if (startDow !== 6) {
      if (startDow === 0) {
        currentSaturday.setDate(currentSaturday.getDate() - 1);
      } else {
        currentSaturday.setDate(currentSaturday.getDate() + (6 - startDow));
      }
    }
    
    
    if (currentSaturday > endDate) {
      currentSaturday.setDate(currentSaturday.getDate() - 7);
    }
    
    
    while (currentSaturday <= endDate) {
      allWeekendKeys.push(getWeekendKey(currentSaturday));
      currentSaturday.setDate(currentSaturday.getDate() + 7);
    }
    
    
    const newRangeStart = startDate.getTime();
    const newRangeEnd = endDate.getTime();
    const rangeData = {
      start: startDate.toISOString(),
      end: endDate.toISOString()
    };
    
    setRanges(prev => {
      const updated = { ...prev };
      
      
      Object.keys(updated).forEach(key => {
        const existingRange = updated[key];
        const existingStart = new Date(existingRange.start).getTime();
        const existingEnd = new Date(existingRange.end).getTime();
        
        
        const hasOverlap = !(newRangeEnd < existingStart || newRangeStart > existingEnd);
        
        
        const isDifferent = !(existingStart === newRangeStart && existingEnd === newRangeEnd);
        
        if (hasOverlap && isDifferent) {
          delete updated[key];
        }
      });
      
      
      allWeekendKeys.forEach(key => {
        updated[key] = rangeData;
      });
      
      return updated;
    });

    
    const timeDiff = endDate.getTime() - startDate.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24)) + 1; 

    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const newColumns: Column[] = [];

    for (let i = 0; i < daysDiff; i++) {
      const currentDate = new Date(startDate);
      currentDate.setDate(startDate.getDate() + i);

      const dayName = dayNames[currentDate.getDay()];
      const dayNumber = currentDate.getDate();
      const monthName = currentDate.toLocaleDateString('en-US', { month: 'short' });

      const dateKey = `${currentDate.getFullYear()}-${currentDate.getMonth()}-${dayNumber}`;
      const title = `${dayName}\n${monthName} ${dayNumber}`;
      const activities = columnsData[dateKey] || [];

      newColumns.push({ id: dateKey, title, activities });
    }

    setColumnsState(newColumns);
  };

  
  const getSavedRange = (weekendKey: string) => {
    const range = ranges[weekendKey];
    if (!range) return null;
    return {
      start: new Date(range.start),
      end: new Date(range.end)
    };
  };

  const getAllSavedRanges = () => {
    const result: Record<string, {start: Date, end: Date}> = {};
    Object.entries(ranges).forEach(([key, range]) => {
      result[key] = {
        start: new Date(range.start),
        end: new Date(range.end)
      };
    });
    return result;
  };

  
  const cleanupOldRanges = (newStartDate: Date, newEndDate: Date) => {
    const newRangeStart = newStartDate.getTime();
    const newRangeEnd = newEndDate.getTime();
    
    
    const overlappingKeys: string[] = [];
    Object.entries(ranges).forEach(([key, range]) => {
      const existingStart = new Date(range.start).getTime();
      const existingEnd = new Date(range.end).getTime();
      
      const hasOverlap = !(newRangeEnd < existingStart || newRangeStart > existingEnd);
      
      const isDifferent = !(existingStart === newRangeStart && existingEnd === newRangeEnd);
      
      if (hasOverlap && isDifferent) {
        overlappingKeys.push(key);
      }
    });
    
    if (overlappingKeys.length > 0) {
      setRanges(prev => {
        const updated = { ...prev };
        overlappingKeys.forEach(key => {
          delete updated[key];
        });
        return updated;
      });
    }
  };

  return (
    <DragDropContext.Provider value={{ 
      columns: columnsState, 
      setColumns, 
      availableActivities, 
  setAvailableActivities,
  deleteAvailableActivity,
      addActivityToColumn,
      editActivity,
      deleteActivity,
      updateColumnsForDateRange,
      currentWeekendKey,
      isHydrated,
      getSavedRange,
      getAllSavedRanges,
      cleanupOldRanges
    }}>
      {children}
    </DragDropContext.Provider>
  );
}

export function useDragDrop() {
  const context = useContext(DragDropContext);
  if (context === undefined) {
    throw new Error('useDragDrop must be used within a DragDropProvider');
  }
  return context;
}
