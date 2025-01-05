import * as express from "express";

declare global {
  namespace Express {
    interface User {
      id: number;
      email: string;
      isAdmin: boolean;
      // Add other JWT payload fields if needed
    }

    interface Request {
      user?: User; // Passport.js adds the user property
    }
  }
}

export {};