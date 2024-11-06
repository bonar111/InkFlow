// src/components/Tabs.js
"use client";

import { useState } from 'react';
import ClientsList from './ClientsList'; // Importujemy komponent do wyświetlania klientów

export default function Tabs() {
  const tabs = [
    {
      label: '1 dzień temu',
      daysAgo: 1,
      message: `Dzień dobry! 🌟 Jak samopoczucie po naszej sesji? Mam nadzieję, że tatuaż prezentuje się świetnie! ✨ Pamiętaj o odpowiedniej pielęgnacji – to klucz do tego, aby tatuaż wyglądał perfekcyjnie przez długi czas 🧴. Jeśli będziesz mieć pytania, śmiało pisz – jestem tutaj, aby pomóc! 🙌 Życzę szybkiego gojenia i pięknego efektu! 💖`,
    },
    {
      label: '14 dni temu',
      daysAgo: 14,
      message: `Dzień dobry! 😊 Minęło już 14 dni od wykonania tatuażu – mamy nadzieję, że proces gojenia przebiega pomyślnie. Jeśli mają Państwo chwilę, prosimy o przesłanie zdjęcia 📸 – z przyjemnością zobaczymy, jak tatuaż się prezentuje! Oczekujemy na wiadomość i życzymy wszystkiego dobrego ✨`,
    },
    {
      label: '21 dni temu',
      daysAgo: 21,
      message: `Dzień dobry! 💫 Państwa opinia jest dla nas niezwykle cenna, dlatego przygotowaliśmy krótką ankietę, która pomoże nam udoskonalać nasze usługi 🌱. Wypełnienie zajmie jedynie pół minuty, a my będziemy ogromnie wdzięczni za poświęcony czas. 🫶 Dziękujemy serdecznie za wsparcie! https://forms.gle/AnMQ4qrkjw1teuHy7`,
    },
    {
      label: '30 dni temu',
      daysAgo: 30,
      message: `Dzień dobry! 🥳 Jeśli jesteś zadowolony/a z tatuażu i naszej współpracy, to mamy dla Ciebie specjalną ofertę! 🎉 Poleć nasze studio znajomym, a jeśli przynajmniej jedna osoba się zdecyduje, Ty dostaniesz 10% rabatu na kolejną sesję 🖤, a Twoja polecona osoba również otrzyma 10% zniżki! 🫶 Dzięki za wsparcie i do zobaczenia!`,
    },
    {
      label: '90 dni temu',
      daysAgo: 90,
      message: `Dzień dobry! 🥳 Minęły już trzy miesiące od naszej ostatniej sesji! 😊 Mamy nadzieję, że Twój tatuaż sprawia Ci radość każdego dnia. Jeśli zastanawiasz się nad kolejnym projektem lub chcesz rozbudować obecny, mamy dla Ciebie 10% rabatu! 🌟 Wystarczy, że umówisz się na termin w ciągu najbliższego tygodnia, a samą sesję możemy zaplanować na dowolny, dogodny dla Ciebie czas. Daj znać, jeśli jesteś zainteresowany/a – z przyjemnością stworzymy coś wyjątkowego! 🖤`,
    },
    {
      label: '180 dni temu',
      daysAgo: 180,
      message: `Dzień dobry! ✨ Minęło już pół roku od naszego ostatniego spotkania – może to idealny moment na kolejną przygodę z tatuażem? 🎨 Jeśli pojawił się pomysł na nowy projekt lub rozbudowę istniejącego, przygotowaliśmy specjalną ofertę dla stałych klientów 🖤. Z przyjemnością stworzymy coś wyjątkowego! W razie zainteresowania, zapraszamy do kontaktu – razem stworzymy coś niezapomnianego! 🫶`,
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
