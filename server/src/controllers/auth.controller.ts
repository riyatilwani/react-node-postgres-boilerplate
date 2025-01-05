import { Request, Response, NextFunction } from "express";
import {
  validateRegisterInput,
  validateLoginInput,
  validateEmail,
  validatePassword,
} from "../validations/user.validation";
import UserService from "../services/user.service";
import AuthService from "../services/auth.service";
import EmailService from "../services/email.service";
import { v4 as uuidv4 } from "uuid";
import dayjs from "dayjs";
import { PrismaClient } from "@prisma/client";
import userService from "../services/user.service";

const prisma = new PrismaClient();

const register = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password, username } = req.body;

  // Validate input
  const { error } = validateRegisterInput(req.body);
  if (error) {
    return next({
      statusCode: 400,
      customMessage: "Validation error",
      message: error.details[0].message,
    });
  }

  try {
    // Check if user already exists
    const existingUser = await UserService.findUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ error: "User already exists." });
    }

    const newUser = await UserService.createUser({ username, email, password })

    // Optionally, send a welcome email
    // await EmailService.sendWelcomeEmail(newUser.email, newUser.username);

    res.status(201).json({ user: UserService.getUserSafe(newUser) });
  } catch (err: any) {
    next({
      statusCode: 500,
      customMessage: "User creation failed",
      message: err.message,
    });
  }
};

const login = async (req: Request, res: Response, next: NextFunction) => {
  const { error } = validateLoginInput(req.body);
  if (error) {
    return next({
      statusCode: 400,
      customMessage: "Validation error",
      message: error.details[0].message,
    });
  }

  const { email, password } = req.body;

  try {
    const user = await UserService.findUserByEmail(email);
    if (!user) {
      return next({
        statusCode: 400,
        customMessage: "Authentication failed",
        message: "Invalid username or password.",
      });
    }

    const isMatch = await AuthService.verifyPassword(
      password,
      user.passwordHash
    );
    if (!isMatch) {
      return next({
        statusCode: 400,
        customMessage: "Authentication failed",
        message: "Invalid username or password.",
      });
    }

    // Generate tokens
    const accessToken = AuthService.generateAccessToken(user);
    const refreshToken = await AuthService.generateRefreshToken(user);

    res.cookie("authToken", accessToken, {
      httpOnly: true, // Prevent access via JavaScript
      secure: process.env.NODE_ENV === "production", // Use HTTPS
      sameSite: "strict", // Prevent cross-site requests
      maxAge: 24 * 60 * 60 * 1000, // Set expiration
    });
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Use HTTPS
      sameSite: "strict", // Prevent CSRF attacks
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.status(200).json({
      accessToken,
      refreshToken,
      user: UserService.getUserSafe(user),
    });
  } catch (err: any) {
    next({
      statusCode: 500,
      customMessage: "Server error",
      message: err.message,
    });
  }
};

const postLoginForgot = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { error } = validateEmail(req.body);
  if (error)
    return next({
      statusCode: 400,
      customMessage: "Validation error",
      message: error.details[0].message,
    });

  const { email } = req.body;

  try {
    const user = await UserService.findUserByEmail(email);
    if (!user) {
      return next({
        statusCode: 400,
        customMessage: "Error during password reset",
        message: "No user found with this email address",
      });
    }

    const resetTokenValue = uuidv4(); // Generate a unique token
    const tokenExpiryDate = dayjs().add(12, "hours").toDate();

    // Create a password reset token
    await UserService.setResetPasswordToken(
      user.id,
      resetTokenValue,
      tokenExpiryDate
    );

    // Send reset password email
    const resetLink = `${process.env.FRONTEND_URL}/login/reset/${resetTokenValue}`;
    await EmailService.sendResetPasswordEmail(user.email, resetLink);

    res.status(200).send({
      message: `A reset password email has been sent to ${user.email}`,
    });
  } catch (error: any) {
    next({
      statusCode: 500,
      customMessage: "Error during password reset",
      message: error.message,
    });
  }
};

const postLogout = (req: Request, res: Response) => {
  try {
    // Clear the refresh token cookie
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    // Send success response
    res.status(200).send({ message: "Logout success" });
  } catch (error: any) {
    res.status(500).send({ message: "Error during logout", error: error.message });
  }
};

const refreshAccessToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(400).json({ error: "Refresh token is required." });
  }

  try {
    const storedToken = await AuthService.findRefreshToken(refreshToken);

    if (!storedToken) {
      return res.status(403).json({ error: "Invalid refresh token." });
    }

    if (dayjs().isAfter(dayjs(storedToken.expiresAt))) {
      await AuthService.revokeRefreshToken(refreshToken);
      return res.status(403).json({ error: "Refresh token has expired." });
    }

    const user = storedToken.user;

    if (!user) {
      return res.status(403).json({ error: "Invalid refresh token." });
    }

    // Optionally: Implement refresh token rotation here by revoking the current and issuing a new one
    // For simplicity, we'll keep the same refresh token

    const accessToken = AuthService.generateAccessToken(user);

    return res.status(200).json({ accessToken });
  } catch (error: any) {
    return next({
      statusCode: 500,
      customMessage: "Error refreshing token",
      message: error.message,
    });
  }
};

const postLoginReset = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { password } = req.body;
  const { token } = req.params;

  // Validate input
  const { error } = validatePassword({ password });
  if (error) {
    return next({
      statusCode: 400,
      customMessage: "Validation error",
      message: error.details[0].message,
    });
  }

  try {
    // Find user by reset token and ensure token hasn't expired
    const user = await prisma.user.findFirst({
      where: {
        passwordResetToken: token,
        passwordResetExpires: {
          gt: new Date(),
        },
      },
    });

    if (!user) {
      return next({
        statusCode: 400,
        customMessage: "Invalid or expired token",
        message: "Password reset token is invalid or has expired.",
      });
    }

    // Update the user's password and invalidate all refresh tokens
    await userService.setUserPassword(user.id, password);

    // Optionally, send a confirmation email
    await EmailService.sendResetConfirmationEmail(user.email);

    res
      .status(200)
      .json({ message: "Password has been successfully changed." });
  } catch (error: any) {
    next({
      statusCode: 500,
      customMessage: "Error during password reset",
      message: error.message,
    });
  }
};

export default {
  register,
  login,
  postLoginForgot,
  postLogout,
  refreshAccessToken,
  postLoginReset,
};
