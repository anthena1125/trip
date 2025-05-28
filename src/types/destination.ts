export interface Attraction {
  name: string;
  description: string;
  location: string;
}

export interface Destination {
  id: string;
  name: string;
  location: string;
  description: string;
  imageUrl: string;
  tags: string[];
  mbtiTypes: string[];
  mbtiReasons?: Record<string, string>;
  attractions?: Attraction[];
  bestTimeToVisit?: string;
  recommendedStay?: string;
  avgCost?: string;
  travelTips?: string[];
}