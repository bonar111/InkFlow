"use client";

import React, { useState, useEffect } from "react";
import axios from "../../utils/axiosConfig";

export default function SessionAuditForm({ sessionId }) {
  const [formData, setFormData] = useState({
    SessionId: sessionId || "",
    ClientId: "",
    FinalPrice: "",
    ProcessedBy: "Marzena Bonar",
    LegalDocumentsPhotos: [],
    TattooPhotos: [],
  });

  const [errors, setErrors] = useState({
    FinalPrice: "",
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
            if (typeof data === "string") {
              errorMessage = data;
            } else if (data && data.title) {
              errorMessage = data.title;
            } else {
              errorMessage =
                "Nie znaleziono danych dla podanej sesji lub sesja została już rozliczona.";
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

  // Funkcja walidująca FinalPrice
  const validateFinalPrice = (value) => {
    let error = "";

    if (value === "") {
      error = "Cena końcowa jest wymagana.";
    } else {
      const numberValue = Number(value);

      if (!Number.isInteger(numberValue)) {
        error = "Cena musi być liczbą całkowitą.";
      } else if (numberValue < 0 || numberValue > 5000) {
        error = "Cena musi być w zakresie od 0 do 5000.";
      }
    }

    setErrors((prevErrors) => ({
      ...prevErrors,
      FinalPrice: error,
    }));

    return error === "";
  };

  // Obsługa wysłania formularza
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // Przeprowadź walidację FinalPrice przed wysłaniem formularza
    const isFinalPriceValid = validateFinalPrice(formData.FinalPrice);

    if (!isFinalPriceValid) {
      // Możesz dodać więcej walidacji dla innych pól tutaj
      return; // Zatrzymaj wysyłanie formularza, jeśli walidacja nie powiodła się
    }

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
      // Opcjonalnie: możesz zresetować formularz lub przekierować użytkownika
    } catch (err) {
      let errorMessage = "Wystąpił błąd podczas rozliczania sesji.";
      if (err.response) {
        const { status, data } = err.response;
        if (status === 400 || status === 409) {
          if (typeof data === "string") {
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

      // Jeśli zmienia się FinalPrice, przeprowadź walidację na bieżąco
      if (name === "FinalPrice") {
        validateFinalPrice(value);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-500">Ładowanie danych sesji...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (!sessionData) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-500">Brak danych do wyświetlenia.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-3xl font-bold mb-6 text-center">Rozlicz Sesję</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
        {/* Wyświetlenie informacji o sesji i kliencie */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4">Informacje o sesji</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <p>
              <span className="font-medium">Klient:</span> {sessionData.name || sessionData.Name}
            </p>
            <p>
              <span className="font-medium">Email:</span> {sessionData.email || sessionData.Email}
            </p>
            <p>
              <span className="font-medium">Data sesji:</span>{" "}
              {new Date(
                sessionData.session.date || sessionData.session.Date
              ).toLocaleString()}
            </p>
          </div>
        </div>

        {/* FinalPrice */}
        <div className="mb-6">
          <label htmlFor="FinalPrice" className="block text-gray-700 font-semibold mb-2">
            Cena Końcowa (razem z zadatkiem):
          </label>
          <input
            type="number"
            name="FinalPrice"
            id="FinalPrice"
            value={formData.FinalPrice}
            onChange={handleChange}
            className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.FinalPrice ? "border-red-500" : "border-gray-300"
            }`}
            required
            min="0"
            max="5000"
            step="1"
          />
          {errors.FinalPrice && (
            <p className="text-red-500 text-sm mt-1">{errors.FinalPrice}</p>
          )}
        </div>

        {/* ProcessedBy */}
        <div className="mb-6">
          <label htmlFor="ProcessedBy" className="block text-gray-700 font-semibold mb-2">
            Rozliczone przez:
          </label>
          <input
            type="text"
            name="ProcessedBy"
            id="ProcessedBy"
            value={formData.ProcessedBy}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* LegalDocumentsPhotos */}
        <div className="mb-6">
          <label htmlFor="LegalDocumentsPhotos" className="block text-gray-700 font-semibold mb-2">
            Zdjęcia Dokumentów Prawnych
          </label>
          <input
            type="file"
            name="LegalDocumentsPhotos"
            id="LegalDocumentsPhotos"
            multiple
            onChange={handleChange}
            className="w-full"
          />
        </div>

        {/* TattooPhotos */}
        <div className="mb-6">
          <label htmlFor="TattooPhotos" className="block text-gray-700 font-semibold mb-2">
            Zdjęcia Tatuażu
          </label>
          <input
            type="file"
            name="TattooPhotos"
            id="TattooPhotos"
            multiple
            onChange={handleChange}
            className="w-full"
          />
        </div>

        {/* Przycisk wysyłania */}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 rounded-md font-semibold hover:bg-blue-700 transition duration-200"
        >
          Rozlicz Sesję
        </button>
      </form>
    </div>
  );
}
