import { useState, useEffect } from "react";
import { NEW_TAROT_CARD_MEANINGS_STANDARD } from "../../constants";
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
  //   if (!hiddenReadingRef.current) return;

  //   try {
  //     const dataUrl = await domtoimage.toPng(hiddenReadingRef.current);
  //     const link = document.createElement("a");
  //     const name = state.selectedCards.map((obj) => obj.name).join(" ");
  //     link.download = name;
  //     link.href = dataUrl;
  //     link.click();
  //   } catch (error) {
  //     console.error("Failed to generate image:", error);
  //   }
  // };

  // const handleDownload = async () => {
  //   if (!hiddenReadingRef.current) return;

  //   try {
  //     const element = hiddenReadingRef.current;

  //     console.log("=== Starting image capture ===");
  //     console.log("Element:", element);
  //     console.log(
  //       "Card images:",
  //       state.selectedCards.map((c) => c.image)
  //     );

  //     // Check if images exist and are loaded
  //     const images = element.querySelectorAll("img");
  //     console.log("Found images:", images.length);

  //     images.forEach((img, i) => {
  //       console.log(`Image ${i}:`, {
  //         src: img.src,
  //         complete: img.complete,
  //         naturalWidth: img.naturalWidth,
  //         naturalHeight: img.naturalHeight,
  //       });
  //     });

  //     // Wait for images
  //     await Promise.all(
  //       Array.from(images).map((img, i) => {
  //         if (img.complete && img.naturalWidth > 0) {
  //           console.log(`Image ${i} already loaded`);
  //           return Promise.resolve();
  //         }
  //         console.log(`Waiting for image ${i} to load...`);
  //         return new Promise((resolve, reject) => {
  //           img.onload = () => {
  //             console.log(`Image ${i} loaded successfully`);
  //             resolve();
  //           };
  //           img.onerror = (e) => {
  //             console.error(`Image ${i} failed to load:`, e);
  //             reject(e);
  //           };
  //           // Trigger reload if needed
  //           if (!img.complete) {
  //             const src = img.src;
  //             img.src = "";
  //             img.src = src;
  //           }
  //         });
  //       })
  //     );

  //     console.log("All images loaded, positioning element...");

  //     // Position element
  //     element.style.position = "fixed";
  //     element.style.top = "0";
  //     element.style.left = "100vw";
  //     element.style.transform = "none";
  //     element.style.opacity = "1";
  //     element.style.zIndex = "9999";

  //     await new Promise((resolve) => setTimeout(resolve, 300));

  //     console.log("Calling html2canvas...");

  //     const canvas = await html2canvas(element, {
  //       scale: 2,
  //       useCORS: true,
  //       backgroundColor: "#1a1a1a",
  //       logging: true,
  //       onclone: (clonedDoc) => {
  //         console.log("Canvas cloned document");
  //       },
  //     });

  //     console.log("Canvas created:", canvas.width, "x", canvas.height);

  //     // Hide again
  //     element.style.transform = "translateX(-9999px)";
  //     element.style.opacity = "0";
  //     element.style.zIndex = "-1";
  //     element.style.left = "0";

  //     canvas.toBlob(async (blob) => {
  //       console.log("Blob created:", blob ? blob.size : "null");

  //       if (!blob) {
  //         console.error("No blob created!");
  //         return;
  //       }

  //       const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  //       console.log("Is mobile:", isMobile);
  //       console.log("Has share API:", !!navigator.share);
  //       console.log("Has canShare:", !!navigator.canShare);

  //       if (isMobile && navigator.share) {
  //         const file = new File([blob], "tarot-reading.png", {
  //           type: "image/png",
  //         });

  //         // Check if we can share files
  //         const canShareFiles =
  //           navigator.canShare && navigator.canShare({ files: [file] });
  //         console.log("Can share files:", canShareFiles);

  //         if (canShareFiles) {
  //           try {
  //             await navigator.share({
  //               files: [file],
  //               title: "My Tarot Reading",
  //             });
  //             console.log("Share successful");
  //             return;
  //           } catch (error) {
  //             console.error("Share failed:", error);
  //             // Fall through to download
  //           }
  //         }
  //       }

  //       // Fallback download
  //       console.log("Using download fallback");
  //       const url = URL.createObjectURL(blob);
  //       const link = document.createElement("a");
  //       const name = state.selectedCards.map((obj) => obj.name).join(" ");
  //       link.download = name;
  //       link.href = url;
  //       link.click();
  //       URL.revokeObjectURL(url);
  //     }, "image/png");
  //   } catch (error) {
  //     console.error("Failed to save reading:", error);
  //   }
  // };
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);

  const handleDownload = async () => {
    setIsGeneratingImage(true);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/generate-reading-image`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            cards: state.selectedCards,
            reading: interpretation,
            date: new Date().toLocaleDateString(),
          }),
        }
      );

      if (!response.ok) throw new Error("Failed to generate image");

      const blob = await response.blob();
      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
      const url = URL.createObjectURL(blob);
      const cardNames = state.selectedCards.map((obj) => obj.name).join(" ");

      // Mobile: Try Share API first, fallback to navigation
      if (isMobile) {
        // Try Share API if available
        if (navigator.share && navigator.canShare) {
          const file = new File([blob], "tarot-reading.png", {
            type: "image/png",
          });

          if (navigator.canShare({ files: [file] })) {
            try {
              await navigator.share({
                files: [file],
                title: cardNames,
              });
              // Success! Don't continue to fallback
              URL.revokeObjectURL(url);
              return;
            } catch (error) {
              // User cancelled or share failed
              if (error instanceof Error && error.name === "AbortError") {
                URL.revokeObjectURL(url);
                return;
              }
              // Other error - continue to fallback
              console.log("Share failed, using fallback:", error);
            }
          }
        }

        // Fallback: Navigate to image
        window.location.href = url;
        return; // Stop here
      }

      // Desktop: Download
      const link = document.createElement("a");
      link.download = cardNames
      link.href = url;
      link.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Failed to save reading:", error);
      alert("Failed to save reading. Please try again.");
    } finally {
      setIsGeneratingImage(false);
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
                  drop-shadow-[0_0_20px_rgba(250,204,21,0.7)] reading-card-image"
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
          disabled={!interpretation || isGeneratingImage}
          className="mt-4 px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-black rounded disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {isGeneratingImage ? (
            <>
              <span className="animate-spin">⏳</span>
              Generating...
            </>
          ) : (
            "Save Reading"
          )}
        </button>
      </div>
    </div>
  );
}
