import express from "express";

import { handlerReadiness } from "./api/readiness.js";
import { handlerMetrics } from "./api/metrics.js";
import { handlerReset } from "./api/reset.js";
import { errorMiddleware, middlewareLogResponse, middlewareMetricsInc } from "./api/middleware.js";
import { handlerChirpsValidate } from "./api/validate_chirp.js";

const app = express();
const PORT = 8080;

app.use(middlewareLogResponse);
app.use("/app", middlewareMetricsInc, express.static("./src/app"));
app.use(express.json());

app.get("/api/healthz",  (req, res, next) => {
  Promise.resolve(handlerReadiness(req, res)).catch(next);
});

app.get("/admin/metrics", (req, res, next) => {
  Promise.resolve(handlerMetrics(req, res)).catch(next);
});

app.post("/admin/reset", (req, res, next) => {
  Promise.resolve(handlerReset(req, res)).catch(next);
});

app.post("/api/validate_chirp", (req, res, next) => {
  Promise.resolve(handlerChirpsValidate(req, res)).catch(next);
});

app.use(errorMiddleware);

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});

