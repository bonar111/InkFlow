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
  const [sendingMessages, setSendingMessages] = useState({}); // Stan dla wysyłania wiadomości

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
    if (client.session && Array.isArray(client.session.attachments)) {
      return client.session.attachments;
    }
    return [];
  };

  const handleSendMessage = async (sessionId) => {
    const messageType = `day_${daysAgo}`;
    setSendingMessages(prev => ({ ...prev, [sessionId]: true })); // Ustawiamy stan ładowania dla konkretnej sesji
    try {
      await axios.post(`/api/customercare/sessions/sentmessage`, null, { 
        params: { sessionId, messageType } 
      });
      // Po pomyślnym wysłaniu, odświeżamy listę klientów
      fetchClients();
    } catch (err) {
      console.error('Error sending message:', err);
      alert('Wystąpił błąd podczas wysyłania wiadomości.');
    } finally {
      setSendingMessages(prev => ({ ...prev, [sessionId]: false })); // Resetujemy stan ładowania
    }
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

                {client.session && (
                  <div className="mt-4">
                    <h3 className="text-xl font-medium text-gray-700">
                      Ostatnia Sesja:
                    </h3>
                    <p className="text-gray-600 mt-1">
                      <strong>Data:</strong>{" "}
                      {new Date(client.session.date).toLocaleString()}
                    </p>
                    {client.session.descriptionFromCalendar && (
                      <p className="text-gray-600 mt-1">
                        <strong>Opis:</strong>{" "}
                        {client.session.descriptionFromCalendar}
                      </p>
                    )}
                    {client.session.artist && (
                      <p className="text-gray-600 mt-1">
                        <strong>Artysta:</strong> {client.session.artist.name}
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

                {/* Przyciski do wysyłania wiadomości */}
                <div className="mt-4">
                  {!client.messageSent ? (
                    <button
                      onClick={() => handleSendMessage(client.session.id)}
                      disabled={sendingMessages[client.session.id]}
                      className={`px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors duration-300 ${
                        sendingMessages[client.session.id] ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                    >
                      {sendingMessages[client.session.id] ? 'Wysyłanie...' : 'Wysłano wiadomość'}
                    </button>
                  ) : (
                    <span className="text-green-600 font-medium">Wiadomość wysłana</span>
                  )}
                </div>
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
