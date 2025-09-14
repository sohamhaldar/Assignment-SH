import { NextRequest, NextResponse } from 'next/server';
import { getHolidayCalendarId } from '@/utils/holidayCalendars';
import type { GoogleCalendarEvent, HolidayEvent } from '@/types/holiday';


export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const country = (searchParams.get('country') || 'US').toUpperCase();
  const now = new Date();
  const defaultTimeMin = `${now.getFullYear()}-01-01`;
  const defaultTimeMax = `${now.getFullYear() + 1}-01-01`;
  const timeMin = searchParams.get('timeMin') || defaultTimeMin;
  const timeMax = searchParams.get('timeMax') || defaultTimeMax;

  const apiKey = process.env.GOOGLE_CALENDAR_API_KEY || process.env.NEXT_PUBLIC_GOOGLE_CALENDAR_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { success: false, error: 'Missing GOOGLE_CALENDAR_API_KEY in environment' },
      { status: 500 }
    );
  }

  const calendarId = getHolidayCalendarId(country);
  const encodedCalendarId = encodeURIComponent(calendarId);

  const params = new URLSearchParams({
    key: apiKey,
    singleEvents: 'true',
    orderBy: 'startTime',
    timeMin: new Date(timeMin).toISOString(),
    timeMax: new Date(timeMax).toISOString(),
    maxResults: '2500',
  });

  const url = `https://www.googleapis.com/calendar/v3/calendars/${encodedCalendarId}/events?${params.toString()}`;

  try {
    const res = await fetch(url, {
      headers: { 'Content-Type': 'application/json' },
      cache: 'no-store',
    });

    if (!res.ok) {
      const text = await res.text();
      return NextResponse.json(
        { success: false, error: `Upstream error ${res.status}: ${text}` },
        { status: res.status }
      );
    }

    const json = (await res.json()) as { items?: GoogleCalendarEvent[] };
    const items = json.items || [];

    const holidays: HolidayEvent[] = items.map((ev) => ({
      id: ev.id,
      name: ev.summary || 'Holiday',
      description: ev.description,
      status: ev.status,
      date: ev.start?.date || ev.start?.dateTime?.split('T')[0] || '',
      endDate: ev.end?.date || ev.end?.dateTime?.split('T')[0],
    }));

    return NextResponse.json({ success: true, data: holidays }, { status: 200 });
  } catch (err: unknown) {
    return NextResponse.json(
      { success: false, error: err instanceof Error ? err.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export const dynamic = 'force-dynamic';
