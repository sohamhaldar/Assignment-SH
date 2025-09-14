
export const COUNTRY_CALENDAR_OVERRIDES: Record<string, string> = {
  
  US: 'en.usa#holiday@group.v.calendar.google.com',
  GB: 'en.great_britain#holiday@group.v.calendar.google.com',
  IN: 'en.indian#holiday@group.v.calendar.google.com',
  CA: 'en.canadian#holiday@group.v.calendar.google.com',
  AU: 'en.australian#holiday@group.v.calendar.google.com',
  NZ: 'en.new_zealand#holiday@group.v.calendar.google.com',
  IE: 'en.irish#holiday@group.v.calendar.google.com',
  SG: 'en.singapore#holiday@group.v.calendar.google.com',
  ZA: 'en.sa#holiday@group.v.calendar.google.com',
  PH: 'en.philippines#holiday@group.v.calendar.google.com',
  MY: 'en.malaysia#holiday@group.v.calendar.google.com',
  
};

export function getHolidayCalendarId(countryCode: string): string {
  const cc = (countryCode || 'US').toUpperCase();
  if (COUNTRY_CALENDAR_OVERRIDES[cc]) return COUNTRY_CALENDAR_OVERRIDES[cc];
  return `en.${cc.toLowerCase()}#holiday@group.v.calendar.google.com`;
}
