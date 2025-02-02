"use client";

import React, { useState, useEffect } from "react";
import axios from "../../utils/axiosConfig"; // Plik z interceptorami 401
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useRouter } from "next/navigation";

/**
 * Formatowanie liczbowych kwot w złotych (PLN)
 */
function formatPLN(value) {
  if (!value || isNaN(value)) {
    return "0,00 zł";
  }
  return new Intl.NumberFormat("pl-PL", {
    style: "currency",
    currency: "PLN",
  }).format(value);
}

/**
 * Konwersja obiektu Date do stringa (YYYY-MM-DD)
 */
function formatDate(date) {
  if (!date) return "";
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export default function ReportsPage() {
  const router = useRouter();

  // Obliczamy pierwszy dzień bieżącego miesiąca (godzina 00:00)
  const now = new Date();
  const defaultStartDate = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0);
  const defaultEndDate = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    23,
    59,
    59
  );

  // Daty wybrane w react-datepicker, z domyślnymi wartościami
  const [startDate, setStartDate] = useState(defaultStartDate);
  const [endDate, setEndDate] = useState(defaultEndDate);

  // Dane z aggregated
  const [aggregatedData, setAggregatedData] = useState(null);

  // Dane z extended
  const [extendedData, setExtendedData] = useState(null);

  // Obsługa błędów i ładowania
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  /**
   * Przy montowaniu komponentu – sprawdzamy token;
   * Jeśli brak – przekierowanie do /login
   */
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
    }
  }, [router]);

  /**
   * Pobranie raportu aggregated (z datami)
   */
  const fetchAggregatedReport = async () => {
    setError(null);
    setAggregatedData(null);
    setLoading(true);

    // Walidacja dat
    if (!startDate || !endDate) {
      setError("Proszę wybrać obie daty (początkową i końcową).");
      setLoading(false);
      return;
    }
    if (startDate > endDate) {
      setError("Data początkowa nie może być późniejsza niż końcowa.");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get("/api/reporting/aggregated", {
        params: {
          startDate: formatDate(startDate),
          endDate: formatDate(endDate),
        },
      });
      setAggregatedData(response.data);
    } catch (err) {
      console.error(err);
      setError("Błąd pobierania raportu aggregated.");
    } finally {
      setLoading(false);
    }
  };

  /**
   * Pobranie raportu extendedAggregatedreport (bez dat)
   */
  const fetchExtendedReport = async () => {
    setError(null);
    setExtendedData(null);
    setLoading(true);

    try {
      const response = await axios.get("/api/reporting/extendedAggregatedreport");
      setExtendedData(response.data);
    } catch (err) {
      console.error(err);
      setError("Błąd pobierania raportu extended.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Raporty</h1>

      {/* AGGREGATED SECTION */}
      <section className="mb-12 bg-white p-6 shadow-md rounded">
        <h2 className="text-xl font-semibold mb-4">Aggregated Report</h2>

        {/* Daty + przycisk */}
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <div>
            <label className="block text-gray-600 mb-1">Data początkowa</label>
            <DatePicker
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              dateFormat="yyyy-MM-dd"
              className="border rounded px-2 py-1"
              placeholderText="Wybierz datę początkową"
            />
          </div>
          <div>
            <label className="block text-gray-600 mb-1">Data końcowa</label>
            <DatePicker
              selected={endDate}
              onChange={(date) => setEndDate(date)}
              dateFormat="yyyy-MM-dd"
              className="border rounded px-2 py-1"
              placeholderText="Wybierz datę końcową"
            />
          </div>
          <button
            onClick={fetchAggregatedReport}
            className="mt-6 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition self-start"
          >
            Pobierz Aggregated
          </button>
        </div>

        {/* Ewentualny komunikat o błędzie / ładowaniu */}
        {loading && <p className="text-gray-500">Wczytywanie...</p>}
        {error && <p className="text-red-600">{error}</p>}

        {/* Dane aggregated */}
        {aggregatedData && !loading && (
          <div className="mt-4">
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Całkowity przychód:</strong>{" "}
                {formatPLN(aggregatedData.totalRevenue)}
              </li>
              <li>
                <strong>Przychód od klientów studia:</strong>{" "}
                {formatPLN(aggregatedData.studioClientRevenue)}
              </li>
              <li>
                <strong>Przychód od klientów tatuażystów:</strong>{" "}
                {formatPLN(aggregatedData.tattooistClientRevenue)}
              </li>
              <li>
                <strong>Liczba wszystkich tatuaży:</strong>{" "}
                {aggregatedData.totalTattoos}
              </li>
            </ul>

            {/* Tabela - przychód per tatuażysta */}
            {aggregatedData.revenuePerTattooist &&
              aggregatedData.revenuePerTattooist.length > 0 && (
                <div className="mt-6">
                  <h4 className="font-semibold mb-2">Przychód per tatuażysta</h4>
                  <table className="w-full border border-gray-200 text-sm">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="px-4 py-2 border">Tattooist Name</th>
                        <th className="px-4 py-2 border">Revenue</th>
                      </tr>
                    </thead>
                    <tbody>
                      {aggregatedData.revenuePerTattooist.map((item) => (
                        <tr key={item.tattooistId} className="border-b">
                          <td className="px-4 py-2 border">{item.tattooistName}</td>
                          <td className="px-4 py-2 border">
                            {formatPLN(item.revenue)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
          </div>
        )}
      </section>

      {/* EXTENDED SECTION */}
      <section className="bg-white p-6 shadow-md rounded">
        <h2 className="text-xl font-semibold mb-4">Extended Aggregated Report</h2>
        <p className="text-sm text-gray-600 mb-4">
          Ten raport nie wymaga podania zakresu dat; backend sam je ustala.
        </p>

        <button
          onClick={fetchExtendedReport}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Pobierz Extended
        </button>

        {loading && <p className="text-gray-500 mt-4">Wczytywanie...</p>}
        {error && <p className="text-red-600 mt-4">{error}</p>}

        {extendedData && !loading && (
          <div className="mt-4">
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Powracający klienci (3 mies.):</strong>{" "}
                {extendedData.returningClientsCountIn3Months}
              </li>
              <li>
                <strong>Powracający klienci (6 mies.):</strong>{" "}
                {extendedData.returningClientsCountIn6Months}
              </li>
              <li>
                <strong>Powracający klienci (12 mies.):</strong>{" "}
                {extendedData.returningClientsCountIn12Months}
              </li>
            </ul>

            {/* Tabela - Powracający klienci (3 mies.) */}
            {extendedData.returningClientsPerTattooistIn3Months &&
              extendedData.returningClientsPerTattooistIn3Months.length > 0 && (
                <div className="mt-6">
                  <h4 className="font-semibold mb-2">
                    Powracający klienci per tatuażysta (3 mies.)
                  </h4>
                  <table className="w-full border border-gray-200 text-sm">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="px-4 py-2 border">Tattooist ID</th>
                        <th className="px-4 py-2 border">Tattooist Name</th>
                        <th className="px-4 py-2 border">Returning Clients</th>
                      </tr>
                    </thead>
                    <tbody>
                      {extendedData.returningClientsPerTattooistIn3Months.map((t) => (
                        <tr key={t.tattooistId} className="border-b">
                          <td className="px-4 py-2 border">{t.tattooistId}</td>
                          <td className="px-4 py-2 border">{t.tattooistName}</td>
                          <td className="px-4 py-2 border">
                            {t.returningClientsCount}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

            {/* Tabela - Powracający klienci (6 mies.) */}
            {extendedData.returningClientsPerTattooistIn6Months &&
              extendedData.returningClientsPerTattooistIn6Months.length > 0 && (
                <div className="mt-6">
                  <h4 className="font-semibold mb-2">
                    Powracający klienci per tatuażysta (6 mies.)
                  </h4>
                  <table className="w-full border border-gray-200 text-sm">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="px-4 py-2 border">Tattooist ID</th>
                        <th className="px-4 py-2 border">Tattooist Name</th>
                        <th className="px-4 py-2 border">Returning Clients</th>
                      </tr>
                    </thead>
                    <tbody>
                      {extendedData.returningClientsPerTattooistIn6Months.map((t) => (
                        <tr key={t.tattooistId} className="border-b">
                          <td className="px-4 py-2 border">{t.tattooistId}</td>
                          <td className="px-4 py-2 border">{t.tattooistName}</td>
                          <td className="px-4 py-2 border">
                            {t.returningClientsCount}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

            {/* Tabela - Powracający klienci (12 mies.) */}
            {extendedData.returningClientsPerTattooistIn12Months &&
              extendedData.returningClientsPerTattooistIn12Months.length > 0 && (
                <div className="mt-6">
                  <h4 className="font-semibold mb-2">
                    Powracający klienci per tatuażysta (12 mies.)
                  </h4>
                  <table className="w-full border border-gray-200 text-sm">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="px-4 py-2 border">Tattooist ID</th>
                        <th className="px-4 py-2 border">Tattooist Name</th>
                        <th className="px-4 py-2 border">Returning Clients</th>
                      </tr>
                    </thead>
                    <tbody>
                      {extendedData.returningClientsPerTattooistIn12Months.map((t) => (
                        <tr key={t.tattooistId} className="border-b">
                          <td className="px-4 py-2 border">{t.tattooistId}</td>
                          <td className="px-4 py-2 border">{t.tattooistName}</td>
                          <td className="px-4 py-2 border">
                            {t.returningClientsCount}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
          </div>
        )}
      </section>
    </div>
  );
}
