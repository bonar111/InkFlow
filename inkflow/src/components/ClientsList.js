// src/components/ClientsList.js
"use client";

import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import axios from '../utils/axiosConfig';

export default function ClientsList({ daysAgo }) {
  // Stan przechowujący dane klientów
  const [clients, setClients] = useState([]);
  // Stan przechowujący informację o ładowaniu danych
  const [loading, setLoading] = useState(true);
  // Stan przechowujący informacje o błędach
  const [error, setError] = useState(null);

  // Funkcja do pobierania danych z API
  const fetchClients = async () => {
    setLoading(true);
    setError(null);

    try {
      // Budujemy endpoint na podstawie daysAgo
      const endpoint = `/api/customercare/sessions/afterSession-${daysAgo}`;
      
      // Wysyłamy zapytanie GET do API
      const response = await axios.get(endpoint);

      // Zakładamy, że odpowiedź zawiera listę klientów w response.data
      setClients(response.data);
    } catch (err) {
      // Jeśli wystąpił błąd, ustawiamy stan błędu
      setError(err.message || 'Wystąpił błąd podczas pobierania danych.');
    } finally {
      // Kończymy stan ładowania
      setLoading(false);
    }
  };

  // Używamy useEffect, aby pobrać dane za każdym razem, gdy daysAgo się zmienia
  useEffect(() => {
    fetchClients();
  }, [daysAgo]);

  // Renderowanie stanu ładowania
  if (loading) {
    return <p className="text-gray-500">Ładowanie klientów...</p>;
  }

  // Renderowanie stanu błędu
  if (error) {
    return <p className="text-red-500">Błąd: {error}</p>;
  }

  // Renderowanie listy klientów
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

// Definiowanie typów propsów dla komponentu
ClientsList.propTypes = {
  daysAgo: PropTypes.number.isRequired,
};
