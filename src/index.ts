import express from "express";

import { handlerReadiness } from "./api/readiness.js";
import { handlerMetrics } from "./api/metrics.js";
import { handlerReset } from "./api/reset.js";
import { errorMiddleware, middlewareLogResponse, middlewareMetricsInc } from "./api/middleware.js";
import { handlerChirpsValidate } from "./api/validate_chirp.js";
import postgres from "postgres";
import { config } from "./config.js";
import {migrate} from "drizzle-orm/postgres-js/migrator.js"
import { drizzle } from "drizzle-orm/postgres-js/driver.js";


const migrationClient = postgres(config.db.url, {max: 1});
await migrate(drizzle(migrationClient), config.db.migrationConfig);

const app = express();

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

app.listen(config.api.port, () => {
  console.log(`Server is running at http://localhost:${config.api.port}`);
});

