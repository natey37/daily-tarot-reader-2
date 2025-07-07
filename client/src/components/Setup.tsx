import { useState, useEffect } from "react";
import { preloadImages } from "../utils/images";
// import { useSetupState } from "../hooks/tarotState";

type SetupProps = {
    state: {
      currentDeck: { name: string; image: string }[];
      viewedIndex: number;
      selectedCards: { name: string; image: string }[];
    };
    nextCard: () => void;
    prevCard: () => void;
    goToCardByName: (name: string) => void;
    generateReading: () => void;
  };

export default function Setup({
    state,
    nextCard,
    prevCard,
    goToCardByName,
    generateReading,
  }: SetupProps) {
  const card = state.currentDeck[state.viewedIndex];

  const [searchQuery, setSearchQuery] = useState("");
  const [showResults, setShowResults] = useState(false);

  const filtered = state.currentDeck.filter((card) =>
    card.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    const imageUrls = state.currentDeck.map(card => card.image);
    preloadImages(imageUrls);
  }, []);
  
  return (
    <div className="flex flex-col items-center text-white p-4">
      <h1 className="text-4xl font-bold text-center text-yellow-400 mb-2">
        Welcome to Daily Tarot Reader
      </h1>
      <h2 className="text-2xl text-purple-300 mb-8">Your future awaits!</h2>

      <div className="flex items-center justify-center gap-4">
        <button
          onClick={prevCard}
          className="px-4 py-2 bg-purple-700 hover:bg-purple-800 text-white rounded"
        >
          {"<"}
        </button>

        <div className="w-[233px] h-[384px] border-[6px] border-yellow-500 overflow-hidden rounded shadow-md">
          <img
            src={card.image}
            alt={card.name}
            className="w-full h-full object-cover"
          />
        </div>

        <button
          onClick={nextCard}
          className="px-4 py-2 bg-purple-700 hover:bg-purple-800 text-white rounded"
        >
          {">"}
        </button>
      </div>

      {/* <p className="mt-4 text-lg text-yellow-200">{card.name}</p> */}

      {/* <div className="p-4 mb-6 flex gap-2">
        <input
          type="text"
          placeholder="Search for a card..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="px-3 py-2 rounded border border-gray-500 text-white"
        />
        <button
          onClick={() => goToCardByName(searchTerm)}
          className="px-4 py-2 bg-purple-700 hover:bg-purple-800 rounded text-white"
        >
          Search
        </button>
      </div> */}

      <div className="mt-6 relative w-[300px]">
        <input
          type="text"
          placeholder="Search card..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setShowResults(true);
          }}
          className="text-white px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 w-full"
        />

        {showResults && searchQuery && (
          <ul className="absolute z-10 w-full bg-white border rounded shadow max-h-48 overflow-y-auto">
            {filtered.map((card) => (
              <li
                key={card.name}
                className="px-4 py-2 cursor-pointer hover:bg-purple-100 text-black"
                onClick={() => {
                  goToCardByName(card.name);
                  setShowResults(false);
                  setSearchQuery("");
                }}
              >
                {highlightMatch(card.name, searchQuery)}
              </li>
            ))}
          </ul>
        )}
      </div>

      <button
        onClick={() => generateReading()}
        className="mt-8 px-6 py-3 bg-yellow-500 hover:bg-yellow-600 text-black font-semibold rounded shadow"
      >
        Continue to your reading!
      </button>
    </div>
  );
}

function highlightMatch(text: string, query: string) {
  const parts = text.split(new RegExp(`(${query})`, "gi"));
  return (
    <>
      {parts.map((part, i) =>
        part.toLowerCase() === query.toLowerCase() ? (
          <span key={i} className="bg-yellow-300">
            {part}
          </span>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </>
  );
}
