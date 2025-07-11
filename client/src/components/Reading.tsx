import { useState, useEffect, useRef } from "react";
import { NEW_TAROT_CARD_MEANINGS_STANDARD } from "../../constants";

type Card = {
  name: string;
  image: string;
};

type ReadingProps = {
  state: {
    selectedCards: Card[];
  };
};

export default function Reading({ state }: ReadingProps) {
  const [flipped, setFlipped] = useState([false, false, false]);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [interpretation, setInterpretation] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const hasFetched = useRef(false);

  const handleFlip = (index: number) => {
    setFlipped((prev) => {
      const newFlipped = [...prev];
      newFlipped[index] = !newFlipped[index];
      return newFlipped;
    });
  };

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    const savedDate = localStorage.getItem("lastReadingDate");
    const savedInterpretation = localStorage.getItem("lastReadingText");

    if (savedDate === today && savedInterpretation) {
      setInterpretation(savedInterpretation);
      return;
    }

    if (hasFetched.current) return;
    hasFetched.current = true;

    const fetchInterpretation = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/interpret`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ cards: state.selectedCards }),
        });

        const data = await response.json();
        setInterpretation(data.reading);
        localStorage.setItem("lastReadingDate", today);
        localStorage.setItem("lastReadingText", data.reading);
      } catch (error) {
        console.error("Failed to fetch interpretation:", error);
        setInterpretation(
          "Failed to fetch your reading. Please try again later."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchInterpretation();
  }, [state.selectedCards]);
  return (
    <div className="flex flex-col items-center justify-center px-4 py-10 bg-black text-white rounded-xl w-full max-w-6xl mx-auto shadow-[0_4px_20px_rgba(126,34,206,1)]">
      <div className="flex flex-col sm:flex-row justify-center items-center gap-8">
        {state.selectedCards.map((card, index) => {
          const meaning =
            NEW_TAROT_CARD_MEANINGS_STANDARD[card.name] ||
            "No meaning available.";
          return (
            <div
              key={card.name}
              onClick={() => handleFlip(index)}
              className="relative 
                w-48 h-72 
                sm:w-56 sm:h-80 
                lg:w-64 lg:h-[22rem] 
                xl:w-72 xl:h-[26rem] 
                2xl:w-80 2xl:h-[30rem]
                cursor-pointer perspective"
            >
              <div
                className={`transition-transform duration-700 transform-style preserve-3d w-full h-full ${
                  flipped[index] ? "rotate-y-180" : ""
                }`}
              >
                <img
                  src={card.image}
                  alt="Tarot card"
                  className="absolute w-full h-full backface-hidden rounded-xl 
                  drop-shadow-[0_0_20px_rgba(250,204,21,0.7)]"
                />
                <div
                  className="absolute w-full h-full backface-hidden rotate-y-180 
                  bg-gradient-to-br from-purple-900 to-black 
                  p-4 rounded-xl overflow-y-auto 
                  drop-shadow-[0_0_20px_rgba(250,204,21,0.7)]"
                >
                  <h2 className="text-xl font-bold text-yellow-300 mb-2">
                    {card.name}
                  </h2>
                  <p className="text-sm text-white whitespace-pre-line">
                    {meaning}
                  </p>
                </div>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setExpandedIndex(index);
                }}
                className="absolute top-1 right-1 text-white bg-black/40 hover:bg-black/60 hover:scale-110 transition-all duration-200 p-1 rounded-full text-sm"
                title="Expand card"
              >
                🔍
              </button>
            </div>
          );
        })}
      </div>

      {/* Expanded card view */}
      {expandedIndex !== null && (
        <div className="fixed inset-0 bg-black bg-opacity-90 backdrop-blur-md flex items-center justify-center z-50 p-6">
          <div className="bg-gray-900 rounded-xl max-w-5xl w-full p-6 relative overflow-y-auto max-h-full flex flex-col md:flex-row gap-8">
            <button
              onClick={() => setExpandedIndex(null)}
              className="absolute top-6 right-6 text-purple-400 hover:text-purple-300 bg-black/40 p-2 rounded-full"
            >
              ✕
            </button>
            <img
              src={state.selectedCards[expandedIndex].image}
              alt="Expanded tarot"
              className="w-full md:w-1/2 rounded-xl"
            />
            <div className="md:w-1/2 text-white">
              <h2 className="text-2xl font-bold text-yellow-400 mb-4">
                {state.selectedCards[expandedIndex].name}
              </h2>
              <p className="whitespace-pre-line text-sm">
                {NEW_TAROT_CARD_MEANINGS_STANDARD[
                  state.selectedCards[expandedIndex].name
                ] || "No meaning available."}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Loader or interpretation */}
      <div className="mt-10 lg:px-12 text-center text-white">
        {loading ? (
          <p className="text-yellow-300 animate-pulse">
            Divining the future...
          </p>
        ) : interpretation ? (
          <div className="bg-gray-900 p-6 rounded-xl border border-yellow-500 shadow-[0_4px_20px_rgba(245,158,11,1)]">
            <h3 className="text-2xl font-bold text-yellow-400 mb-2">
              Mystic Interpretation
            </h3>
            <p className="whitespace-pre-line text-white text-sm">
              {interpretation}
            </p>
            <p className="p-8 text-yellow-500 italic">
              ✨ Please come back tomorrow for your next reading ✨
            </p>
          </div>
        ) : null}
      </div>
    </div>
  );
}
