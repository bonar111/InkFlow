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
  const [loading, setLoading] = useState(true);

  // Pobierz dane sesji i klienta po załadowaniu komponentu
  useEffect(() => {
    const fetchSessionData = async () => {
      setLoading(true);
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
        let errorMessage = "Wystąpił błąd podczas pobierania danych sesji.";
        if (err.response) {
          const { status, data } = err.response;
          if (status === 400 || status === 404 || status === 409) {
            if (typeof data === 'string') {
              errorMessage = data;
            } else if (data && data.title) {
              errorMessage = data.title;
            } else {
              errorMessage = "Nie znaleziono danych dla podanej sesji lub sesja została już rozliczona.";
            }
          } else if (status === 500) {
            errorMessage = "Wystąpił błąd serwera. Spróbuj ponownie później.";
          } else {
            errorMessage = data?.message || errorMessage;
          }
        } else {
          errorMessage = err.message || errorMessage;
        }
        console.error(err); // Logowanie błędu do konsoli
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    if (sessionId) {
      fetchSessionData();
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
      let errorMessage = "Wystąpił błąd podczas rozliczania sesji.";
      if (err.response) {
        const { status, data } = err.response;
        if (status === 400 || status === 409) {
          if (typeof data === 'string') {
            errorMessage = data;
          } else if (data && data.title) {
            errorMessage = data.title;
          } else {
            errorMessage = "Nie można rozliczyć tej sesji.";
          }
        } else if (status === 500) {
          errorMessage = "Wystąpił błąd serwera. Spróbuj ponownie później.";
        } else {
          errorMessage = data?.message || errorMessage;
        }
      } else {
        errorMessage = err.message || errorMessage;
      }
      console.error(err); // Logowanie błędu do konsoli
      setError(errorMessage);
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

  if (loading) {
    return <p className="text-gray-500">Ładowanie danych sesji...</p>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  if (!sessionData) {
    return <p className="text-gray-500">Brak danych do wyświetlenia.</p>;
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
