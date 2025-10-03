import { useState, useEffect, useCallback } from "react";
import ParkingGrid from "@/components/ParkingGrid";
import CarQueue from "@/components/CarQueue";
import StatsDashboard from "@/components/StatsDashboard";
import ThemeToggle from "@/components/ThemeToggle";
import { ParkingSlot, Car, GameStats } from "@/types/parking";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Car as CarIcon, 
  Zap, 
  Target, 
  TrendingDown, 
  Clock,
  Navigation,
  Plus,
  RotateCcw,
  PlayCircle,
  StopCircle,
  ArrowRight,
  CheckCircle
} from "lucide-react";

const ROWS = 4;
const COLS = 6;
const ENTRANCE = { row: 0, col: 0 };

export default function Home() {
  const { toast } = useToast();
  const [slots, setSlots] = useState<ParkingSlot[]>([]);
  const [queue, setQueue] = useState<Car[]>([]);
  const [nextCarId, setNextCarId] = useState(1);
  const [currentTime, setCurrentTime] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [highlightedSlots, setHighlightedSlots] = useState<string[]>([]);
  const [showDistances, setShowDistances] = useState(false);
  const [autoMode, setAutoMode] = useState(false);
  const [stats, setStats] = useState<GameStats>({
    totalCarsParked: 0,
    averageWaitTime: 0,
    averageDistance: 0,
    slotUtilization: 0,
  });

  useEffect(() => {
    const initialSlots = Array.from({ length: ROWS * COLS }, (_, i) => ({
      id: `slot-${i}`,
      position: { row: Math.floor(i / COLS), col: i % COLS },
      isOccupied: false,
    }));
    setSlots(initialSlots);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime((t) => t + 1);
      setQueue((q) =>
        q.map((car) => ({
          ...car,
          waitTime: car.waitTime + 1,
        }))
      );
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (autoMode) {
      const interval = setInterval(() => {
        addCar();
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [autoMode, slots, nextCarId, currentTime]);

  const calculateDistance = (slot: ParkingSlot) => {
    const dx = slot.position.col - ENTRANCE.col;
    const dy = slot.position.row - ENTRANCE.row;
    return Math.sqrt(dx * dx + dy * dy);
  };

  const findClosestSlot = useCallback(() => {
    const availableSlots = slots.filter((s) => !s.isOccupied);
    if (availableSlots.length === 0) return null;

    let closestSlot = availableSlots[0];
    let minDistance = calculateDistance(closestSlot);

    availableSlots.forEach((slot) => {
      const distance = calculateDistance(slot);
      if (distance < minDistance) {
        minDistance = distance;
        closestSlot = slot;
      }
    });

    return { slot: closestSlot, distance: minDistance };
  }, [slots]);

  const addCar = useCallback(() => {
    if (slots.filter((s) => !s.isOccupied).length === 0) {
      toast({
        title: "Parking Lot Full",
        description: "No available slots. Please reset to continue.",
        variant: "destructive",
      });
      setAutoMode(false);
      return;
    }

    const newCar: Car = {
      id: String(nextCarId),
      arrivalTime: currentTime,
      waitTime: 0,
    };

    setQueue((q) => [...q, newCar]);
    setNextCarId((id) => id + 1);
  }, [slots, nextCarId, currentTime, toast]);

  const processQueue = async () => {
    if (queue.length === 0 || isProcessing) return;

    setIsProcessing(true);
    setShowDistances(true);

    const availableSlots = slots.filter((s) => !s.isOccupied);
    setHighlightedSlots(availableSlots.map((s) => s.id));

    await new Promise((resolve) => setTimeout(resolve, 1500));

    const result = findClosestSlot();
    if (!result) {
      setIsProcessing(false);
      setShowDistances(false);
      setHighlightedSlots([]);
      return;
    }

    const { slot: closestSlot, distance } = result;
    setHighlightedSlots([closestSlot.id]);

    await new Promise((resolve) => setTimeout(resolve, 800));

    setQueue((q) => {
      const [car, ...rest] = q;
      if (car) {
        setSlots((prevSlots) =>
          prevSlots.map((s) =>
            s.id === closestSlot.id
              ? { ...s, isOccupied: true, carId: car.id }
              : s
          )
        );

        setStats((prevStats) => {
          const newTotal = prevStats.totalCarsParked + 1;
          const newAvgWait =
            (prevStats.averageWaitTime * prevStats.totalCarsParked +
              car.waitTime) /
            newTotal;
          const newAvgDistance =
            (prevStats.averageDistance * prevStats.totalCarsParked + distance) /
            newTotal;
          const occupied = slots.filter((s) => s.isOccupied).length + 1;
          const utilization = (occupied / slots.length) * 100;

          return {
            totalCarsParked: newTotal,
            averageWaitTime: newAvgWait,
            averageDistance: newAvgDistance,
            slotUtilization: utilization,
          };
        });

        toast({
          title: "Car Parked!",
          description: `Car #${car.id} assigned to nearest slot (distance: ${distance.toFixed(1)})`,
        });
      }
      return rest;
    });

    setShowDistances(false);
    setHighlightedSlots([]);
    setIsProcessing(false);
  };

  useEffect(() => {
    const availableSlots = slots.filter((s) => !s.isOccupied).length;
    if (queue.length > 0 && !isProcessing && availableSlots > 0) {
      const timer = setTimeout(() => {
        processQueue();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [queue.length, isProcessing, slots]);

  const removeCar = (slotId: string) => {
    if (isProcessing) return;

    const slot = slots.find((s) => s.id === slotId);
    if (!slot || !slot.isOccupied) return;

    const carId = slot.carId;

    setSlots((prevSlots) => {
      const updatedSlots = prevSlots.map((s) =>
        s.id === slotId ? { ...s, isOccupied: false, carId: undefined } : s
      );
      
      const occupied = updatedSlots.filter((s) => s.isOccupied).length;
      const utilization = (occupied / updatedSlots.length) * 100;
      
      setStats((prevStats) => ({
        ...prevStats,
        slotUtilization: utilization,
      }));

      return updatedSlots;
    });

    toast({
      title: "Car Left",
      description: `Car #${carId} has left the parking lot`,
    });
  };

  const resetGame = () => {
    setSlots((prevSlots) =>
      prevSlots.map((s) => ({ ...s, isOccupied: false, carId: undefined }))
    );
    setQueue([]);
    setNextCarId(1);
    setCurrentTime(0);
    setIsProcessing(false);
    setHighlightedSlots([]);
    setShowDistances(false);
    setAutoMode(false);
    setStats({
      totalCarsParked: 0,
      averageWaitTime: 0,
      averageDistance: 0,
      slotUtilization: 0,
    });

    toast({
      title: "Demo Reset",
      description: "Ready for a fresh demonstration",
    });
  };

  const scrollToDemo = () => {
    document.getElementById('live-demo')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="bg-primary/20 p-2 rounded-lg">
                <CarIcon className="w-6 h-6 text-primary" />
              </div>
              <h1 className="text-xl font-bold">Smart Parking SJF</h1>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 lg:py-32">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <Badge variant="secondary" className="mb-4">
              <Zap className="w-3 h-3 mr-1" />
              Operating System Scheduling Visualization
            </Badge>
            <h2 className="text-4xl lg:text-6xl font-bold tracking-tight">
              Learn OS Scheduling Through
              <span className="block text-primary mt-2">Interactive Parking</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Understand Shortest Job First (SJF) algorithm by watching cars find their optimal parking spots in real-time
            </p>
            <div className="flex flex-wrap gap-4 justify-center pt-6">
              <Button size="lg" onClick={scrollToDemo} data-testid="button-try-demo">
                Try Live Demo
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
              <Button size="lg" variant="outline" onClick={scrollToDemo} data-testid="button-how-it-works">
                How It Works
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h3 className="text-3xl lg:text-4xl font-bold mb-4">How SJF Algorithm Works</h3>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                The Shortest Job First algorithm optimizes parking by assigning each car to the nearest available slot
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <Card className="p-6 border-card-border text-center">
                <div className="bg-chart-3/20 w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <CarIcon className="w-6 h-6 text-chart-3" />
                </div>
                <h4 className="font-semibold mb-2">Car Arrives</h4>
                <p className="text-sm text-muted-foreground">
                  When a car enters the parking lot, it joins the waiting queue
                </p>
              </Card>

              <Card className="p-6 border-card-border text-center">
                <div className="bg-primary/20 w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Navigation className="w-6 h-6 text-primary" />
                </div>
                <h4 className="font-semibold mb-2">Calculate Distance</h4>
                <p className="text-sm text-muted-foreground">
                  The algorithm calculates distance from entrance to all available slots
                </p>
              </Card>

              <Card className="p-6 border-card-border text-center">
                <div className="bg-chart-1/20 w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-6 h-6 text-chart-1" />
                </div>
                <h4 className="font-semibold mb-2">Assign Closest Slot</h4>
                <p className="text-sm text-muted-foreground">
                  The car is assigned to the slot with the minimum distance
                </p>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h3 className="text-3xl lg:text-4xl font-bold mb-4">Why SJF Matters</h3>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Understanding this algorithm helps you grasp fundamental OS scheduling concepts
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center space-y-3">
                <div className="bg-chart-1/20 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto">
                  <Target className="w-8 h-8 text-chart-1" />
                </div>
                <h4 className="font-semibold">Optimal Assignment</h4>
                <p className="text-sm text-muted-foreground">
                  Minimizes travel distance for each car
                </p>
              </div>

              <div className="text-center space-y-3">
                <div className="bg-chart-2/20 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto">
                  <TrendingDown className="w-8 h-8 text-chart-2" />
                </div>
                <h4 className="font-semibold">Reduced Wait Time</h4>
                <p className="text-sm text-muted-foreground">
                  Quick slot assignment keeps traffic flowing
                </p>
              </div>

              <div className="text-center space-y-3">
                <div className="bg-chart-3/20 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto">
                  <Clock className="w-8 h-8 text-chart-3" />
                </div>
                <h4 className="font-semibold">Real-Time Processing</h4>
                <p className="text-sm text-muted-foreground">
                  Instant calculations for immediate assignment
                </p>
              </div>

              <div className="text-center space-y-3">
                <div className="bg-chart-5/20 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto">
                  <Zap className="w-8 h-8 text-chart-5" />
                </div>
                <h4 className="font-semibold">Efficient Utilization</h4>
                <p className="text-sm text-muted-foreground">
                  Maximizes parking lot space usage
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Live Demo Section */}
      <section id="live-demo" className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h3 className="text-3xl lg:text-4xl font-bold mb-4">Interactive Live Demo</h3>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Watch the algorithm in action as cars automatically find their optimal parking spots
              </p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <Card className="p-6 border-card-border">
                  <ParkingGrid
                    slots={slots}
                    rows={ROWS}
                    cols={COLS}
                    highlightedSlots={highlightedSlots}
                    showDistances={showDistances}
                    entrance={ENTRANCE}
                    onSlotClick={removeCar}
                  />
                  <div className="mt-4 text-xs text-muted-foreground text-center">
                    Click on occupied slots to remove cars
                  </div>
                </Card>
              </div>

              <div className="space-y-6">
                <Card className="p-6 border-card-border">
                  <h4 className="font-semibold mb-4 flex items-center gap-2">
                    <Zap className="w-5 h-5 text-primary" />
                    Demo Controls
                  </h4>
                  <div className="space-y-3">
                    <Button
                      onClick={addCar}
                      disabled={isProcessing}
                      className="w-full"
                      data-testid="button-add-car"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Car
                    </Button>
                    <Button
                      onClick={() => setAutoMode(!autoMode)}
                      variant={autoMode ? "default" : "outline"}
                      className="w-full"
                      data-testid="button-auto-mode"
                    >
                      {autoMode ? (
                        <>
                          <StopCircle className="w-4 h-4 mr-2" />
                          Stop Auto
                        </>
                      ) : (
                        <>
                          <PlayCircle className="w-4 h-4 mr-2" />
                          Start Auto
                        </>
                      )}
                    </Button>
                    <Button
                      onClick={resetGame}
                      variant="outline"
                      className="w-full"
                      data-testid="button-reset"
                    >
                      <RotateCcw className="w-4 h-4 mr-2" />
                      Reset Demo
                    </Button>
                  </div>
                </Card>

                <StatsDashboard stats={stats} />
                
                <CarQueue cars={queue} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-border">
        <div className="container mx-auto px-4">
          <div className="text-center text-sm text-muted-foreground">
            <p>Educational demonstration of Shortest Job First scheduling algorithm</p>
            <p className="mt-2">Learn operating system concepts through interactive visualization</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
