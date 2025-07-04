import './loadEnv.js/index.js';

import express from "express";
import cors from "cors";
import interpretRouter from "./routes/interpret.js";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/interpret", interpretRouter);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
