import app from "./app";
import connectDB from "./config/db";
import logger from "./middleware/logger";

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
