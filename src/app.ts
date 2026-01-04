import express from "express";
import helmet from "helmet";
import { corsMiddleware } from "./config/cors";
import { errorMiddleware } from "./middleware/error.middleware";
import authRoutes from "./modules/auth/auth.routes";
import { requestId } from "./middleware/request-id";
import { httpLogger } from "./middleware/http-logger";
import benchRoutes from "./modules/bench/bench.routes";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(helmet());
app.use(corsMiddleware);

app.use(requestId);
app.use(httpLogger);

app.use("/api/auth", authRoutes);
app.use("/bench", benchRoutes);

app.use(errorMiddleware);

export default app;
