import express from "express";
import dotenv from "dotenv";
import logger from "./middleware/logger";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import cors from "cors";
import connectDB from "./config/db";
import limit from "./middleware/rateLimit";

dotenv.config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use(cors());
app.use(cookieParser());
app.use(
  morgan("combined", { stream: { write: (msg) => logger.http(msg.trim()) } })
);
app.use(limit);

const PORT = process.env.PORT || 8000;

const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => logger.info(`Server running on port: ${PORT}`));
  } catch (err) {
    const error = err as Error;
    logger.error(error.message);
  }
};

startServer();
