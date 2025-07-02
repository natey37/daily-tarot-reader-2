import express from "express";
import OpenAI from "openai";

const router = express.Router();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

router.post("/", async (req, res) => {
  const { cards } = req.body;

  if (!cards || cards.length !== 3) {
    return res.status(400).json({ error: "3 cards are required." });
  }

  const prompt = `
You are a mystic tarot reader. Provide a poetic, insightful interpretation of these 3 tarot cards in order: ${cards.map(c => c.name).join(", ")}. I am using a specific tarot deck with imagery, so I do not want there to be too much description on what the card may look like because it may look different than the actual cards imagery being shown, keep it somewhat generic. Make sure to be very detailed and tie the cards together in a cohesive narrative. Be sure to really weave together the three cards to make it feel very dynamic and personal.
`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
    });

    const interpretation = response.choices[0].message?.content;
    res.json({ reading: interpretation });
  } catch (err) {
    console.error("OpenAI error:", err.message);
    res.status(500).json({ error: "Failed to interpret reading." });
  }
});

export default router;
