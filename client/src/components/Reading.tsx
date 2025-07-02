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
  const [interpretation, setInterpretation] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const hasFetched = useRef(false)

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
        const response = await fetch("http://localhost:4000/api/interpret", {
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
        setInterpretation("Failed to fetch your reading. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchInterpretation();
  }, [state.selectedCards]);
  return (
    <div className="flex flex-col items-center justify-center px-4 py-10 bg-black text-white rounded-xl w-full max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-center items-center gap-8">
        {state.selectedCards.map((card, index) => {
          const meaning =
            NEW_TAROT_CARD_MEANINGS_STANDARD[card.name] || "No meaning available.";
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
                  alt="Tarot back"
                  className="absolute w-full h-full backface-hidden rounded-xl"
                />
                <div className="absolute w-full h-full backface-hidden rotate-y-180 bg-gradient-to-br from-purple-900 to-black p-4 rounded-xl overflow-y-auto">
                  <h2 className="text-xl font-bold text-yellow-300 mb-2">
                    {card.name}
                  </h2>
                  <p className="text-sm text-white whitespace-pre-line">
                    {meaning}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Loader or interpretation */}
      <div className="mt-10 max-w-2xl text-center text-white">
        {loading ? (
          <p className="text-yellow-300 animate-pulse">Divining the future...</p>
        ) : interpretation ? (
          <div className="bg-gray-900 p-6 rounded-xl border border-yellow-500">
            <h3 className="text-2xl font-bold text-yellow-400 mb-2">Mystic Interpretation</h3>
            <p className="whitespace-pre-line text-white text-sm">{interpretation}</p>
            <p className="p-8 text-yellow-500 italic">✨ Please come back tomorrow for your next reading ✨</p>
          </div>
        ) : null}
      </div>
    </div>
  );
}
