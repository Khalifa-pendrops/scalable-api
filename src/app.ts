import express from "express";
// import routes from "./routes";
import { errorMiddleware } from "./middleware/error.middleware";
import authRoutes from "./modules/auth/auth.routes";

const app = express();

app.use((req, _res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/api/auth", authRoutes);

app.use(errorMiddleware);



export default app;
