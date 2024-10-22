"use client";

import { useEffect, useState } from 'react';

export default function ClientsList({ daysAgo }) {
  const [clients, setClients] = useState([]);

  useEffect(() => {
    // Przykładowe dane klientów
    const exampleClients = [
      { id: 1, name: 'Jan Kowalski', tattooDate: '2024-10-21' },
      { id: 2, name: 'Marian Makuszewski', tattooDate: '2024-10-21' },
      { id: 3, name: 'Anna Nowak', tattooDate: '2024-10-15' },
      { id: 4, name: 'Piotr Wiśniewski', tattooDate: '2024-10-08' },
      { id: 5, name: 'Maria Lewandowska', tattooDate: '2024-07-24' },
      { id: 6, name: 'Katarzyna Zielińska', tattooDate: '2024-04-25' },
      // Dodaj więcej przykładowych danych
    ];

    // Obliczanie różnicy dni
    const filteredClients = exampleClients.filter((client) => {
      const tattooDate = new Date(client.tattooDate);
      tattooDate.setHours(0, 0, 0, 0);

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const timeDiff = today - tattooDate;
      const diffDays = Math.round(timeDiff / (1000 * 3600 * 24));

      console.log(
        `Client: ${client.name}, Tattoo Date: ${client.tattooDate}, Days Ago: ${diffDays}`
      );

      return diffDays === daysAgo;
    });

    setClients(filteredClients);
  }, [daysAgo]);

  return (
    <div>
      {clients.length > 0 ? (
        <ul>
          {clients.map((client) => (
            <li key={client.id} className="border-b py-2 flex justify-between">
              <span>{client.name}</span>
              <button className="text-blue-500">Szczegóły</button>
            </li>
          ))}
        </ul>
      ) : (
        <p>Brak klientów do wyświetlenia.</p>
      )}
    </div>
  );
}
