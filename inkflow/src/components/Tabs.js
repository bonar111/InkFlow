"use client";

import { useState } from 'react';
import ClientsList from './ClientsList'; // Importujemy komponent do wyświetlania klientów

export default function Tabs() {
  const tabs = [
    { label: '2 dni temu', daysAgo: 2 },
    { label: '14 dni temu', daysAgo: 14 },
    { label: '21 dni temu', daysAgo: 21 },
    { label: '30 dni temu', daysAgo: 30 },
    { label: '90 dni temu', daysAgo: 90 },
    { label: '180 dni temu', daysAgo: 180 },
  ];

  const [activeTab, setActiveTab] = useState(tabs[0]);

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Pasek zakładek */}
      <div className="flex flex-wrap border-b mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.daysAgo}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 mr-2 mb-2 sm:mb-0 font-semibold border-b-2 rounded-t-lg transition-colors duration-200 ${
              activeTab.daysAgo === tab.daysAgo
                ? 'border-blue-500 text-blue-500 bg-blue-50'
                : 'border-transparent text-gray-600 hover:text-blue-500 hover:border-blue-300'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Lista klientów */}
      <div>
        <ClientsList daysAgo={activeTab.daysAgo} />
      </div>
    </div>
  );
}
