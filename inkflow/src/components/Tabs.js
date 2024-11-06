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
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Pasek zakładek */}
      <div className="flex flex-wrap border-b mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.daysAgo}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 mr-2 mb-2 sm:mb-0 font-semibold border-b-2 rounded-t-lg transition-colors duration-200 ${
              activeTab.daysAgo === tab.daysAgo
                ? 'border-blue-500 text-blue-500 bg-blue-50'
                : 'border-transparent text-gray-600 hover:text-blue-500 hover:border-blue-300'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tekst wiadomości i przycisk kopiowania */}
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start mb-8">
        <div className="flex-1">
          <p className="whitespace-pre-wrap text-gray-800">{activeTab.message}</p>
        </div>
        <div className="mt-4 lg:mt-0 lg:ml-4">
          <button
            onClick={handleCopy}
            className="w-full sm:w-auto flex justify-center items-center px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors duration-200"
          >
            Kopiuj tekst
          </button>
          {copySuccess && <p className="text-green-500 mt-2 text-center sm:text-left">{copySuccess}</p>}
        </div>
      </div>

      {/* Listing klientów */}
      <div>
        <ClientsList daysAgo={activeTab.daysAgo} />
      </div>
    </div>
  );
}
