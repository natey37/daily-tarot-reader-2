import './loadEnv.js';

import express from "express";
import cors from "cors";
import interpretRouter from "./routes/interpret.js";
import rateLimit from 'express-rate-limit'

const app = express();
app.use(cors());
app.use(express.json());

const WHITELISTED_IP = process.env.WHITELISTED_IP || '127.0.0.1';

const ipLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 1,
    keyGenerator: (req) => {
      const ip = req.ip === '::1' ? '127.0.0.1' : req.ip;
      console.log('Incoming request IP:', ip);
      return ip;
    },
    skip: (req) => {
      const ip = req.ip === '::1' ? '127.0.0.1' : req.ip;
      return ip === WHITELISTED_IP;
    },
    handler: (req, res) => {
      res.status(429).json({ message: 'Too many requests. Please wait a minute.' });
    },
  });

app.use('/api/interpret', ipLimiter, interpretRouter);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
