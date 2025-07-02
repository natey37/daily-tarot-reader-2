import React from "react";
import Setup from "../components/Setup";
import Reading from "../components/Reading";
import { useSetupState } from "../hooks/tarotState";

const Home = () => {
  const {
    state,
    nextCard,
    prevCard,
    goToCardByName,
    generateReading,
    resetReading,
  } = useSetupState();

  return (
    <div className="flex justify-center items-center w-full">
      {!state.selectedCards.length ? (
        <Setup
          state={state}
          nextCard={nextCard}
          prevCard={prevCard}
          goToCardByName={goToCardByName}
          generateReading={generateReading}
        />
      ) : (
        <div className="flex flex-col">
          <Reading state={state} />
          <button
            onClick={resetReading}
            className="mt-6 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Reset Reading
          </button>
        </div>
      )}
    </div>
  );
};

export default Home;
