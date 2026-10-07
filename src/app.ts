// app.ts
import express, { type Express } from "express";
// import routes from "./routes/index.js";
// import { errorHandler } from "./middlewares/error.middleware.js";

const app: Express = express();

app.use(express.json());

// API Routes
// app.use("/api", routes);

// Global Error Handler
// app.use(errorHandler);

export default app;
