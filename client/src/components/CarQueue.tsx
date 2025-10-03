import { Car as CarType } from "@/types/parking";
import { Car, Clock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";

interface CarQueueProps {
  cars: CarType[];
  onCarClick?: (carId: string) => void;
}

export default function CarQueue({ cars, onCarClick }: CarQueueProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Waiting Queue</h3>
        <Badge variant="secondary" data-testid="text-queue-count">
          {cars.length} {cars.length === 1 ? 'car' : 'cars'}
        </Badge>
      </div>

      {cars.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <Car className="w-16 h-16 text-muted-foreground/40 mb-4" />
          <p className="text-sm text-muted-foreground">No cars waiting</p>
          <p className="text-xs text-muted-foreground mt-1">Add a car to see the SJF algorithm in action</p>
        </div>
      ) : (
        <div className="space-y-2">
          <AnimatePresence mode="popLayout">
            {cars.map((car, index) => (
              <motion.div
                key={car.id}
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                onClick={() => onCarClick?.(car.id)}
                className="bg-card border border-card-border rounded-xl p-4 hover-elevate active-elevate-2 cursor-pointer"
                data-testid={`car-queue-${car.id}`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="bg-chart-3/20 p-2 rounded-lg">
                      <Car className="w-5 h-5 text-chart-3" />
                    </div>
                    <div>
                      <p className="font-semibold text-sm">Car #{car.id}</p>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="w-3 h-3" />
                        <span>Position {index + 1}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-mono font-semibold">{car.waitTime}s</p>
                    <p className="text-xs text-muted-foreground">wait time</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
