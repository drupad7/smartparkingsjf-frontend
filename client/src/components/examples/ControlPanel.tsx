import ControlPanel from '../ControlPanel';

export default function ControlPanelExample() {
  return (
    <div className="p-8 max-w-md">
      <ControlPanel
        onAddCar={() => console.log('Add car clicked')}
        onReset={() => console.log('Reset clicked')}
        onToggleAutoMode={() => console.log('Auto mode toggled')}
        autoMode={false}
      />
    </div>
  );
}
