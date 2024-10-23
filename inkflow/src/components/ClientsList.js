// src/components/ClientsList.js
import React from 'react';

// Przykładowe dane klientów
const clientsData = {
  1: [
    { id: 1, name: 'Jan Kowalski', tattoo: 'Smok' },
    { id: 2, name: 'Anna Nowak', tattoo: 'Róża' },
  ],
  7: [
    { id: 3, name: 'Piotr Wiśniewski', tattoo: 'Orzeł' },
    { id: 4, name: 'Katarzyna Lewandowska', tattoo: 'Serce' },
  ],
  14: [
    { id: 5, name: 'Michał Zieliński', tattoo: 'Żuraw' },
    { id: 6, name: 'Magdalena Wójcik', tattoo: 'Drzewo' },
  ],
  90: [
    { id: 7, name: 'Paweł Szymański', tattoo: 'Kotwica' },
    { id: 8, name: 'Ewa Kamińska', tattoo: 'Feniks' },
  ],
  180: [
    { id: 9, name: 'Tomasz Kaczmarek', tattoo: 'Tygrys' },
    { id: 10, name: 'Agnieszka Jankowska', tattoo: 'Kwiat lotosu' },
  ],
};

export default function ClientsList({ daysAgo }) {
  // Pobieramy klientów na podstawie dni temu
  const clients = clientsData[daysAgo] || [];

  return (
    <div>
      {clients.length > 0 ? (
        <ul className="space-y-4">
          {clients.map((client) => (
            <li key={client.id} className="p-4 border rounded shadow-sm">
              <h2 className="text-lg font-semibold">{client.name}</h2>
              <p>Tatuaż: {client.tattoo}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500">Brak klientów dla wybranego okresu.</p>
      )}
    </div>
  );
}
