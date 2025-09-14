export interface Activity {
  id: string;
  title: string;
  description: string;
  duration: string;
  category: string;
  location: string;
}

export interface Column {
  id: string;
  title: string;
  activities: Activity[];
}

export type ColumnType = 'saturday' | 'sunday' | 'activities';
