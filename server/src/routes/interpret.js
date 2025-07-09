import express from "express";
import OpenAI from "openai";
import fs from "fs/promises";
import path from "path";

const router = express.Router();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const cachePath = path.resolve("readings.json");

function getCardKey(cards) {
  return cards.map((c) => c.name).join("::");
}

router.post("/", async (req, res) => {
  const { cards } = req.body;

  if (!cards || cards.length !== 3) {
    return res.status(400).json({ error: "3 cards are required." });
  }

  const prompt = `
You are a mystic tarot reader. Provide a poetic, insightful interpretation of these 3 tarot cards in order: ${cards
    .map((c) => c.name)
    .join(
      ", "
    )}. I am using a specific tarot deck with imagery, so I do not want there to be too much description on what the card may look like because it may look different than the actual cards imagery being shown, keep it somewhat generic. Make sure to be very detailed and tie the cards together in a cohesive narrative. Be sure to really weave together the three cards to make it feel very dynamic and personal.
`;

  const key = getCardKey(cards);

  try {
    let cache = {};

    // Load cache if file exists
    try {
      const cacheData = await fs.readFile(cachePath, "utf-8");
      cache = JSON.parse(cacheData);
    } catch (err) {
      if (err.code !== "ENOENT") throw err; // Ignore "file not found", throw others
    }

    if (cache[key]) {
      console.log(`Returning cached reading for: ${key}`);
      return res.json({ reading: cache[key], fromCache: true });
    }

    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
    });

    const interpretation = response.choices[0].message?.content;

    cache[key] = interpretation;
    await fs.writeFile(cachePath, JSON.stringify(cache, null, 2));
    
    res.json({ reading: interpretation });
    
  } catch (err) {
    console.error("OpenAI error:", err.message);
    res.status(500).json({ error: "Failed to interpret reading." });
  }
});

export default router;
