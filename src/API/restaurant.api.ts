import { API_ROOT_URL } from './core/api.config';
import { request } from './core/request';
import { Restaurant } from './types/restaurant.types';
export const restaurantAPI = {
  getNearby: (lat: number, lng: number) =>
    request<Restaurant[]>(`${API_ROOT_URL}/Restaurant/nearby?Lat=${lat}&Lng=${lng}`),

  adminGetAll: () =>
    request<Restaurant[]>(`${API_ROOT_URL}/Restaurant/Admin`),

  adminGetById: (id: number) =>
    request<Restaurant>(`${API_ROOT_URL}/Restaurant/Admin/${id}`),
};