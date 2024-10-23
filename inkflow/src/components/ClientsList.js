// src/components/ClientsList.js
"use client";

import React, { useEffect, useState } from "react";
import axios from "../utils/axiosConfig"; // Importujemy skonfigurowaną instancję Axios
import PropTypes from "prop-types";

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
      if (err.response && err.response.data && err.response.data.detail) {
        setError(err.response.data.detail);
      } else {
        setError(err.message || "Wystąpił błąd podczas pobierania danych.");
      }
    } finally {
      // Kończymy stan ładowania
      setLoading(false);
    }
  };

  // Używamy useEffect, aby pobrać dane za każdym razem, gdy daysAgo się zmienia
  useEffect(() => {
    fetchClients();
  }, [daysAgo]);

  // Funkcja do agregowania załączników z lastSession
  const getAttachments = (client) => {
    if (client.lastSession && Array.isArray(client.lastSession.attachments)) {
      return client.lastSession.attachments;
    }
    return [];
  };

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
    <div className="container mx-auto px-4">
      {clients.length > 0 ? (
        <ul className="space-y-6">
          {clients.map((client) => {
            const attachments = getAttachments(client);

            return (
              <li
                key={client.id}
                className="bg-white shadow-md rounded-lg p-6 flex flex-col hover:shadow-lg transition-shadow duration-300"
              >
                {/* Imię i Nazwisko Klienta */}
                <h2 className="text-2xl font-semibold text-gray-800">
                  {client.name}
                </h2>

                {/* Email Klienta (jeśli dostępny) */}
                {client.email && (
                  <p className="text-gray-600 mt-2">
                    <strong>Email:</strong>{" "}
                    <a
                      href={`mailto:${client.email}`}
                      className="text-blue-500 hover:underline"
                    >
                      {client.email}
                    </a>
                  </p>
                )}

                {/* Ostatnia Sesja */}
                {client.lastSession && (
                  <div className="mt-4">
                    <h3 className="text-xl font-medium text-gray-700">
                      Ostatnia Sesja:
                    </h3>
                    <p className="text-gray-600 mt-1">
                      <strong>Data:</strong>{" "}
                      {new Date(client.lastSession.date).toLocaleString()}
                    </p>
                    {client.lastSession.descriptionFromCalendar && (
                      <p className="text-gray-600 mt-1">
                        <strong>Opis:</strong>{" "}
                        {client.lastSession.descriptionFromCalendar}
                      </p>
                    )}
                    {client.lastSession.artist && (
                      <p className="text-gray-600 mt-1">
                        <strong>Artysta:</strong> {client.lastSession.artist.name}
                      </p>
                    )}
                  </div>
                )}

                {/* Załączniki */}
                {attachments.length > 0 && (
                  <div className="mt-4">
                    <h3 className="text-xl font-medium text-gray-700 mb-2">
                      Załączniki:
                    </h3>
                    <div className="flex flex-wrap gap-4">
                      {attachments.map((attachment, index) => (
                        <a
                          key={attachment.id || index}
                          href={attachment.url} // Zakładamy, że każdy załącznik ma pole 'url'
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block"
                        >
                          <img
                            src={attachment.url}
                            alt={`Załącznik ${index + 1}`}
                            className="w-24 h-24 object-cover rounded-md border hover:shadow-lg transition-shadow duration-200"
                          />
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </li>
            );
          })}
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
