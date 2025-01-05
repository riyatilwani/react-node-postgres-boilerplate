import userRoutes from "./user.routes";
import authRoutes from "./auth.routes";
import { Express } from "express";
import { authenticateJWT } from "../middlewares/auth.middleware";

export function initRoutes(app: Express) {
  // Public routes (no authentication needed)
  app.use("/api/auth", authRoutes);
  app.use("/api/healthcheck", (req, res) => res.send("OK"));

  // Protected user routes (user must be authenticated)
  app.use("/api/user", authenticateJWT, userRoutes);
}
