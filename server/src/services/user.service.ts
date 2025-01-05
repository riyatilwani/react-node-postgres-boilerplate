import { PrismaClient, User } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

interface CreateUserInput {
  username: string;
  email: string;
  password: string;
}

const getUserSafe = (user: User) => {
  const { passwordHash, ...userWithoutPassword } = user;
  return userWithoutPassword;
};

const createUser = async ({ username, email, password }: CreateUserInput): Promise<User> => {
  const hashedPassword = await bcrypt.hash(password, 10);
  return prisma.user.create({
    data: {
      email: email.toLowerCase(),
      username: username.toLowerCase(),
      passwordHash: hashedPassword,
      isVerified: true,
      isAdmin: false,
    },
  });
};

const findUserByEmail = async (email: string): Promise<User | null> => {
  return prisma.user.findUnique({
    where: { email: email.toLowerCase() },
  });
};

const findUserById = async (id: number): Promise<User | null> => {
  return prisma.user.findUnique({
    where: { id },
  });
};

const setResetPasswordToken = async (userId: number, resetToken: string, expiryDate: Date): Promise<User> => {
  return prisma.user.update({
    where: { id: userId },
    data: {
      passwordResetToken: resetToken,
      passwordResetExpires: expiryDate,
    },
  });
};

const setUserPassword = async (userId: number, newPassword: string): Promise<User> => {
  const hashedPassword = await bcrypt.hash(newPassword, 10);
  return prisma.user.update({
    where: { id: userId },
    data: {
      passwordHash: hashedPassword,
      // Optionally, invalidate all refresh tokens upon password change
      refreshTokens: { deleteMany: {} },
      passwordResetToken: null,
      passwordResetExpires: null,
    },
  });
};

const deleteUnverifiedUserByEmail = async (email: string): Promise<number> => {
  const result = await prisma.user.deleteMany({
    where: {
      email: email.toLowerCase(),
      isVerified: false,
    },
  });
  return result.count;
};

export default {
  getUserSafe,
  createUser,
  findUserByEmail,
  findUserById,
  setResetPasswordToken,
  setUserPassword,
  deleteUnverifiedUserByEmail,
};
