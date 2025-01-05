import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import {
  postUser,
  postLogin,
  postLogout,
  getConfirmation,
  sendResetPasswordLink,
  resetPassword,
  resendConfirmation,
  resetRegister,
  getUser,
} from "../../api/index";
import { User } from "../slices/userSlice";
import { Credential } from "../../shared/interfaces";

// Thunk for user registration
export const attemptRegister = createAsyncThunk<
  User,
  { newUser: Omit<User, "isAdmin"> },
  { rejectValue: string }
>(
  "auth/attemptRegister",
  async ({ newUser }, { rejectWithValue }) => {
    try {
      const response = await postUser({
        email: newUser.email,
        username: newUser.username,
        password: newUser.password,
      });
      const user: User = response.data.user;
      return user;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.error(
          "Axios error during registration:",
          error.response?.data || error.message
        );
        return rejectWithValue(
          error.response?.data?.error || "Registration failed"
        );
      } else if (error instanceof Error) {
        console.error("General error during registration:", error.message);
        return rejectWithValue(error.message);
      } else {
        console.error("Unknown error during registration:", error);
        return rejectWithValue("An unknown error occurred");
      }
    }
  }
);

// Thunk for user login
export const attemptLogin = createAsyncThunk<
  User, // Return type
  { credentials: Credential }, // Argument type
  { rejectValue: string }
>(
  "auth/login",
  async ({ credentials }, { rejectWithValue }) => {
    try {
      const response = await postLogin(credentials);
      const user: User = response.data.user;
      return user;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.error(
          "Axios error during login:",
          error.response?.data || error.message
        );
        return rejectWithValue(error.response?.data?.error || "Login failed");
      } else if (error instanceof Error) {
        console.error("General error during login:", error.message);
        return rejectWithValue(error.message);
      } else {
        console.error("Unknown error during login:", error);
        return rejectWithValue("An unknown error occurred");
      }
    }
  }
);

// Thunk for sending reset password link
export const attemptSendResetPasswordLink = createAsyncThunk<
  void,
  { email: string },
  { rejectValue: string }
>(
  "auth/attemptSendResetPasswordLink",
  async ({ email }, { rejectWithValue }) => {
    try {
      await sendResetPasswordLink(email);
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.error(
          "Axios error sending reset password link:",
          error.response?.data || error.message
        );
        return rejectWithValue(
          error.response?.data?.error || "Failed to send reset password link"
        );
      } else if (error instanceof Error) {
        console.error(
          "General error sending reset password link:",
          error.message
        );
        return rejectWithValue(error.message);
      } else {
        console.error("Unknown error sending reset password link:", error);
        return rejectWithValue("An unknown error occurred");
      }
    }
  }
);

// Thunk for resetting password
export const attemptResetPassword = createAsyncThunk<
  void,
  { password: string; token: string },
  { rejectValue: string }
>(
  "auth/attemptResetPassword",
  async ({ password, token }, { rejectWithValue }) => {
    try {
      await resetPassword(password, token);
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.error(
          "Axios error during password reset:",
          error.response?.data || error.message
        );
        return rejectWithValue(
          error.response?.data?.error || "Password reset failed"
        );
      } else if (error instanceof Error) {
        console.error("General error during password reset:", error.message);
        return rejectWithValue(error.message);
      } else {
        console.error("Unknown error during password reset:", error);
        return rejectWithValue("An unknown error occurred");
      }
    }
  }
);

// Thunk for email confirmation
export const attemptGetConfirmation = createAsyncThunk<
  void,
  { token: string },
  { rejectValue: string }
>(
  "auth/attemptGetConfirmation",
  async ({ token }, { rejectWithValue }) => {
    try {
      await getConfirmation(token);
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.error(
          "Axios error during email confirmation:",
          error.response?.data || error.message
        );
        return rejectWithValue(
          error.response?.data?.error || "Email confirmation failed"
        );
      } else if (error instanceof Error) {
        console.error(
          "General error during email confirmation:",
          error.message
        );
        return rejectWithValue(error.message);
      } else {
        console.error("Unknown error during email confirmation:", error);
        return rejectWithValue("An unknown error occurred");
      }
    }
  }
);

// Thunk for resending confirmation
export const attemptResendConfirmation = createAsyncThunk<
  void,
  { email: string },
  { rejectValue: string }
>(
  "auth/attemptResendConfirmation",
  async ({ email }, { rejectWithValue }) => {
    try {
      await resendConfirmation(email);
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.error(
          "Axios error resending confirmation:",
          error.response?.data || error.message
        );
        return rejectWithValue(
          error.response?.data?.error || "Resend confirmation failed"
        );
      } else if (error instanceof Error) {
        console.error(
          "General error resending confirmation:",
          error.message
        );
        return rejectWithValue(error.message);
      } else {
        console.error("Unknown error resending confirmation:", error);
        return rejectWithValue("An unknown error occurred");
      }
    }
  }
);

// Thunk for reset register
export const attemptResetRegister = createAsyncThunk<
  void,
  { email: string },
  { rejectValue: string }
>(
  "auth/attemptResetRegister",
  async ({ email }, { rejectWithValue }) => {
    try {
      await resetRegister(email);
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.error(
          "Axios error resetting register:",
          error.response?.data || error.message
        );
        return rejectWithValue(
          error.response?.data?.error || "Reset register failed"
        );
      } else if (error instanceof Error) {
        console.error("General error resetting register:", error.message);
        return rejectWithValue(error.message);
      } else {
        console.error("Unknown error resetting register:", error);
        return rejectWithValue("An unknown error occurred");
      }
    }
  }
);

// Thunk for fetching current user
export const attemptGetUser = createAsyncThunk<
  User | null,
  void,
  { rejectValue: string }
>(
  "auth/attemptGetUser",
  async (_, { rejectWithValue, dispatch }) => {
    try {
      const response = await getUser();
      if (!response.data || !response.data.user) {
        console.error("Invalid user response:", response.data);
        return rejectWithValue("Could not fetch user");
      }
      const user: User | null = response.data.user;

      return user;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.error(
          "Axios error fetching user:",
          error.response?.data || error.message
        );
        return rejectWithValue(
          error.response?.data?.error || "Could not fetch user"
        );
      } else if (error instanceof Error) {
        console.error("General error fetching user:", error.message);
        return rejectWithValue(error.message);
      } else {
        console.error("Unknown error fetching user:", error);
        return rejectWithValue("An unknown error occurred");
      }
    }
  }
);

// Thunk for logout
export const attemptLogout = createAsyncThunk<
  void,
  void,
  { rejectValue: string }
>(
  "auth/attemptLogout",
  async (_, { rejectWithValue }) => {
    try {
      await postLogout();
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.error(
          "Axios error during logout:",
          error.response?.data || error.message
        );
        return rejectWithValue(error.response?.data?.error || "Logout failed");
      } else if (error instanceof Error) {
        console.error("General error during logout:", error.message);
        return rejectWithValue(error.message);
      } else {
        console.error("Unknown error during logout:", error);
        return rejectWithValue("An unknown error occurred");
      }
    }
  }
);
