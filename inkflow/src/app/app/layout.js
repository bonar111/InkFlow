// app/layout.js
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { isTokenExpired } from "./utils/axiosConfig"; // import funkcji sprawdzającej ważność
import "./globals.css"; // jeśli masz globalne style

export default function RootLayout({ children }) {
  const router = useRouter();

  useEffect(() => {
    // Pobierz token z localStorage
    const token = localStorage.getItem("token");
    const currentPath = window.location.pathname;

    // Jeśli użytkownik nie ma tokena lub jest on wygasły,
    // a nie jest na stronie /login, przekieruj do /login.
    if (currentPath !== "/login") {
      if (!token || isTokenExpired(token)) {
        localStorage.removeItem("token");
        router.push("/login");
      }
    }
  }, [router]);

  return (
    <html lang="pl">
      <body>{children}</body>
    </html>
  );
}
