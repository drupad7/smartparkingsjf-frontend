export interface ParkingSlot {
  id: string;
  position: { row: number; col: number };
  isOccupied: boolean;
  carId?: string;
}

export interface Car {
  id: string;
  arrivalTime: number;
  assignedSlotId?: string;
  waitTime: number;
  distance?: number;
}

export interface GameStats {
  totalCarsParked: number;
  averageWaitTime: number;
  averageDistance: number;
  slotUtilization: number;
}
