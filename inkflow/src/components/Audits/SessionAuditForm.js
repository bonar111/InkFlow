// src/components/Audits/SessionAuditForm.js
"use client";

import React, { useState } from "react";
import axios from "../../utils/axiosConfig";
import { useRouter } from 'next/router';

export default function SessionAuditForm() {
  const router = useRouter();
  const { sessionId } = router.query; // Pobierz sessionId z URL

  const [formData, setFormData] = useState({
    SessionId: sessionId || "",
    ClientId: "",
    FinalPrice: "",
    ProcessedBy: "",
    LegalDocumentsPhotos: [],
    TattooPhotos: [],
  });

  const [error, setError] = useState(null);

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
      // Obsługa błędu
      setError(err.message || "Wystąpił błąd podczas rozliczania sesji.");
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

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Rozlicz Sesję</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form onSubmit={handleSubmit}>
        {/* SessionId */}
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2">
            ID Sesji
          </label>
          <input
            type="text"
            name="SessionId"
            value={formData.SessionId}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
            readOnly
          />
        </div>

        {/* ClientId */}
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2">
            ID Klienta
          </label>
          <input
            type="text"
            name="ClientId"
            value={formData.ClientId}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
          />
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
