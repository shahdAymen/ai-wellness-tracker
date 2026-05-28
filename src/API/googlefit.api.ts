import { request } from "./core/request";
import { API_ROOT_URL } from "./core/api.config";
// ─── Google Fit API ───────────────────────────────────────────────────────────
export interface GoogleFitSummary {
  steps?: number;
  calories?: number;
  distance?: number;
  heartRate?: number;
  activeMinutes?: number;
}

export const googleFitAPI = {
  getTodaySummary: () =>
    request<GoogleFitSummary>(`${API_ROOT_URL}/GoogleFit/today-summary`),
};
