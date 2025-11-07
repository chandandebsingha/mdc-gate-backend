import express from "express";
import cors from "cors";
import routes from "./routes";
import { errorHandler } from "./middleware/errorHandler";
import { success } from "./utils/response";

const app = express();

app.use(cors());
app.use(express.json());

// Root health/info endpoint
app.get("/", (_req, res) => {
	res.json(success({ uptime: process.uptime() }, "MyGate Backend API running"));
});

app.use("/api", routes);

app.use(errorHandler);

export default app;
