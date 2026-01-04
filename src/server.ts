import app from "./app";
import { env } from "./config/env";
import { connectMongo } from "./infrastructure/db/mongo";
import { logger } from "./infrastructure/logger";

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

async function startServer() {
  await connectMongo();

  const server = app.listen(env.PORT, () => {
    logger.info(`This server has started and running on port ${env.PORT} 🎉`);
  });

  const shutdown = async (signal: string) => {
    logger.info({ signal }, "Shutdown initiated 🚨");

    server.close(async () => {
      logger.info("HTTP server closed 🚫");

      try {
        const mongoose = await import("mongoose");
        await mongoose.default.connection.close();
        logger.info("Sorry, MongoDB connection closed");
      } catch (e) {
        logger.error(e, "This MongoDB close failed, sorry");
      }

      process.exit(0);
    });

    setTimeout(() => {
      logger.error("Force shutdown (timeout)");
      process.exit(1);
    }, 10_000);
  };

  process.on("SIGINT", () => shutdown("SIGINT"));
  process.on("SIGTERM", () => shutdown("SIGTERM"));
}

startServer().catch((e) => {
  logger.error(e, "This server startup failed 😭");
  process.exit(1);
});
