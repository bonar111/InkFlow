"use client";

import { useState } from 'react';
import ClientsList from './ClientsList'; // Importujemy komponent do wyświetlania klientów

export default function Tabs() {
  const tabs = [
    {
      label: '2 dni temu',
      daysAgo: 2,
      message1: `Dzień dobry! 🌟 Jak się Pani czuje po ostatniej sesji w naszym studiu? Mam nadzieję, że tatuaż prezentuje się wspaniale! ✨ Przypominam o odpowiedniej pielęgnacji – to klucz, aby efekt cieszył przez długi czas 🧴. W razie jakichkolwiek pytań, proszę śmiało pisać – zespół studia jest tu, aby pomóc! 🙌 Życzę szybkiego gojenia i pięknego efektu! 💖`,
      message2: `Cześć! 🌟 Jak się czujesz po naszej ostatniej sesji? Mam nadzieję, że tatuaż wygląda świetnie i że jesteś zadowolona z efektu! ✨ Pamiętaj o pielęgnacji – to klucz, aby tatuaż zachował piękny wygląd na lata 🧴. Jeśli masz pytania, śmiało pisz – jestem tu, żeby pomóc! 🙌 Życzę szybkiego gojenia i pięknego efektu! 💖`
    },
    {
      label: '14 dni temu',
      daysAgo: 14,
      message1: `Dzień dobry! 😊 Minęły już dwa tygodnie od wykonania tatuażu – mam nadzieję, że proces gojenia przebiega pomyślnie. Jeśli to możliwe, prosimy o przesłanie zdjęcia 📸 (najlepiej w świetle dziennym) – z przyjemnością zobaczymy, jak tatuaż się prezentuje! Czekamy na wiadomość i życzymy wszystkiego dobrego ✨`,
      message2: `Cześć! 😊 Minęły już dwa tygodnie od naszego spotkania – mam nadzieję, że gojenie przebiega bez problemów. Jeśli możesz, podeślij mi zdjęcie tatuażu 📸 (najlepiej w świetle dziennym) – chętnie zobaczę, jak się prezentuje! Czekam na wiadomość i życzę wszystkiego dobrego ✨`
    },
    {
      label: '21 dni temu',
      daysAgo: 21,
      message1: `Dzień dobry! 💫 Tu Martyna, menadżerka naszego studia. Minęły już 3 tygodnie od Państwa wizyty – mam nadzieję, że tatuaż przynosi wiele satysfakcji! Byłabym bardzo wdzięczna, gdyby mogli Państwo podzielić się swoimi wrażeniami z wizyty, abyśmy mogli jeszcze lepiej dostosować nasze usługi do oczekiwań klientów. Przygotowaliśmy krótką ankietę, której wypełnienie zajmie dosłownie chwilę, a każda odpowiedź jest dla nas bardzo cenna 🌱. Z góry dziękuję za poświęcony czas i wsparcie! 🫶 https://forms.gle/AnMQ4qrkjw1teuHy7`,
    },
    {
      label: '30 dni temu',
      daysAgo: 30,
      message1: `Witam ponownie! 🥳 Jeśli jest Pani/Pan zadowolona/y z tatuażu i naszej współpracy, to mamy specjalną ofertę! 🎉 Poleć nasze studio znajomym, a jeśli przynajmniej jedna osoba się zdecyduje, Ty dostaniesz 10% rabatu na kolejną sesję 🖤, a Twoja polecona osoba również otrzyma 10% zniżki! 🫶 Dzięki za wsparcie i do zobaczenia!`,
    },
    {
      label: '90 dni temu',
      daysAgo: 90,
      message1: `Dzień dobry,
Minęły już trzy miesiące od Pani/Pana ostatniej wizyty w naszym studiu. Mamy nadzieję, że wykonany tatuaż spełnia oczekiwania i przynosi wiele radości!

Z przyjemnością informujemy, że w ramach podziękowania za zaufanie i współpracę, przygotowaliśmy 10% rabatu na kolejną sesję. Wystarczy zarezerwować termin w ciągu najbliższego tygodnia, natomiast samą sesję można zaplanować w dogodnym dla Pani/Pana terminie.

Zachęcam do kontaktu – zespół naszego studia z radością pomoże w realizacji Państwa nowych pomysłów!

Pozdrawiam serdecznie,
Martyna
Managerka Studio Tatuażu Ekspresja`,
      message2: `Cześć! 😊 Minęły już trzy miesiące od naszej ostatniej sesji – mam nadzieję, że tatuaż przynosi Ci mnóstwo radości każdego dnia! Jeśli zastanawiasz się nad kolejnym projektem lub chcesz rozbudować obecny, z przyjemnością pomogę stworzyć coś wyjątkowego 🌟. Daj znać, jeśli masz pomysł – chętnie pomogę go zrealizować! 🖤`
    },
    {
      label: '180 dni temu',
      daysAgo: 180,
      message1: `Dzień dobry! ✨
Minęło już pół roku od Państwa ostatniej wizyty w naszym studiu – może to idealny moment na kolejną przygodę z tatuażem? 🎨 Jeśli pojawił się pomysł na nowy projekt lub rozbudowę istniejącego tatuażu, mam przyjemność zaproponować specjalną ofertę dla naszych stałych klientów 🖤.

W razie zainteresowania serdecznie zapraszam do kontaktu – razem stworzymy coś wyjątkowego! 🫶

Pozdrawiam serdecznie,
Martyna
Managerka Studia Tatuażu Ekspresja`,
      message2: `Dzień dobry! ✨
Minęło już pół roku od naszego ostatniego spotkania – może to idealny moment na kolejną przygodę z tatuażem? 🎨 Jeśli masz pomysł na nowy projekt albo chciałbyś rozbudować istniejący tatuaż, przygotowałam specjalną ofertę dla stałych klientów 🖤.

Jeśli jesteś zainteresowana, napisz śmiało – razem stworzymy coś wyjątkowego!`,
    },
  ];

  const [activeTab, setActiveTab] = useState(tabs[0]);
  const [copySuccess, setCopySuccess] = useState('');

  const handleCopy = (message) => {
    navigator.clipboard.writeText(message).then(
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
          <p className="whitespace-pre-wrap text-gray-800">{activeTab.message1}</p>
        </div>
        <div className="mt-4 lg:mt-0 lg:ml-4">
          <button
            onClick={() => handleCopy(activeTab.message1)}
            className="w-full sm:w-auto flex justify-center items-center px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors duration-200"
          >
            Kopiuj tekst
          </button>
          {copySuccess && <p className="text-green-500 mt-2 text-center sm:text-left">{copySuccess}</p>}
        </div>
      </div>

      {activeTab.message2 && (
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start mb-8">
          <div className="flex-1">
            <p className="whitespace-pre-wrap text-gray-800">{activeTab.message2}</p>
          </div>
          <div className="mt-4 lg:mt-0 lg:ml-4">
            <button
              onClick={() => handleCopy(activeTab.message2)}
              className="w-full sm:w-auto flex justify-center items-center px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors duration-200"
            >
              Kopiuj tekst
            </button>
            {copySuccess && <p className="text-green-500 mt-2 text-center sm:text-left">{copySuccess}</p>}
          </div>
        </div>
      )}

      {/* Listing klientów */}
      <div>
        <ClientsList daysAgo={activeTab.daysAgo} />
      </div>
    </div>
  );
}
