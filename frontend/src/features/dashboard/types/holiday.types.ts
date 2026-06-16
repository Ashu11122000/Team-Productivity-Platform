export interface Holiday {
  name: string;
  description: string;
  country: {
    id: string;
    name: string;
  };
  date: {
    iso: string;
  };
  type: string[];
}

export interface CalendarificResponse {
  response: {
    holidays: Holiday[];
  };
}