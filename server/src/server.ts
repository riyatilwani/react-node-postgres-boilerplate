import dotenv from 'dotenv';
import path from 'path';

// Load environment-specific .env file
const envFile = process.env.ENV_FILE || '.env.development';
const envPath = path.resolve(__dirname, `../${envFile}`);
dotenv.config({ path: envPath });

import passport from 'passport';
import bodyParser from 'body-parser';
import express from 'express';
import cookieParser from 'cookie-parser';

import { initRoutes } from './routes/index';
import { initProd } from './startup/prod';
import { initCORS } from './startup/cors';
import { initRateLimit } from './startup/rate-limit';
import { initLogger, log } from "./startup/logger";

import './startup/passport';

const port = process.env.PORT || 8082;
const app = express();
initLogger();

if (process.env.NODE_ENV === "development") initCORS(app);
initRateLimit(app);
initProd(app);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(passport.initialize());

// Initialize Routes
initRoutes(app);

// Error Handling Middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  const customMessage = err.customMessage || "An error occurred";

  res.status(statusCode).json({
    error: customMessage,
    message,
  });
});

// Serve static assets in production
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../../client/build")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../../client/build", "index.html"));
  });
}

app.listen(port, () => log.info(`Server listening on port ${port}...`));
