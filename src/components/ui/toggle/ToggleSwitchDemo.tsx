import React, { useState } from "react";
import ToggleSwitch from "./ToggleSwitch";

const ToggleSwitchDemo: React.FC = () => {
  const [demoStates, setDemoStates] = useState({
    basic: false,
    withLabel: true,
    disabled: false,
    small: true,
    medium: false,
    large: true,
  });

  const handleToggle = (key: string, value: boolean) => {
    setDemoStates((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  return (
    <div className="p-6 space-y-6 bg-white rounded-lg border">
      <h2 className="text-xl font-semibold text-gray-800">Toggle Switch Component Demo</h2>

      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 border rounded-lg">
          <span className="text-sm font-medium text-gray-700">Basic Toggle</span>
          <ToggleSwitch
            checked={demoStates.basic}
            onChange={(checked) => handleToggle("basic", checked)}
          />
        </div>

        <div className="flex items-center justify-between p-4 border rounded-lg">
          <span className="text-sm font-medium text-gray-700">With Label</span>
          <ToggleSwitch
            checked={demoStates.withLabel}
            onChange={(checked) => handleToggle("withLabel", checked)}
            label="Enable Feature"
          />
        </div>

        <div className="flex items-center justify-between p-4 border rounded-lg">
          <span className="text-sm font-medium text-gray-700">Disabled State</span>
          <ToggleSwitch
            checked={demoStates.disabled}
            onChange={(checked) => handleToggle("disabled", checked)}
            disabled={true}
          />
        </div>

        <div className="space-y-3">
          <h3 className="text-lg font-medium text-gray-800">Different Sizes</h3>

          <div className="flex items-center justify-between p-4 border rounded-lg">
            <span className="text-sm font-medium text-gray-700">Small Size</span>
            <ToggleSwitch
              checked={demoStates.small}
              onChange={(checked) => handleToggle("small", checked)}
              size="sm"
            />
          </div>

          <div className="flex items-center justify-between p-4 border rounded-lg">
            <span className="text-sm font-medium text-gray-700">Medium Size (Default)</span>
            <ToggleSwitch
              checked={demoStates.medium}
              onChange={(checked) => handleToggle("medium", checked)}
              size="md"
            />
          </div>

          <div className="flex items-center justify-between p-4 border rounded-lg">
            <span className="text-sm font-medium text-gray-700">Large Size</span>
            <ToggleSwitch
              checked={demoStates.large}
              onChange={(checked) => handleToggle("large", checked)}
              size="lg"
            />
          </div>
        </div>
      </div>

      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="text-sm font-medium text-gray-700 mb-2">Current States:</h3>
        <pre className="text-xs text-gray-600">{JSON.stringify(demoStates, null, 2)}</pre>
      </div>
    </div>
  );
};

export default ToggleSwitchDemo;
