import { Prisma, PrismaClient, User } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import dayjs from "dayjs";
import { JwtPayload } from "../utils/interfaces";

const prisma = new PrismaClient();

const verifyPassword = async (password: string, hash: string): Promise<boolean> => {
  return bcrypt.compare(password, hash);
};

const generateAccessToken = (user: User): string => {
  const payload: JwtPayload = {
    userId: user.id,
    email: user.email,
    isAdmin: user.isAdmin,
  };

  return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET as string, {
    expiresIn: process.env.ACCESS_TOKEN_EXPIRY || '15m',
  });
};

const generateRefreshToken = async (user: User): Promise<string> => {
  const refreshToken = uuidv4();
  const expiryDate = dayjs().add(7, 'day').toDate(); // 7 days expiry

  await prisma.refreshToken.create({
    data: {
      token: refreshToken,
      userId: user.id,
      expiresAt: expiryDate,
    },
  });

  return refreshToken;
};

const findRefreshToken = async (token: string): Promise<Prisma.RefreshTokenGetPayload<{ include: { user: true } }> | null> => {
  return prisma.refreshToken.findUnique({
    where: { token },
    include: { user: true },
  });
};

const revokeRefreshToken = async (token: string): Promise<void> => {
  await prisma.refreshToken.deleteMany({
    where: { token },
  });
};

const revokeAllRefreshTokensForUser = async (userId: number): Promise<void> => {
  await prisma.refreshToken.deleteMany({
    where: { userId },
  });
};

export default {
  verifyPassword,
  generateAccessToken,
  generateRefreshToken,
  findRefreshToken,
  revokeRefreshToken,
  revokeAllRefreshTokensForUser,
};
