import passport from "passport";
import { Strategy as JwtStrategy, ExtractJwt, StrategyOptions } from "passport-jwt";
import { PrismaClient, User } from "@prisma/client";
import { JwtPayload } from "../utils/interfaces";

const prisma = new PrismaClient();

const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;

if (!accessTokenSecret) {
  throw new Error("ACCESS_TOKEN_SECRET is not defined in environment variables.");
}

// Custom extractor to get token from cookies
const cookieExtractor = (req: any) => {
  return req?.cookies?.authToken || null; // Extract authToken from cookies
};

const opts: StrategyOptions = {
  jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]), // Use custom extractor
  secretOrKey: accessTokenSecret,
};

passport.use(
  new JwtStrategy(opts, async (jwt_payload: JwtPayload, done) => {
    try {
      const user: User | null = await prisma.user.findUnique({
        where: { id: jwt_payload.userId },
      });

      if (user) {
        return done(null, { id: user.id, email: user.email, isAdmin: user.isAdmin });
      } else {
        return done(null, false); // User not found
      }
    } catch (error) {
      return done(error, false); // Handle any unexpected errors
    }
  })
);

export default passport;
