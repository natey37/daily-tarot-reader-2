// type Card = {
//     name: string;
//   };
  
// type Cards = Card[];

// export async function getTarotInterpretation(cards: Cards): Promise<string> {
//     const response = await fetch("http://localhost:4000/api/interpret", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({ cards }),
//     });
  
//     if (!response.ok) {
//       const error = await response.json();
//       throw new Error(error?.error || "Failed to fetch tarot interpretation.");
//     }
  
//     const data = await response.json();
//     return data.reading;
//   }
  