export interface WaterEntry {
  id: number;
  amount: number;
  loggedAt?: string;
  date?: string;
}

export interface WaterToday {
  totalAmount: number;
  goal?: number;
  entries?: WaterEntry[];
}
