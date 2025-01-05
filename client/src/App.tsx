import { useState, useEffect } from "react";
import { Route, Navigate, Routes } from "react-router-dom";
import { attemptGetUser } from "./store/thunks/authThunks";
import {
  HomePage,
  ProfilePage,
  LoginPage,
  ResetPasswordRequestPage,
  ResetPasswordPage,
  LogoutPage,
  RegisterPage,
} from "./pages";
import { useAppDispatch, useAppSelector } from "./store/hooks";
import { useTranslation } from "react-i18next";
import "./App.css";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";
import ClientRoute from "./components/ClientRoute";
import { AuthRoute } from "./components/AuthRoute";
import AdminDashboard from "./pages/protected/AdminDashboard";
import ClientDashboard from "./pages/protected/ClientDashboard";
import SideNavbar from "./components/SideNavbar";
import TopNavbar from "./components/TopNavbar";

export default function App() {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector((state) => state.user.isAuth);

  useEffect(() => {
    dispatch(attemptGetUser())
      .unwrap()
      .then((user) => {
        if (user) {
          console.log("User authenticated:", user);
        } else {
          console.warn("User not authenticated");
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error during authentication:", error);
        setLoading(false);
      });
  }, [dispatch]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>{t("loading")}</p>
      </div>
    );
  }

  return loading ? (
    <p>{t("loading")}</p>
  ) : (
    <div className="flex h-screen">
    {/* Left Vertical Navbar */}
    <SideNavbar />

    <div className="flex flex-1 flex-col">
      {/* Top Horizontal Navbar */}
      <TopNavbar />

        {/* Right Main Content */}
        <div className="flex-1 p-4 overflow-y-auto">
          <Routes>
            {/* Home Route */}
            <Route
              path="/"
              element={
                isAuthenticated ? (
                  <HomePage />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />

            {/* Admin Dashboard */}
            <Route
              path="/admin"
              element={
                <AdminRoute>
                  <AdminDashboard />
                </AdminRoute>
              }
            />

            {/* Client Dashboard */}
            <Route
              path="/client"
              element={
                <ClientRoute>
                  <ClientDashboard />
                </ClientRoute>
              }
            />

            {/* Register Route */}
            <Route
              path="/register"
              element={
                <AuthRoute>
                  <RegisterPage />
                </AuthRoute>
              }
            />

            {/* Login Route */}
            <Route
              path="/login"
              element={
                <AuthRoute>
                  <LoginPage />
                </AuthRoute>
              }
            />

            {/* Reset Password Request Route */}
            <Route
              path="/login/forgot"
              element={
                <AuthRoute>
                  <ResetPasswordRequestPage />
                </AuthRoute>
              }
            />

            {/* Reset Password Route */}
            <Route
              path="/login/reset/:token"
              element={
                <AuthRoute>
                  <ResetPasswordPage />
                </AuthRoute>
              }
            />

            {/* Logout Route */}
            <Route
              path="/logout"
              element={
                <ProtectedRoute>
                  <LogoutPage />
                </ProtectedRoute>
              }
            />

            {/* Profile Route */}
            <Route
              path="/my-profile"
              element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              }
            />

            {/* Catch-all Route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}
