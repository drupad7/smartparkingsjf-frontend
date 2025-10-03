import CarQueue from '../CarQueue';

export default function CarQueueExample() {
  const mockCars = [
    { id: '1', arrivalTime: 0, waitTime: 5 },
    { id: '2', arrivalTime: 2, waitTime: 3 },
    { id: '3', arrivalTime: 4, waitTime: 1 },
  ];

  return (
    <div className="p-8 max-w-md">
      <CarQueue cars={mockCars} onCarClick={(id) => console.log('Car clicked:', id)} />
    </div>
  );
}
