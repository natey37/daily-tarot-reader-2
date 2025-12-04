import "./loadEnv.js";

import express from "express";
import cors from "cors";
import interpretRouter from "./routes/interpret.js";
import imageDownloadRouter from "./routes/reading-download.js"
import rateLimit from "express-rate-limit";

const app = express();
app.set("trust proxy", true);

app.use(cors());
app.use(express.json());

const WHITELISTED_IP = process.env.WHITELISTED_IP || "127.0.0.1";

const ipLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 1,
  keyGenerator: (req) => {
    const xForwardedFor = req.headers["x-forwarded-for"];
    const ip = req.ip === "::1" ? "127.0.0.1" : req.ip;

    console.log("Incoming request IP:", ip);
    console.log("X-Forwarded-For header:", xForwardedFor);

    return ip;
  },
  skip: (req) => {
    const ip = req.ip === "::1" ? "127.0.0.1" : req.ip;
    return ip === WHITELISTED_IP;
  },
  handler: (req, res) => {
    res
      .status(429)
      .json({ message: "Too many requests. Please wait a minute." });
  },
});

app.use("/api/interpret", ipLimiter, interpretRouter);
app.use("/api/generate-reading-image", imageDownloadRouter)

// const PORT = process.env.PORT || 4000;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
app.listen(4000, '0.0.0.0', () => {
  console.log('Server running on port 4000');
});