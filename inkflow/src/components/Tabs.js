// src/components/Tabs.js
"use client";

import { useState } from 'react';
import ClientsList from './ClientsList'; // Importujemy komponent do wyświetlania klientów

export default function Tabs() {
  const tabs = [
    { label: '1 dzień temu', daysAgo: 1 },
    { label: '7 dni temu', daysAgo: 7 },
    { label: '14 dni temu', daysAgo: 14 },
    { label: '90 dni temu', daysAgo: 90 },
    { label: '180 dni temu', daysAgo: 180 },
  ];

  const [activeTab, setActiveTab] = useState(tabs[0]);

  return (
    <div>
      {/* Pasek zakładek */}
      <div className="flex overflow-x-auto border-b">
        {tabs.map((tab) => (
          <button
            key={tab.daysAgo}
            onClick={() => setActiveTab(tab)}
            className={`flex-shrink-0 px-4 py-2 -mb-px font-semibold border-b-2 ${
              activeTab.daysAgo === tab.daysAgo
                ? 'border-blue-500 text-blue-500'
                : 'border-transparent text-gray-600'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Treść zakładki */}
      <div className="p-4">
        {/* Tutaj renderujemy komponent ClientsList z odpowiednim dniem */}
        <ClientsList daysAgo={activeTab.daysAgo} />
      </div>
    </div>
  );
}
