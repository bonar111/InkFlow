// src/components/Tabs.js
"use client";

import { useState } from 'react';
import ClientsList from './ClientsList'; // Importujemy komponent do wyświetlania klientów
import { startOfMonth, endOfMonth, subMonths } from 'date-fns';

export default function Tabs() {
  const tabs = [
    { 
      label: 'Bieżący miesiąc', 
      startDate: startOfMonth(new Date()), 
      endDate: new Date() 
    },
    { 
      label: 'Poprzedni miesiąc', 
      startDate: startOfMonth(subMonths(new Date(), 1)), 
      endDate: endOfMonth(subMonths(new Date(), 1)) 
    },
    { 
      label: 'Ostatnie 6 miesięcy', 
      startDate: startOfMonth(subMonths(new Date(), 6)), 
      endDate: new Date() 
    },
  ]

  const [activeTab, setActiveTab] = useState(tabs[0]);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Lista Klientów</h1>
      <div className="flex space-x-4 mb-4">
        {tabs.map(tab => (
          <button
            key={tab.label}
            className={`px-4 py-2 rounded ${
              activeTab.label === tab.label 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
            onClick={() => setActiveTab(tab)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <ClientsList startDate={activeTab.startDate} endDate={activeTab.endDate} />
    </div>
  );
}
