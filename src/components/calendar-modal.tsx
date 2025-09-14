import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  CalendarCell,
  CalendarGrid,
  CalendarGridBody,
  CalendarGridHeader,
  CalendarHeaderCell,
  CalendarHeading,
  RangeCalendar,
} from "@/components/ui/range-calendar";
import { Button } from "@/components/ui/button";
import { DateRange } from "react-aria-components";
import { CalendarDate } from "@internationalized/date";

interface CalendarModalProps {
  onRangeSelect: (range: {start: Date | null, end: Date | null}) => void;
  currentRange?: {start: Date | null, end: Date | null};
  savedWeekends?: Map<string, {start: Date, end: Date}>;
  countryCode?: string;
}

function CalendarModal({ onRangeSelect, currentRange, savedWeekends, countryCode = 'IN' }: CalendarModalProps) {
  const [selectedRange, setSelectedRange] = useState<DateRange | null>(null);
  const [holidaysByDate, setHolidaysByDate] = useState<Record<string, string[]>>({});
  const [isLoadingHolidays, setIsLoadingHolidays] = useState(false);
  const [holidayError, setHolidayError] = useState<string | null>(null);

  const dateToCalendarDate = (date: Date): CalendarDate => {
    return new CalendarDate(date.getFullYear(), date.getMonth() + 1, date.getDate());
  };

  const isDateInSavedWeekend = (date: CalendarDate): boolean => {
    if (!savedWeekends) return false;
    
    const checkDate = new Date(date.year, date.month - 1, date.day);
    
    for (const [key, weekend] of savedWeekends) {
      const startTime = weekend.start.getTime();
      const endTime = weekend.end.getTime();
      const checkTime = checkDate.getTime();
      
      if (checkTime >= startTime && checkTime <= endTime) {
        return true;
      }
    }
    return false;
  };

  const isDateInCurrentRange = (date: CalendarDate): boolean => {
    if (!currentRange || !currentRange.start || !currentRange.end) return false;
    
    const checkDate = new Date(date.year, date.month - 1, date.day);
    const startTime = currentRange.start.getTime();
    const endTime = currentRange.end.getTime();
    const checkTime = checkDate.getTime();
    
    return checkTime >= startTime && checkTime <= endTime;
  };

  const fmtCalDate = (date: CalendarDate): string => {
    const y = String(date.year).padStart(4, '0');
    const m = String(date.month).padStart(2, '0');
    const d = String(date.day).padStart(2, '0');
    return `${y}-${m}-${d}`;
  };

  useEffect(() => {
    const now = new Date();
    const timeMin = `${now.getFullYear()}-01-01`;
    const timeMax = `${now.getFullYear() + 1}-01-01`;
    const controller = new AbortController();

    async function loadHolidays() {
      setIsLoadingHolidays(true);
      setHolidayError(null);
      try {
        const qs = new URLSearchParams({ country: countryCode, timeMin, timeMax });
        const res = await fetch(`/api/holidays?${qs.toString()}`, { signal: controller.signal });
        const json = await res.json();
        if (!json?.success) {
          throw new Error(json?.error || 'Failed to fetch holidays');
        }
        const map: Record<string, string[]> = {};
        (json.data as Array<{ date: string; name: string; endDate?: string }> | undefined)?.forEach((h) => {
          if (!h?.date) return;
          if (!map[h.date]) map[h.date] = [];
          map[h.date].push(h.name);
        });
        setHolidaysByDate(map);
      } catch (e: unknown) {
        if (e instanceof Error && e.name !== 'AbortError') {
          console.error('Holiday fetch error:', e);
          setHolidayError(e.message || 'Unable to load holidays');
        }
      } finally {
        setIsLoadingHolidays(false);
      }
    }

    loadHolidays();
    return () => controller.abort();
  }, [countryCode]);

  useEffect(() => {
    if (currentRange && currentRange.start && currentRange.end) {
      const rangeValue: DateRange = {
        start: dateToCalendarDate(currentRange.start),
        end: dateToCalendarDate(currentRange.end)
      };
      setSelectedRange(rangeValue);
    }
  }, [currentRange]);

  const handleSelectionChange = (range: DateRange | null) => {
    setSelectedRange(range);
  };

  const handleConfirm = () => {
    if (selectedRange && selectedRange.start && selectedRange.end) {
      const startDate = new Date(selectedRange.start.year, selectedRange.start.month - 1, selectedRange.start.day);
      const endDate = new Date(selectedRange.end.year, selectedRange.end.month - 1, selectedRange.end.day);
      
      onRangeSelect({
        start: startDate,
        end: endDate
      });
    }
  };

  const formatCurrentRange = () => {
    if (currentRange && currentRange.start && currentRange.end) {
      const startDate = currentRange.start.toLocaleDateString('en-US', { 
        weekday: 'long', 
        month: 'short', 
        day: 'numeric' 
      });
      const endDate = currentRange.end.toLocaleDateString('en-US', { 
        weekday: 'long', 
        month: 'short', 
        day: 'numeric' 
      });
      return `Currently selected: ${startDate} - ${endDate}`;
    }
    return 'No range currently selected';
  };

  return (
    <DialogContent className='font-mono'>
        <DialogHeader>
        <DialogTitle>Choose Weekend Range</DialogTitle>
        <DialogDescription>
          Select your weekend dates. You can choose a standard 2-day weekend or extend it to include additional days for longer breaks.
        </DialogDescription>
        <div className="text-sm text-blue-600 font-medium mt-2">
          {formatCurrentRange()}
        </div>
        
        {savedWeekends && savedWeekends.size > 0 && (
          <div className="mt-3 p-3 bg-muted rounded-lg">
            <div className="text-sm font-medium mb-2">Legend:</div>
            <div className="flex flex-wrap gap-4 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-primary rounded"></div>
                <span>Currently Selected</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-accent border border-border rounded"></div>
                <span>Other Configured Weekends</span>
              </div>
            </div>
          </div>
        )}
        
        <div className='w-full h-auto mt-4'>
            <RangeCalendar 
              aria-label="Weekend dates" 
              className="bg-background rounded-lg px-2 py-3 border"
              value={selectedRange}
              onChange={handleSelectionChange}
            >
              <CalendarHeading className='text-lg flex pb-2'/>
              <CalendarGrid className='w-full'>
                  <CalendarGridHeader >
                  {(day) => <CalendarHeaderCell className='text-center'>{day}</CalendarHeaderCell>}
                  </CalendarGridHeader>
                  <CalendarGridBody>
                  {(date) => {
                    const isInSavedWeekend = isDateInSavedWeekend(date);
                    const isInCurrentRange = isDateInCurrentRange(date);
                    const key = fmtCalDate(date);
                    const holidayNames = holidaysByDate[key] || [];
                    const isHoliday = holidayNames.length > 0;
                    const baseClasses = `w-full ${
                      isInSavedWeekend && !isInCurrentRange
                        ? 'bg-accent border border-border text-foreground/80 hover:bg-accent/80'
                        : ''
                    } ${
                      isHoliday
                        ? "relative has-tooltip overflow-visible holiday-dot"
                        : ''
                    }`;

                    return (
                      <CalendarCell
                        date={date}
                        aria-label={isHoliday ? holidayNames.join(', ') : undefined}
                        {...(isHoliday ? ({ 'data-tooltip': holidayNames.join(', '), title: holidayNames.join(', ') } as any) : {})}
                        className={baseClasses}
                      />
                    );
                  }}
                  </CalendarGridBody>
              </CalendarGrid>
            </RangeCalendar>
        </div>
        <div className='flex justify-between items-center mt-4'>
          <Button 
            variant="outline"
            onClick={() => {
              const today = new Date();
              const dayOfWeek = today.getDay();
              const daysUntilSaturday = dayOfWeek === 6 ? 7 : (6 - dayOfWeek) % 7 || 7;
              const saturday = new Date(today);
              saturday.setDate(today.getDate() + daysUntilSaturday);
              
              const sunday = new Date(saturday);
              sunday.setDate(saturday.getDate() + 1);
              
              onRangeSelect({
                start: saturday,
                end: sunday
              });
            }}
            className='text-sm'
          >
            Standard Weekend
          </Button>
          <Button 
            onClick={handleConfirm} 
            isDisabled={!selectedRange || !selectedRange.start || !selectedRange.end}
            className='bg-primary text-primary-foreground hover:bg-primary/90'
          >
            Confirm Selection
          </Button>
        </div>
        </DialogHeader>
    </DialogContent>
  )
}

export default CalendarModal