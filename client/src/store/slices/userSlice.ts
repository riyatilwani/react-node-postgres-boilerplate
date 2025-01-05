// src/store/slices/userSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  attemptLogin,
  attemptRegister,
  attemptSendResetPasswordLink,
  attemptResetPassword,
  attemptGetConfirmation,
  attemptResendConfirmation,
  attemptResetRegister,
  attemptGetUser,
  attemptLogout,
} from "../thunks/authThunks";

export type User = {
  username: string;
  email: string;
  password?: string;
  isAdmin?: boolean;
};

interface UserState {
  isAuth: boolean;
  user: User | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: UserState = {
  isAuth: false,
  user: null,
  status: "idle",
  error: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    // Only include necessary synchronous actions
    logoutUser(state) {
      state.isAuth = false;
      state.user = null;
      state.status = "idle";
      state.error = null;
    },
    resetUser(state) {
      state.isAuth = false;
      state.user = null;
      state.status = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Handle attemptLogin thunk
    builder
      .addCase(attemptLogin.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(attemptLogin.fulfilled, (state, action: PayloadAction<User>) => {
        state.status = "succeeded";
        state.user = action.payload;
        state.isAuth = true;
      })
      .addCase(attemptLogin.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Login failed";
      });

    // Handle attemptRegister thunk
    builder
      .addCase(attemptRegister.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(attemptRegister.fulfilled, (state, action: PayloadAction<User>) => {
        state.status = "succeeded";
        state.user = action.payload;
        state.isAuth = true;
      })
      .addCase(attemptRegister.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Registration failed";
      });

    // Handle attemptGetUser thunk
    builder
      .addCase(attemptGetUser.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(attemptGetUser.fulfilled, (state, action: PayloadAction<User | null>) => {
        state.status = "succeeded";
        state.user = action.payload;
        state.isAuth = !!action.payload;
      })
      .addCase(attemptGetUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Fetching user failed";
      });

    // Handle attemptLogout thunk
    builder
      .addCase(attemptLogout.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(attemptLogout.fulfilled, (state) => {
        state.isAuth = false;
        state.user = null;
        state.status = "succeeded";
      })
      .addCase(attemptLogout.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Logout failed";
      });

    // Handle other thunks similarly...
    // Example for attemptSendResetPasswordLink
    builder
      .addCase(attemptSendResetPasswordLink.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(attemptSendResetPasswordLink.fulfilled, (state) => {
        state.status = "succeeded";
      })
      .addCase(attemptSendResetPasswordLink.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to send reset password link";
      });

    // Repeat the pattern for other thunks...
  },
});

export const { logoutUser, resetUser } = userSlice.actions;

export default userSlice.reducer;
