import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Plus, RotateCcw, Info, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useState } from "react";

interface ControlPanelProps {
  onAddCar: () => void;
  onReset: () => void;
  isProcessing?: boolean;
  autoMode?: boolean;
  onToggleAutoMode?: () => void;
}

export default function ControlPanel({
  onAddCar,
  onReset,
  isProcessing = false,
  autoMode = false,
  onToggleAutoMode,
}: ControlPanelProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="space-y-4">
      <Card className="p-4 border-card-border">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-primary" />
            <h3 className="font-semibold">Controls</h3>
          </div>

          <div className="flex gap-2">
            <Button
              onClick={onAddCar}
              disabled={isProcessing}
              className="flex-1"
              data-testid="button-add-car"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Car
            </Button>
            <Button
              onClick={onReset}
              variant="outline"
              size="icon"
              data-testid="button-reset"
            >
              <RotateCcw className="w-4 h-4" />
            </Button>
          </div>

          {onToggleAutoMode && (
            <Button
              onClick={onToggleAutoMode}
              variant={autoMode ? "default" : "outline"}
              className="w-full"
              data-testid="button-auto-mode"
            >
              {autoMode ? "Stop Auto Mode" : "Start Auto Mode"}
            </Button>
          )}
        </div>
      </Card>

      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <Card className="p-4 border-card-border">
          <CollapsibleTrigger className="w-full">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Info className="w-4 h-4 text-accent" />
                <span className="text-sm font-medium">How SJF Works</span>
              </div>
              <Badge variant="secondary">Algorithm Info</Badge>
            </div>
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-4">
            <div className="space-y-3 text-sm text-muted-foreground">
              <p>
                <strong className="text-foreground">Shortest Job First (SJF)</strong> assigns each car to the nearest available parking slot.
              </p>
              <ul className="space-y-2 list-disc list-inside">
                <li>Calculates distance from entrance to all empty slots</li>
                <li>Selects the slot with minimum distance</li>
                <li>Optimizes for shortest travel distance</li>
                <li>Reduces overall parking time</li>
              </ul>
              <div className="pt-2 border-t border-border">
                <p className="text-xs">
                  💡 Watch the distance numbers appear when adding a car!
                </p>
              </div>
            </div>
          </CollapsibleContent>
        </Card>
      </Collapsible>
    </div>
  );
}
