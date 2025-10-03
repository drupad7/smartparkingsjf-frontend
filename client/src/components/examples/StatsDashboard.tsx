import StatsDashboard from '../StatsDashboard';

export default function StatsDashboardExample() {
  const mockStats = {
    totalCarsParked: 12,
    averageWaitTime: 2.5,
    averageDistance: 3.2,
    slotUtilization: 65,
  };

  return (
    <div className="p-8 max-w-md">
      <StatsDashboard stats={mockStats} />
    </div>
  );
}
