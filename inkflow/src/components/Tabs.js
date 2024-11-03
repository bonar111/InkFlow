// src/components/Tabs.js
"use client";

import { useState } from 'react';
import ClientsList from './ClientsList'; // Importujemy komponent do wyświetlania klientów

export default function Tabs() {
  const tabs = [
    {
      label: '1 dzień temu',
      daysAgo: 1,
      message: `Hej! 🌟 Jak się czujesz po naszej sesji? Mam nadzieję, że tatuaż prezentuje się świetnie! ✨ Pamiętaj o odpowiedniej pielęgnacji – to klucz do tego, aby tatuaż wyglądał perfekcyjnie przez długi czas 🧴. Jeśli będziesz mieć pytania, śmiało pisz – jestem tutaj, aby pomóc! 🙌 Życzę szybkiego gojenia i pięknego efektu! 💖`,
    },
    {
      label: '10 dni temu',
      daysAgo: 10,
      message: `Cześć! 😊 Minęło już 10 dni – jak się miewa Twój tatuaż? Jak przebiega proces gojenia? Jeśli masz chwilkę, wyślij nam zdjęcie 📸 – z radością zobaczymy, jak się prezentuje! Czekam na wieści i życzę Ci wszystkiego dobrego ✨`,
    },
    {
      label: '14 dni temu',
      daysAgo: 14,
      message: `Hej! 💫 Twoja opinia jest dla nas bardzo cenna, dlatego mamy krótką ankietę, która pomoże nam doskonalić nasze usługi 🌱. Jeśli możesz poświęcić pół minuty, będziemy bardzo wdzięczni! 🫶 Dziękujemy za czas i wsparcie! https://forms.gle/AnMQ4qrkjw1teuHy7`,
    },
    {
      label: '30 dni temu',
      daysAgo: 30,
      message: `Cześć! 🥳 Jeśli jesteś zadowolony/a z tatuażu i naszej współpracy, to mamy dla Ciebie specjalną ofertę! 🎉 Poleć nasze studio znajomym, a jeśli przynajmniej jedna osoba się zdecyduje, Ty dostaniesz 10% rabatu na kolejną sesję 🖤, a Twoja polecona osoba również otrzyma 10% zniżki! 🫶 Dzięki za wsparcie i do zobaczenia!`,
    },
    {
      label: '90 dni temu',
      daysAgo: 90,
      message: `Hej! 🌟 Minęły już trzy miesiące od naszej sesji – mam nadzieję, że Twój tatuaż jest zjawiskowy i cieszy Cię każdego dnia na nowo! 🎨 Jeśli zastanawiasz się nad czymś nowym lub chcesz rozbudować obecny projekt, przygotowaliśmy dla Ciebie kilka inspiracji, które idealnie go uzupełnią! 💡 Spójrz na nie i daj znać, co myślisz – zawsze chętnie stworzymy coś wyjątkowego razem z Tobą! 🖤`,
    },
    {
      label: '180 dni temu',
      daysAgo: 180,
      message: `Hej! ✨ Wiesz, że minęło już pół roku od naszego ostatniego spotkania? Może to idealny moment na nową przygodę z tatuażem? 🎨 Jeśli myślisz o kolejnym projekcie lub rozbudowie obecnego, mamy specjalną ofertę dla naszych stałych klientów 🖤. Z radością stworzymy dla Ciebie coś pięknego! Jeśli masz ochotę, napisz do nas – razem stworzymy coś wyjątkowego! 🫶`,
    },
  ];

  const [activeTab, setActiveTab] = useState(tabs[0]);
  const [copySuccess, setCopySuccess] = useState('');

  const handleCopy = () => {
    navigator.clipboard.writeText(activeTab.message).then(
      () => {
        setCopySuccess('Skopiowano do schowka!');
        setTimeout(() => setCopySuccess(''), 2000);
      },
      (err) => {
        console.error('Nie można skopiować tekstu: ', err);
      }
    );
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      {/* Pasek zakładek */}
      <div className="flex overflow-x-auto border-b mb-4">
        {tabs.map((tab) => (
          <button
            key={tab.daysAgo}
            onClick={() => setActiveTab(tab)}
            className={`flex-shrink-0 px-4 py-2 -mb-px font-semibold border-b-2 ${
              activeTab.daysAgo === tab.daysAgo
                ? 'border-blue-500 text-blue-500'
                : 'border-transparent text-gray-600'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tekst wiadomości i przycisk kopiowania */}
      <div className="mb-4">
        <p className="whitespace-pre-wrap text-gray-800">{activeTab.message}</p>
        <button
          onClick={handleCopy}
          className="w-full mt-2 flex justify-center items-center px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors duration-200"
        >
          Kopiuj tekst
        </button>
        {copySuccess && <p className="text-green-500 mt-2 text-center">{copySuccess}</p>}
      </div>

      {/* Listing klientów */}
      <div>
        <ClientsList daysAgo={activeTab.daysAgo} />
      </div>
    </div>
  );
}
