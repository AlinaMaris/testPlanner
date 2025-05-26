export interface Destination {
  id: string;
  name: string;
  country: string;
  description?: string;
}

export interface ItineraryItem {
  id: string;
  day: number;
  time: string;
  activity: string;
  location: string;
  notes?: string;
}

export interface Trip {
  id: string;
  title: string;
  destination: Destination;
  startDate: string;
  endDate: string;
  description: string;
  budget?: number;
  itinerary: ItineraryItem[];
  createdAt: string;
  updatedAt: string;
}

export interface TripFormData {
  title: string;
  destinationName: string;
  destinationCountry: string;
  startDate: string;
  endDate: string;
  description: string;
  budget?: number;
}

export interface ItineraryFormData {
  day: number;
  time: string;
  activity: string;
  location: string;
  notes?: string;
}