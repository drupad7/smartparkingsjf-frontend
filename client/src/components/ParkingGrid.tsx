import ParkingSlot from "./ParkingSlot";
import { ParkingSlot as ParkingSlotType } from "@/types/parking";
import { MapPin } from "lucide-react";

interface ParkingGridProps {
  slots: ParkingSlotType[];
  rows: number;
  cols: number;
  highlightedSlots?: string[];
  showDistances?: boolean;
  entrance?: { row: number; col: number };
  onSlotClick?: (slotId: string) => void;
}

export default function ParkingGrid({
  slots,
  rows,
  cols,
  highlightedSlots = [],
  showDistances = false,
  entrance = { row: 0, col: 0 },
  onSlotClick,
}: ParkingGridProps) {
  const getSlotByPosition = (row: number, col: number) => {
    return slots.find((s) => s.position.row === row && s.position.col === col);
  };

  const calculateDistance = (row: number, col: number) => {
    const dx = col - entrance.col;
    const dy = row - entrance.row;
    return Math.sqrt(dx * dx + dy * dy);
  };

  return (
    <div className="relative">
      <div className="absolute -top-10 left-0 flex items-center gap-2 text-sm text-muted-foreground">
        <MapPin className="w-4 h-4 text-chart-3" />
        <span>Entrance</span>
      </div>
      
      <div
        className="grid gap-3 p-6 bg-muted/30 rounded-2xl border border-border relative"
        style={{
          gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
        }}
      >
        <div className="absolute top-2 left-2">
          <MapPin className="w-5 h-5 text-chart-3 animate-pulse" />
        </div>

        {Array.from({ length: rows * cols }).map((_, idx) => {
          const row = Math.floor(idx / cols);
          const col = idx % cols;
          const slot = getSlotByPosition(row, col);

          if (!slot) return <div key={idx} />;

          const distance = calculateDistance(row, col);
          const isHighlighted = highlightedSlots.includes(slot.id);

          return (
            <ParkingSlot
              key={slot.id}
              id={slot.id}
              isOccupied={slot.isOccupied}
              position={slot.position}
              isHighlighted={isHighlighted}
              distance={distance}
              showDistance={showDistances && !slot.isOccupied}
              onSlotClick={onSlotClick}
            />
          );
        })}
      </div>
    </div>
  );
}
