"use client";

import { useState, ReactNode } from "react";

interface Tab {
  id: string;
  label: string;
  content: ReactNode;
}

interface TabSwitcherProps {
  tabs: Tab[];
  defaultTab: string;
}

const TabSwitcher = ({ tabs, defaultTab }: TabSwitcherProps) => {
  const [activeTab, setActiveTab] = useState<string>(defaultTab);

  return (
    <div className="w-full">
      <div className="border-b border-gray-700/50 mb-6">
        <nav className="-mb-px flex space-x-4" aria-label="Tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`whitespace-nowrap py-3 px-4 border-b-2 font-medium text-sm transition-colors ${
                activeTab === tab.id
                  ? "border-pri text-pri"
                  : "border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-700/50"
              }`}
              aria-current={activeTab === tab.id ? "page" : undefined}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>
      <div className="tab-content">
        {tabs.map((tab) => (
          <div key={tab.id} className={`${activeTab === tab.id ? "block" : "hidden"}`}>
            {tab.content}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TabSwitcher;
