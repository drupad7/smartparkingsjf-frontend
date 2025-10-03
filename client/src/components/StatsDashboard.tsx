import { Card } from "@/components/ui/card";
import { GameStats } from "@/types/parking";
import { TrendingUp, Clock, Navigation, Activity } from "lucide-react";

interface StatsDashboardProps {
  stats: GameStats;
}

export default function StatsDashboard({ stats }: StatsDashboardProps) {
  const statItems = [
    {
      label: "Cars Parked",
      value: stats.totalCarsParked,
      icon: Activity,
      color: "text-chart-1",
      bgColor: "bg-chart-1/20",
    },
    {
      label: "Avg Wait Time",
      value: `${stats.averageWaitTime.toFixed(1)}s`,
      icon: Clock,
      color: "text-chart-3",
      bgColor: "bg-chart-3/20",
    },
    {
      label: "Avg Distance",
      value: stats.averageDistance.toFixed(1),
      icon: Navigation,
      color: "text-chart-2",
      bgColor: "bg-chart-2/20",
    },
    {
      label: "Slot Usage",
      value: `${stats.slotUtilization.toFixed(0)}%`,
      icon: TrendingUp,
      color: "text-chart-5",
      bgColor: "bg-chart-5/20",
    },
  ];

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Performance Metrics</h3>
      <div className="grid grid-cols-2 gap-3">
        {statItems.map((item, index) => (
          <Card
            key={index}
            className="p-4 border-card-border"
            data-testid={`stat-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
          >
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">{item.label}</p>
                <p className="text-2xl font-bold font-mono">{item.value}</p>
              </div>
              <div className={`${item.bgColor} p-2 rounded-lg`}>
                <item.icon className={`w-4 h-4 ${item.color}`} />
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
