
export interface HolidayEvent {
  id: string;
  name: string;
  date: string; 
  endDate?: string; 
  description?: string;
  status?: string;
}


export interface GoogleCalendarEvent {
  id: string;
  summary?: string;
  description?: string;
  status?: string;
  start: { date?: string; dateTime?: string; timeZone?: string };
  end: { date?: string; dateTime?: string; timeZone?: string };
}
