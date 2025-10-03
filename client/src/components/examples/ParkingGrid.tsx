import ParkingGrid from '../ParkingGrid';

export default function ParkingGridExample() {
  const mockSlots = Array.from({ length: 24 }, (_, i) => ({
    id: `slot-${i}`,
    position: { row: Math.floor(i / 6), col: i % 6 },
    isOccupied: Math.random() > 0.6,
  }));

  return (
    <div className="p-8">
      <ParkingGrid 
        slots={mockSlots} 
        rows={4} 
        cols={6}
        highlightedSlots={['slot-7']}
        showDistances={true}
      />
    </div>
  );
}
