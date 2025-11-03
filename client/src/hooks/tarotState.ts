// Simplified setup state for single-deck use case
import { useState, useEffect } from "react";
import { ORIGINAL_DECK } from "../../constants"

type Card = {
    name: string;
    image: string;
    // back?: string; // Add this if your cards have back image URLs too
  };
  
  type SetupState = {
    currentDeck: Card[];
    viewedIndex: number;
    selectedCards: Card[];
    hasStartedReading: boolean;
  };

export function useSetupState() {
  const [state, setState] = useState<SetupState>(() => {
    const stored = localStorage.getItem("tarotState");
    return stored
      ? JSON.parse(stored)
      : {
          currentDeck: ORIGINAL_DECK,
          viewedIndex: 0,
          selectedCards: [],
          hasStartedReading: false,
        };
  });

  useEffect(() => {
    localStorage.setItem("tarotState", JSON.stringify(state));
  }, [state]);

  const nextCard = () => {
    setState((prev) => ({
      ...prev,
      viewedIndex: (prev.viewedIndex + 1) % prev.currentDeck.length,
    }));
  };

  const prevCard = () => {
    setState((prev) => ({
      ...prev,
      viewedIndex:
        (prev.viewedIndex - 1 + prev.currentDeck.length) % prev.currentDeck.length,
    }));
  };

  const goToCardByName = (name: string) => {
    setState((prev) => {
      const index = prev.currentDeck.findIndex((card) =>
        card.name.toLowerCase().includes(name.toLowerCase())
      );
      return index !== -1 ? { ...prev, viewedIndex: index } : prev;
    });
  };

  const generateReading = () => {
    const shuffled = [...ORIGINAL_DECK].sort(() => 0.5 - Math.random());
    setState((prev) => ({
      ...prev,
      selectedCards: shuffled.slice(0, 3),
      hasStartedReading: true,
    }));
  };

  const resetReading = () => {
    setState((prev) => ({
      ...prev,
      selectedCards: [],
      hasStartedReading: false,
    }));
    localStorage.removeItem("lastReadingDate")
    localStorage.removeItem("lastReadingText")
  };
  console.log("STATE", state)
  return {
    state,
    nextCard,
    prevCard,
    goToCardByName, 
    generateReading,
    resetReading
  };
}
