// src/components/ClientsList.js
"use client";

import React, { useEffect, useState } from "react";
import axios from "../utils/axiosConfig"; // Importujemy skonfigurowaną instancję Axios
import PropTypes from "prop-types";
import Image from 'next/image';

export default function ClientsList({ daysAgo }) {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchClients = async () => {
    setLoading(true);
    setError(null);

    try {
      const endpoint = `/api/customercare/sessions/afterSession-${daysAgo}`;
      const response = await axios.get(endpoint);
      setClients(response.data);
      console.log(response.data); // Dodane dla debugowania
    } catch (err) {
      if (err.response && err.response.data && err.response.data.detail) {
        setError(err.response.data.detail);
      } else {
        setError(err.message || "Wystąpił błąd podczas pobierania danych.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, [daysAgo]);

  const getAttachments = (client) => {
    if (client.lastSession && Array.isArray(client.lastSession.attachments)) {
      return client.lastSession.attachments;
    }
    return [];
  };

  if (loading) {
    return <p className="text-gray-500">Ładowanie klientów...</p>;
  }

  if (error) {
    return <p className="text-red-500">Błąd: {error}</p>;
  }

  return (
    <div className="container mx-auto px-4">
      {clients.length > 0 ? (
        <ul className="space-y-8"> {/* Zwiększony odstęp między rekordami */}
          {clients.map((client) => {
            const attachments = getAttachments(client);

            return (
              <li
                key={client.id}
                className="bg-white shadow-lg rounded-xl p-6 flex flex-col border border-gray-200 hover:bg-gray-50 transition-colors duration-300"
              >
                <h2 className="text-2xl font-semibold text-gray-800">
                  {client.name}
                </h2>

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

                {attachments.length > 0 && (
                  <div className="mt-6">
                    <h3 className="text-xl font-medium text-gray-700 mb-4">
                      Załączniki:
                    </h3>
                    <div className="flex flex-wrap gap-6">
                      {attachments.map((attachment, index) => (
                        <a
                          key={attachment.id || index}
                          href={attachment.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block"
                        >
                          <Image
                            src={attachment.url}
                            alt={`Załącznik ${index + 1}`}
                            width={128}
                            height={128}
                            className="object-cover rounded-md border border-gray-300 hover:shadow-lg transition-shadow duration-200"
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

ClientsList.propTypes = {
  daysAgo: PropTypes.number.isRequired,
};
