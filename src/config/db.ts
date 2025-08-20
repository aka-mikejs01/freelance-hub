import mongoose from "mongoose";
import logger from "../middleware/logger";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI!);
    logger.info("Connected to MongoDB");
  } catch (err) {
    if (err instanceof Error) {
      logger.error(`DB died. Error: ${err.stack || err.message}`);
      process.exit(1);
    } else {
      logger.error("Unknown error occured");
      process.exit(1);
    }
  }
};

export default connectDB;
