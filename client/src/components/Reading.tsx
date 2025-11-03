import { useState, useEffect, useRef } from "react";
import { NEW_TAROT_CARD_MEANINGS_STANDARD } from "../../constants";
import domtoimage from "dom-to-image-more";
import { format } from "date-fns";

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
  const hiddenReadingRef = useRef<HTMLDivElement>(null);

  const handleDownload = async () => {
    if (!hiddenReadingRef.current) return;

    try {
      const dataUrl = await domtoimage.toPng(hiddenReadingRef.current);
      const link = document.createElement("a");
      const name = state.selectedCards.map((obj) => obj.name).join(" ");
      link.download = name;
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error("Failed to generate image:", error);
    }
  };

  const handleFlip = (index: number) => {
    setFlipped((prev) => {
      const newFlipped = [...prev];
      newFlipped[index] = !newFlipped[index];
      return newFlipped;
    });
  };

  const saveReading = (reading: {
    date: string;
    cards: Card[];
    reading: string;
  }) => {
    try {
      const readings = localStorage.getItem("readings");
      const parsedReadings = readings ? JSON.parse(readings) : [];

      parsedReadings.push({
        id: Date.now(),
        date: reading.date,
        cards: reading.cards,
        reading: reading.reading,
      });

      localStorage.setItem("readings", JSON.stringify(parsedReadings));
    } catch (error) {
      console.error("Failed to save reading:", error);
    }
  };

  useEffect(() => {
    const savedDate = localStorage.getItem("lastReadingDate");
    const savedInterpretation = localStorage.getItem("lastReadingText");
    const dateString = format(new Date(), "yyyy-MM-dd");

    if (savedDate === dateString && savedInterpretation) {
      setInterpretation(savedInterpretation);
      return;
    }

    if (hasFetched.current) return;
    hasFetched.current = true;

    const fetchInterpretation = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/api/interpret`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ cards: state.selectedCards }),
          }
        );

        const data = await response.json();

        saveReading({
          date: dateString,
          cards: state.selectedCards,
          reading: data.reading,
        });

        setInterpretation(data.reading);
        localStorage.setItem("lastReadingDate", dateString);
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
                  crossOrigin="anonymous"
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

      <div className="flex gap-4 mt-6">
        <button
          onClick={handleDownload}
          className="mt-4 px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-black rounded"
        >
          Save Reading
        </button>
      </div>

      <div
        ref={hiddenReadingRef}
        className="absolute -top-[9999px] left-0 w-[1200px] bg-[#1a1a1a] text-white border-5 border-yellow-400 p-8"
        aria-hidden="true"
      >
        <h1 className="text-center text-4xl font-bold text-[#9C8FFF] mb-8 font-serif tracking-wide">
          Daily Tarot Reader - {new Date().toLocaleDateString("en-us")}
        </h1>

        <div className="flex justify-center gap-6 mb-10">
          {state.selectedCards.map((card) => (
            <img
              key={card.name}
              src={card.image}
              alt={card.name}
              className="w-[360px] h-auto"
              draggable={false}
            />
          ))}
        </div>

        <div className="text-lg leading-relaxed text-gray-100">
          <p className="whitespace-pre-line border-none">{interpretation}</p>
        </div>
      </div>
    </div>
  );
}
