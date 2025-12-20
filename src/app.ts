import express from "express";
import routes from "./routes";
import { errorMiddleware } from "./middleware/error.middleware";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/api", routes);

app.use(errorMiddleware);

export default app;
