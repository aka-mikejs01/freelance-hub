import express from "express";
import dotenv from "dotenv";
import logger from "./middleware/logger";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import cors from "cors";
import path from "path";
import limit from "./middleware/rateLimit";
import authRouter from "./routes/authRoutes";
import uploadRouter from "./routes/uploadRoutes";
import resetPasswordRouter from "./routes/resetPasswordRoutes";
import clientRouter from "./routes/clientRoutes";
import jobRouter from "./routes/jobRoutes";
import freelancerRouter from "./routes/freelancerRoutes";
import applicationRouter from "./routes/applicationRoutes";
import userRouter from "./routes/userRoutes";

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

app.use("/api/auth", authRouter);
app.use("/api", uploadRouter);
app.use("/api", resetPasswordRouter);
app.use("/api/jobs", clientRouter);
app.use("/api/jobs", jobRouter);
app.use("/api/application", freelancerRouter);
app.use("/api/application", applicationRouter);
app.use("/api/user", userRouter);

export default app;
