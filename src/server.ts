import app from "./app";
import { env } from "./config/env";
import { connectMongo } from "./infrastructure/db/mongo";

async function startServer() {
  await connectMongo();

  app.listen(env.PORT, () => {
    console.log(`This server has started and running on port ${env.PORT}`);
  });
}

startServer();
