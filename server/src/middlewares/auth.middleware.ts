import passport from "passport";

// Extend Express Request interface to include user
declare global {
  namespace Express {
    interface User {
      id: number;
      username: string;
      isAdmin: boolean;
    }
  }
}

export const authenticateJWT = passport.authenticate("jwt", { session: false });
