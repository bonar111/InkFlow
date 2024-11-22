"use client";

import React, { useEffect, useState } from "react";
import axios from "../../utils/axiosConfig";
import PropTypes from "prop-types";
import Image from 'next/image';
import Link from 'next/link';

export default function ClientsList({ startDate, endDate }) {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchClients = async () => {
    setLoading(true);
    setError(null);

    try {
      const endpoint = `/api/finance/sessions-before-audit?dateFromUtc=${startDate.toISOString()}&dateToUtc=${endDate.toISOString()}`;
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
  }, [startDate, endDate]);

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
          {clients.map((client, index) => {
            const session = client.session || client.Session;
            const attachments = session && session.attachments ? session.attachments : [];

            // Tworzymy unikalny klucz dla klienta
            const clientKey = `${client.id || client.Id}-${session.id || session.Id}-${index}`;

            return (
              <li
                key={clientKey}
                className="bg-white shadow-lg rounded-xl p-6 flex flex-col border border-gray-200 hover:bg-gray-50 transition-colors duration-300"
              >
                <h2 className="text-2xl font-semibold text-gray-800">
                  {client.name || client.Name}
                </h2>

                {(client.email || client.Email) && (
                  <p className="text-gray-600 mt-2">
                    <strong>Email:</strong>{" "}
                    <a
                      href={`mailto:${client.email || client.Email}`}
                      className="text-blue-500 hover:underline"
                    >
                      {client.email || client.Email}
                    </a>
                  </p>
                )}
                {session && (
                  <div className="mt-4">
                    <h3 className="text-xl font-medium text-gray-700">
                      Ostatnia Sesja:
                    </h3>
                    <p className="text-gray-600 mt-1">
                      <strong>Data:</strong>{" "}
                      {new Date(session.date || session.Date).toLocaleString()}
                    </p>
                    {(session.descriptionFromCalendar || session.DescriptionFromCalendar) && (
                      <p className="text-gray-600 mt-1">
                        <strong>Opis:</strong>{" "}
                        {session.descriptionFromCalendar || session.DescriptionFromCalendar}
                      </p>
                    )}
                    {session.artist && (
                      <p className="text-gray-600 mt-1">
                        <strong>Artysta:</strong>{" "}
                        {session.artist.name || session.artist.Name}
                      </p>
                    )}
                    {/* Dodanie nowego pola "Klient studia" */}
                {(client.isStudioClient !== undefined || client.IsStudioClient !== undefined) && (
                  <p className="text-gray-600 mt-2">
                    <strong>Klient studia:</strong>{" "}
                    {(client.isStudioClient || client.IsStudioClient) ? 'tak' : 'nie'}
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
                      {attachments.map((attachment, attIndex) => {
                        // Tworzymy unikalny klucz dla załącznika
                        const attachmentKey = `${attachment.id || attachment.Id}-${session.id || session.Id}-${attIndex}`;

                        return (
                          <a
                            key={attachmentKey}
                            href={attachment.url || attachment.Url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block"
                          >
                            <Image
                              src={attachment.url || attachment.Url}
                              alt={`Załącznik ${attIndex + 1}`}
                              width={128}
                              height={128}
                              className="object-cover rounded-md border border-gray-300 hover:shadow-lg transition-shadow duration-200"
                            />
                          </a>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Dodanie przycisku "rozlicz" */}
                <div className="mt-6">
                  <Link
                    href={`/audit/session/${session.id || session.Id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors duration-200 text-center"
                  >
                    Rozlicz
                  </Link>
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
  startDate: PropTypes.instanceOf(Date).isRequired,
  endDate: PropTypes.instanceOf(Date).isRequired,
};
