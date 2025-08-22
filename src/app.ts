import express from "express";
import dotenv from "dotenv";
import logger from "./middleware/logger";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import cors from "cors";
import path from "path";
import limit from "./middleware/rateLimit";
import authRoutes from "./routes/authRoutes";
import uploadRoutes from "./routes/uploadRoutes";
import resetPasswordRoutes from "./routes/resetPasswordRoutes";
import clientRoutes from "./routes/clientRoutes";
import jobRoutes from "./routes/jobRoutes";

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

app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

app.use("/api/auth", authRoutes);
app.use("/api", uploadRoutes);
app.use("/api", resetPasswordRoutes);
app.use("/api/jobs", clientRoutes);
app.use("/api/jobs", jobRoutes);

export default app;
