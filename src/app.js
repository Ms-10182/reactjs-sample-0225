import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();

app.use(express.json());

// Configure CORS to allow your frontend
app.use(cors());

app.use(cookieParser());

import healthRoute from "./routes/healthCheck.route.js";
import userRoute from "./routes/user.route.js";
import listRoute from "./routes/list.route.js";
import taskRoute from "./routes/task.route.js";
import { errorHandler } from "./utils/errorHandler.js";

app.use("/api/v1/healthCheck", healthRoute);
app.use("/api/v1/user", userRoute);
app.use("/api/v1/lists", listRoute);
app.use("/api/v1/tasks", taskRoute);

// Error handler middleware (must be last)
app.use(errorHandler);

export { app };
