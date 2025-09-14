'use client'
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import React, { useState, useEffect } from 'react'
import { Dialog, DialogTrigger } from './ui/dialog';
import CalendarModal from './calendar-modal';
import { useDragDrop } from '@/contexts/DragDropContext';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

function PlannerHeader() {
  const { updateColumnsForDateRange, currentWeekendKey, isHydrated, columns, getSavedRange, getAllSavedRanges } = useDragDrop();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedRange, setSelectedRange] = useState<{start: Date | null, end: Date | null}>({ start: null, end: null });
  const [displayDates, setDisplayDates] = useState({ start: 0, end: 0 });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [openTip, setOpenTip] = useState<null | 'calendar' | 'prev' | 'next'>(null);

  useEffect(() => {
    if (!isHydrated) return;

    if (currentWeekendKey) {
      const savedRange = getSavedRange(currentWeekendKey);
      if (savedRange) {
        setSelectedRange({ start: savedRange.start, end: savedRange.end });
        updateDisplayDates(savedRange.start, savedRange.end);
        setCurrentDate(savedRange.start);
      } else {
        const [y, m, d] = currentWeekendKey.split('-').map(Number);
        const saturday = new Date(Number(y), Number(m), Number(d));
        const days = Math.max(1, columns.length || 2);
        const end = new Date(saturday);
        end.setDate(saturday.getDate() + (days - 1));
        setSelectedRange({ start: saturday, end });
        updateDisplayDates(saturday, end);
        setCurrentDate(saturday);
      }
    } else {
      const now = new Date();
      setCurrentDate(now);
      calculateUpcomingWeekend(now);
    }
  }, [isHydrated]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName?.toLowerCase();
      if (tag === 'input' || tag === 'textarea' || (e.target as HTMLElement)?.isContentEditable) return;

      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        navigateToPreviousWeekend();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        navigateToNextWeekend();
      } else if (e.key.toLowerCase() === 'c') {
        e.preventDefault();
        setIsDialogOpen(!isDialogOpen);
      } else if (e.key === 'Escape' && isDialogOpen) {
        e.preventDefault();
        setIsDialogOpen(false);
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isDialogOpen, selectedRange]);

  const calculateUpcomingWeekend = (referenceDate: Date) => {
    const today = new Date(referenceDate);
    const dayOfWeek = today.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
    
    const weekendReference = new Date(today);
    
    if (dayOfWeek === 6) { 
    } else if (dayOfWeek === 0) { 
      weekendReference.setDate(today.getDate() + 6);
    } else {
      const daysUntilSaturday = (6 - dayOfWeek) % 7;
      weekendReference.setDate(today.getDate() + daysUntilSaturday);
    }
    
    const weekendConfig = getWeekendConfiguration(weekendReference);
    
    setSelectedRange({ start: weekendConfig.start, end: weekendConfig.end });
    updateDisplayDates(weekendConfig.start, weekendConfig.end);
    updateColumnsForDateRange(weekendConfig.start, weekendConfig.end);
  };

  const updateDisplayDates = (startDate: Date, endDate: Date) => {
    setDisplayDates({
      start: startDate.getDate(),
      end: endDate.getDate()
    });
  };

  const getWeekendKey = (date: Date) => {
    const saturday = new Date(date);
    const dayOfWeek = saturday.getDay();
    
    
    if (dayOfWeek !== 6) {
      if (dayOfWeek === 0) { 
        saturday.setDate(saturday.getDate() - 1); 
      } else { 
        const daysToSaturday = (6 - dayOfWeek);
        saturday.setDate(saturday.getDate() + daysToSaturday);
      }
    }
    
    return `${saturday.getFullYear()}-${saturday.getMonth()}-${saturday.getDate()}`;
  };

  const getWeekendConfiguration = (referenceDate: Date) => {
    const key = getWeekendKey(referenceDate);
    const saved = getSavedRange(key);
    
    if (saved) {
      return saved;
    }
    
    const saturday = new Date(referenceDate);
    const dayOfWeek = saturday.getDay();
    
    if (dayOfWeek !== 6) {
      if (dayOfWeek === 0) { 
        saturday.setDate(saturday.getDate() - 1); 
      } else { 
        const daysToSaturday = (6 - dayOfWeek);
        saturday.setDate(saturday.getDate() + daysToSaturday);
      }
    }
    
    const sunday = new Date(saturday);
    sunday.setDate(saturday.getDate() + 1);
    
    return { start: saturday, end: sunday };
  };

  const formatDateRange = () => {
    if (selectedRange.start && selectedRange.end) {
      const startDay = selectedRange.start.getDate();
      const endDay = selectedRange.end.getDate();
      const startMonth = selectedRange.start.getMonth();
      const endMonth = selectedRange.end.getMonth();
      
      
      if (startMonth !== endMonth) {
        const startMonthName = selectedRange.start.toLocaleDateString('en-US', { month: 'short' });
        const endMonthName = selectedRange.end.toLocaleDateString('en-US', { month: 'short' });
        return `${startMonthName} ${startDay} - ${endMonthName} ${endDay}`;
      } else {
        
        return `${startDay}-${endDay}`;
      }
    }
    return `${displayDates.start}-${displayDates.end}`;
  };

  const handleDateRangeSelect = (range: {start: Date | null, end: Date | null}) => {
    if (range.start && range.end) {
      
      setSelectedRange(range);
      updateDisplayDates(range.start, range.end);
      updateColumnsForDateRange(range.start, range.end);
      
      setCurrentDate(range.start);
      setIsDialogOpen(false);
    }
  };

  const getCurrentMonthYear = () => {
    return currentDate.toLocaleDateString('en-US', { 
      month: 'long', 
      year: 'numeric' 
    });
  };

  const navigateToPreviousWeekend = () => {
    if (selectedRange.start) {
      
      const searchDate = new Date(selectedRange.start);
      searchDate.setDate(selectedRange.start.getDate() - 1);

      
      const previousWeekReference = new Date(searchDate);

      
      const dayOfWeek = previousWeekReference.getDay();
      if (dayOfWeek !== 6) {
        if (dayOfWeek === 0) {
          
          previousWeekReference.setDate(previousWeekReference.getDate() - 1);
        } else {
          
          const daysToSaturday = dayOfWeek + 1; 
          previousWeekReference.setDate(previousWeekReference.getDate() - daysToSaturday);
        }
      }

      
      const weekendKey = getWeekendKey(previousWeekReference);
      const savedRange = getSavedRange(weekendKey);

      const isSameAsCurrent = (r: { start: Date; end: Date }) =>
        r.start.getTime() === selectedRange.start!.getTime() &&
        (!!selectedRange.end && r.end.getTime() === selectedRange.end.getTime());

      if (savedRange && !isSameAsCurrent(savedRange)) {
        setSelectedRange({ start: savedRange.start, end: savedRange.end });
        updateDisplayDates(savedRange.start, savedRange.end);
        updateColumnsForDateRange(savedRange.start, savedRange.end);
        setCurrentDate(savedRange.start);
        return;
      }

      
      if (savedRange && isSameAsCurrent(savedRange)) {
        const altRef = new Date(previousWeekReference);
        altRef.setDate(altRef.getDate() - 7);
        const altKey = getWeekendKey(altRef);
        const altSaved = getSavedRange(altKey);
        const target = altSaved ?? getWeekendConfiguration(altRef);

        
        setSelectedRange({ start: target.start, end: target.end });
        updateDisplayDates(target.start, target.end);
        updateColumnsForDateRange(target.start, target.end);
        setCurrentDate(target.start);
        return;
      }

      const weekendConfig = getWeekendConfiguration(previousWeekReference);
      setSelectedRange({ start: weekendConfig.start, end: weekendConfig.end });
      updateDisplayDates(weekendConfig.start, weekendConfig.end);
      updateColumnsForDateRange(weekendConfig.start, weekendConfig.end);
      setCurrentDate(weekendConfig.start);
    }
  };

  const navigateToNextWeekend = () => {
    if (selectedRange.start && selectedRange.end) {
      const searchDate = new Date(selectedRange.end);
      searchDate.setDate(selectedRange.end.getDate() + 1);

      const nextWeekReference = new Date(searchDate);
      const dow = nextWeekReference.getDay();
      if (dow !== 6) {
        const daysToSaturday = (6 - dow + 7) % 7;
        nextWeekReference.setDate(nextWeekReference.getDate() + (daysToSaturday === 0 ? 7 : daysToSaturday));
      }

      const weekendKey = getWeekendKey(nextWeekReference);
      const savedRange = getSavedRange(weekendKey);

      const isSameAsCurrent = (r: { start: Date; end: Date }) =>
        r.start.getTime() === selectedRange.start!.getTime() &&
        (!!selectedRange.end && r.end.getTime() === selectedRange.end.getTime());

      if (savedRange && !isSameAsCurrent(savedRange)) {
        setSelectedRange({ start: savedRange.start, end: savedRange.end });
        updateDisplayDates(savedRange.start, savedRange.end);
        updateColumnsForDateRange(savedRange.start, savedRange.end);
        setCurrentDate(savedRange.start);
        return;
      }

      if (savedRange && isSameAsCurrent(savedRange)) {
        const altRef = new Date(nextWeekReference);
        altRef.setDate(altRef.getDate() + 7);
        const altKey = getWeekendKey(altRef);
        const altSaved = getSavedRange(altKey);
        const target = altSaved ?? getWeekendConfiguration(altRef);

        setSelectedRange({ start: target.start, end: target.end });
        updateDisplayDates(target.start, target.end);
        updateColumnsForDateRange(target.start, target.end);
        setCurrentDate(target.start);
        return;
      }

      const weekendConfig = getWeekendConfiguration(nextWeekReference);
      setSelectedRange({ start: weekendConfig.start, end: weekendConfig.end });
      updateDisplayDates(weekendConfig.start, weekendConfig.end);
      updateColumnsForDateRange(weekendConfig.start, weekendConfig.end);
      setCurrentDate(weekendConfig.start);
    }
  };

  return (
    <div className='h-auto w-full font-mono flex flex-col items-start justify-start p-2 md:p-6 pb-2 md:pb-6'>
        <div className='px-2 flex flex-col justify-center sm:flex-row items-center sm:items-center sm:justify-between w-full h-full space-y-4 md:space-y-0 md:space-x-4 mb-2'>
            <h1 className='font-bold text-3xl lg:text-3xl mt-4 md:mt-0'>{getCurrentMonthYear()}</h1>
            
            <div className='flex items-center space-x-2 gap-2 md:gap-4'>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <Popover open={openTip === 'calendar'} onOpenChange={(o) => setOpenTip(o ? 'calendar' : null)}>
                    <PopoverTrigger asChild onMouseEnter={() => setOpenTip('calendar')} onMouseLeave={() => setOpenTip(null)}>
                      <DialogTrigger asChild>
                        <Button
                          type="button"
                          variant="ghost"
                          aria-label="Open calendar (C)"
                          className='p-2 rounded-lg hover:bg-accent'
                        >
                          <Calendar className='w-6 h-6' />
                        </Button>
                      </DialogTrigger>
                    </PopoverTrigger>
                    <PopoverContent side="top" align="center" className="px-2 py-1 text-xs w-fit font-mono">
                      Open calendar (C)
                    </PopoverContent>
                  </Popover>
                  <CalendarModal 
                    onRangeSelect={handleDateRangeSelect} 
                    currentRange={selectedRange}
                    savedWeekends={new Map(Object.entries(getAllSavedRanges()))}
                  />
                </Dialog>
                <h1 className='font-bold text-3xl lg:text-3xl'>{formatDateRange()}</h1>
                <div className='flex items-center gap-1 md:gap-2'>
                        <Popover open={openTip === 'prev'} onOpenChange={(o) => setOpenTip(o ? 'prev' : null)}>
                          <PopoverTrigger asChild onMouseEnter={() => setOpenTip('prev')} onMouseLeave={() => setOpenTip(null)}>
                            <Button
                              type="button"
                              aria-label="Previous weekend (←)"
                              className='w-10 h-10 lg:w-12 lg:h-12 font-bold bg-primary text-primary-foreground rounded-full p-2 hover:bg-primary/90 transition-colors'
                              onClick={navigateToPreviousWeekend}
                            >
                              <ChevronLeft className='w-6 h-6' />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent side="top" align="center" className="w-fit font-mono px-2 py-1 text-xs">
                            Previous weekend (←)
                          </PopoverContent>
                        </Popover>
                        <Popover open={openTip === 'next'} onOpenChange={(o) => setOpenTip(o ? 'next' : null)}>
                          <PopoverTrigger asChild onMouseEnter={() => setOpenTip('next')} onMouseLeave={() => setOpenTip(null)}>
                            <Button
                              type="button"
                              aria-label="Next weekend (→)"
                              className='w-10 h-10 lg:w-12 lg:h-12 font-bold bg-primary text-primary-foreground rounded-full p-2 hover:bg-primary/90 transition-colors'
                              onClick={navigateToNextWeekend}
                            >
                              <ChevronRight className='w-6 h-6' />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent side="top" align="center" className="px-2 py-1 text-xs w-fit font-mono">
                            Next weekend (→)
                          </PopoverContent>
                        </Popover>
                    </div>
            </div>
        </div> 
        

    </div>
  )
}

export default PlannerHeader;