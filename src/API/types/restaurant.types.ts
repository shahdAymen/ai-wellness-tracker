export interface Restaurant {
  id: number;
  name: string;
  cuisine?: string;
  address?: string;
  rating?: number;
  distance?: string;
  distanceMeters?: number;
  latitude?: number;
  longitude?: number;
  imageUrl?: string;
  healthyOptions?: number;
  phone?: string;
  openNow?: boolean;
}