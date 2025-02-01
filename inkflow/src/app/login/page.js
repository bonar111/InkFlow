"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "../../utils/axiosConfig";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      // Endpoint logowania to /api/auth/login (w Twoim backendzie)
      const response = await axios.post("/api/auth/login", {
        username,
        password,
      });
      const { token } = response.data;

      // Zapisz token w localStorage
      localStorage.setItem("token", token);

      // Przekieruj na stronę główną (lub inną)
      router.push("/");
    } catch (err) {
      console.error(err);
      // Obsługa komunikatów błędu
      if (err.response && err.response.data) {
        // Jeśli backend zwraca np. "Nieprawidłowe dane logowania."
        setError(err.response.data);
      } else {
        setError("Błąd logowania. Sprawdź połączenie z serwerem.");
      }
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8 p-4 border border-gray-300 rounded">
      <h1 className="text-2xl mb-4">Logowanie</h1>
      {error && <p className="text-red-600 mb-2">{error}</p>}
      <form onSubmit={handleLogin} className="flex flex-col space-y-4">
        <input
          type="text"
          placeholder="Login"
          className="p-2 border border-gray-300 rounded"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          type="password"
          placeholder="Hasło"
          className="p-2 border border-gray-300 rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          type="submit"
          className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          Zaloguj
        </button>
      </form>
    </div>
  );
}
