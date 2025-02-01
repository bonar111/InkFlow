"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { isTokenExpired } from "../utils/axiosConfig";

export default function Home() {
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token || isTokenExpired(token)) {
      // Jeśli brak tokena lub jest wygasły -> przekieruj do logowania
      localStorage.removeItem("token");
      router.push("login");
    } else {
      // Jeśli token jest OK -> zakończ ładowanie
      setLoading(false);
    }
  }, [router]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-500">Sprawdzanie autoryzacji...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Witaj w InkFlow!</h1>
      <p>Jesteś zalogowany i masz dostęp do tej strony.</p>
    </div>
  );
}
