"use client";

import React, { useState, useEffect } from "react";
import axios from "../utils/axiosConfig"; // skonfigurowana instancja Axios
import PropTypes from "prop-types";
import Image from "next/image";

export default function ClientsList({ daysAgo }) {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sendingMessages, setSendingMessages] = useState({});

  // Funkcja pobierająca listę klientów z API
  const fetchClients = async () => {
    setLoading(true);
    setError(null);

    try {
      // Przykładowy endpoint: /api/customercare/sessions/afterSession-X
      // Zależnie od Twojego API i logiki, może wyglądać inaczej.
      const endpoint = `/api/customercare/sessions/afterSession-${daysAgo}`;
      const response = await axios.get(endpoint);
      setClients(response.data);
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

  // Pobierz klientów po renderze i przy zmianie daysAgo
  useEffect(() => {
    fetchClients();
  }, [daysAgo]);

  // Funkcja do wysyłania wiadomości (przykład, jeśli nadal potrzebujesz)
  const handleSendMessage = async (sessionId) => {
    const messageType = `day_${daysAgo}`;
    setSendingMessages((prev) => ({ ...prev, [sessionId]: true }));

    try {
      await axios.post(`/api/customercare/sessions/sentmessage`, null, {
        params: { sessionId, messageType },
      });
      // Po wysłaniu odśwież listę klientów
      fetchClients();
    } catch (err) {
      console.error("Error sending message:", err);
      alert("Wystąpił błąd podczas wysyłania wiadomości.");
    } finally {
      setSendingMessages((prev) => ({ ...prev, [sessionId]: false }));
    }
  };

  // Renderuj stan ładowania lub błąd, jeśli wystąpi
  if (loading) {
    return <p className="text-gray-500">Ładowanie klientów...</p>;
  }

  if (error) {
    return <p className="text-red-500">Błąd: {error}</p>;
  }

  return (
    <div className="container mx-auto px-4">
      {clients.length > 0 ? (
        <ul className="space-y-8">
          {clients.map((client) => {
            const {
              id,
              name,
              email,
              session,
              messageSent,
              isStudioClient,
              careMessageResult,
              conversationWithMessages,
            } = client;

            // Wyciągamy załączniki z sesji
            const attachments = session?.attachments || [];

            // Dane z conversationWithMessages (do wyświetlenia w formie skróconej)
            let conversationInfo = null;
            if (conversationWithMessages) {
              const { updatedTime, unreadCount, source, accountOwner } =
                conversationWithMessages;
              conversationInfo = { updatedTime, unreadCount, source, accountOwner };
            }

            return (
              <li
                key={id}
                className="bg-white shadow-lg rounded-xl p-6 flex flex-col border border-gray-200 hover:bg-gray-50 transition-colors duration-300"
              >
                {/* Imię i nazwisko klienta */}
                <h2 className="text-2xl font-semibold text-gray-800">
                  {name || "Brak nazwy"}
                </h2>

                {/* E-mail (klikany mailto) */}
                {email && (
                  <p className="text-gray-600 mt-2">
                    <strong>Email:</strong>{" "}
                    <a
                      href={`mailto:${email}`}
                      className="text-blue-500 hover:underline"
                    >
                      {email}
                    </a>
                  </p>
                  
                )}

                {/* Informacje o ostatniej sesji */}
                {session && (
                  <div className="mt-4">
                    <h3 className="text-xl font-medium text-gray-700">
                      Ostatnia Sesja:
                    </h3>
                    <p className="text-gray-600 mt-1">
                      <strong>Data:</strong>{" "}
                      {new Date(session.date).toLocaleString()}
                    </p>
                    {session.descriptionFromCalendar && (
                      <p className="text-gray-600 mt-1">
                        <strong>Opis:</strong> {session.descriptionFromCalendar}
                      </p>
                    )}
                    {session.artist && (
                      <p className="text-gray-600 mt-1">
                        <strong>Artysta:</strong> {session.artist.name}
                      </p>
                    )}
                  </div>
                )}

                {/* Załączniki */}
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
                {/* Czy klient jest zarejestrowany w studiu */}
                <div className="mt-4">
                  <p className="text-gray-600">
                    <strong>Czy klient studia?</strong>{" "}
                    {isStudioClient ? "Tak" : "Nie"}
                  </p>
                </div>

                {/* careMessageResult (bardziej czytelna forma niż surowy JSON) */}
                {careMessageResult && (
                  <div className="mt-4">
                      <p className="text-gray-600">
                        <strong>Czy należy napisać do klienta?:</strong>{" "}
                        {careMessageResult.shouldWriteToClient ? "Tak" : "Nie"}
                      </p>
                      {careMessageResult.reasonForNotWritingMessage && (
                    <li>
                      <strong>Powód lda którego nie należy pisać do klienta:</strong>{" "}
                      {careMessageResult.reasonForNotWritingMessage}
                    </li>
                  )}
                    
                  </div>
                )}

                {/* Skrótowe informacje o konwersacji, jeśli występuje */}
                {conversationInfo && (
                  <div className="mt-4">
                    <p className="text-gray-600">
                      <strong>Źródło:</strong> {conversationInfo.source}
                    </p>
                    <p className="text-gray-600">
                      <strong>Konto:</strong> {conversationInfo.accountOwner}
                    </p>
                  </div>
                )}

                {/* Przycisk do wysłania wiadomości (jeśli potrzeba) */}
                <div className="mt-4">
                  {!messageSent && session ? (
                    <button
                      onClick={() => handleSendMessage(session.id)}
                      disabled={sendingMessages[session.id]}
                      className={`px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors duration-300 ${
                        sendingMessages[session.id]
                          ? "opacity-50 cursor-not-allowed"
                          : ""
                      }`}
                    >
                      {sendingMessages[session.id]
                        ? "Wysyłanie..."
                        : "Wyślij wiadomość"}
                    </button>
                  ) : (
                    <span className="text-green-600 font-medium">
                      Wiadomość wysłana
                    </span>
                  )}
                </div>

                {/* Przycisk otwierający konwersację w nowej karcie (jeśli jest) */}
                {/* {conversationWithMessages && (
                  <div className="mt-4">
                    <button
                      onClick={() => {
                        // Zakładamy, że pod tym adresem mamy stronę do podglądu konwersacji:
                        window.open(`/clients/${id}/conversation`, "_blank");
                      }}
                      className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors duration-300"
                    >
                      Zobacz konwersację z klientem
                    </button>
                  </div>
                )} */}
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
