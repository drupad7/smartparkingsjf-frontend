import { Car } from "lucide-react";
import { motion } from "framer-motion";

interface ParkingSlotProps {
  id: string;
  isOccupied: boolean;
  position: { row: number; col: number };
  isHighlighted?: boolean;
  distance?: number;
  showDistance?: boolean;
  onSlotClick?: (slotId: string) => void;
}

export default function ParkingSlot({
  id,
  isOccupied,
  isHighlighted,
  distance,
  showDistance,
  onSlotClick,
}: ParkingSlotProps) {
  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="relative"
      data-testid={`slot-${isOccupied ? 'occupied' : 'available'}`}
    >
      <div
        onClick={() => isOccupied && onSlotClick?.(id)}
        className={`
          relative h-20 w-16 rounded-xl border-2 transition-all duration-300
          ${isOccupied 
            ? 'bg-destructive/20 border-destructive cursor-pointer hover-elevate active-elevate-2' 
            : isHighlighted 
              ? 'bg-primary/20 border-primary animate-pulse' 
              : 'bg-card border-dashed border-primary/40'
          }
        `}
        data-testid={isOccupied ? `button-remove-car-${id}` : undefined}
      >
        {isOccupied && (
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 200 }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <Car className="w-8 h-8 text-destructive" />
          </motion.div>
        )}
        
        {showDistance && distance !== undefined && !isOccupied && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute -top-6 left-1/2 -translate-x-1/2 bg-accent text-accent-foreground px-2 py-0.5 rounded-md text-xs font-mono font-semibold whitespace-nowrap"
          >
            {distance.toFixed(1)}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
