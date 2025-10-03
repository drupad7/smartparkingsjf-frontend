import ParkingSlot from '../ParkingSlot';

export default function ParkingSlotExample() {
  return (
    <div className="flex gap-4 p-8">
      <ParkingSlot 
        id="1" 
        isOccupied={false} 
        position={{ row: 0, col: 0 }} 
      />
      <ParkingSlot 
        id="2" 
        isOccupied={true} 
        position={{ row: 0, col: 1 }} 
      />
      <ParkingSlot 
        id="3" 
        isOccupied={false} 
        position={{ row: 0, col: 2 }}
        isHighlighted={true}
        showDistance={true}
        distance={2.5}
      />
    </div>
  );
}
