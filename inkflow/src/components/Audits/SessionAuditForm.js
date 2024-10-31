// src/app/components/Audits/SessionAuditForm.js

"use client";

import React, { useState, useEffect } from "react";
import axios from "../../utils/axiosConfig";

export default function SessionAuditForm({ sessionId }) {
  const [formData, setFormData] = useState({
    SessionId: sessionId || "",
    ClientId: "",
    FinalPrice: "",
    ProcessedBy: "",
    LegalDocumentsPhotos: [],
    TattooPhotos: [],
  });

  const [sessionData, setSessionData] = useState(null);
  const [error, setError] = useState(null);
  const [loadingSessionData, setLoadingSessionData] = useState(true);

  // Pobierz dane sesji i klienta po załadowaniu komponentu
  useEffect(() => {
    const fetchSessionData = async () => {
      setLoadingSessionData(true);
      try {
        const response = await axios.get(`/api/finance/session-before-audit`, {
          params: { sessionId },
        });
        const data = response.data;

        setSessionData(data);

        // Ustaw ClientId w formData
        setFormData((prevData) => ({
          ...prevData,
          ClientId: data.id || data.Id || "",
        }));
      } catch (err) {
        if (err.response) {
          const { status, data } = err.response;
          if (status === 400) {
            setError(data || "Nieprawidłowe dane wejściowe.");
          } else if (status === 404) {
            setError(data || "Nie znaleziono sesji o podanym ID.");
          } else if (status === 409) {
            setError(data || "Sesja została już rozliczona.");
          } else if (status === 500) {
            setError("Wystąpił błąd serwera. Spróbuj ponownie później.");
          } else {
            setError("Wystąpił nieznany błąd.");
          }
        } else {
          setError(err.message || "Wystąpił błąd podczas pobierania danych sesji.");
        }
      } finally {
        setLoadingSessionData(false);
      }
    };

    if (sessionId) {
      fetchSessionData();
    } else {
      setError("Brak ID sesji.");
      setLoadingSessionData(false);
    }
  }, [sessionId]);

  // Obsługa wysłania formularza
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      // Przygotuj dane formularza do wysłania
      const data = new FormData();
      data.append("SessionId", formData.SessionId);
      data.append("ClientId", formData.ClientId);
      data.append("FinalPrice", formData.FinalPrice);
      data.append("ProcessedBy", formData.ProcessedBy);

      formData.LegalDocumentsPhotos.forEach((file) => {
        data.append("LegalDocumentsPhotos", file);
      });

      formData.TattooPhotos.forEach((file) => {
        data.append("TattooPhotos", file);
      });

      await axios.post("/api/finance/sessionaudit", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // Obsługa sukcesu (np. przekierowanie lub wyświetlenie komunikatu)
      alert("Sesja została pomyślnie rozliczona.");
    } catch (err) {
      if (err.response) {
        const { status, data } = err.response;
        if (status === 400) {
          setError(data || "Nieprawidłowe dane wejściowe.");
        } else if (status === 409) {
          setError(data || "Sesja została już rozliczona.");
        } else if (status === 500) {
          setError("Wystąpił błąd serwera. Spróbuj ponownie później.");
        } else {
          setError("Wystąpił nieznany błąd.");
        }
      } else {
        setError(err.message || "Wystąpił błąd podczas rozliczania sesji.");
      }
    }
  };

  // Obsługa zmian w polach formularza
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setFormData((prevData) => ({
        ...prevData,
        [name]: Array.from(files),
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (loadingSessionData) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-gray-500">Ładowanie danych sesji...</p>
      </div>
    );
  }

  if (!sessionData) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-red-500">Nie znaleziono danych sesji.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Rozlicz Sesję</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form onSubmit={handleSubmit}>
        {/* Wyświetlenie informacji o sesji i kliencie */}
        <div className="mb-4">
          <p>
            <strong>Klient:</strong> {sessionData.name || sessionData.Name}
          </p>
          <p>
            <strong>Email:</strong> {sessionData.email || sessionData.Email}
          </p>
          <p>
            <strong>Data sesji:</strong>{" "}
            {new Date(sessionData.session.date || sessionData.session.Date).toLocaleString()}
          </p>
        </div>

        {/* FinalPrice */}
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2">
            Cena Końcowa
          </label>
          <input
            type="number"
            name="FinalPrice"
            value={formData.FinalPrice}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
            required
            min="0"
          />
        </div>

        {/* ProcessedBy */}
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2">
            Przetworzone przez
          </label>
          <input
            type="text"
            name="ProcessedBy"
            value={formData.ProcessedBy}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
            required
          />
        </div>

        {/* LegalDocumentsPhotos */}
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2">
            Zdjęcia Dokumentów Prawnych
          </label>
          <input
            type="file"
            name="LegalDocumentsPhotos"
            multiple
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
          />
        </div>

        {/* TattooPhotos */}
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2">
            Zdjęcia Tatuażu
          </label>
          <input
            type="file"
            name="TattooPhotos"
            multiple
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
          />
        </div>

        {/* Przycisk wysyłania */}
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors duration-200"
        >
          Rozlicz Sesję
        </button>
      </form>
    </div>
  );
}
