import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch } from "../store/hooks";
import { useTranslation } from "react-i18next";
import { attemptLogin } from "../store/thunks/authThunks";
import { useState } from "react";

export default function LoginPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const resultAction = await dispatch(
        attemptLogin({ credentials: { email: email, password: password } })
      ).unwrap();

      // Perform navigation based on user role
      if (resultAction.isAdmin) {
        navigate("/admin", { replace: true });
      } else if (resultAction.email) {
        navigate("/client", { replace: true });
      } else {
        navigate("/login", { replace: true });
      }
    } catch (error) {
      // Handle error (e.g., display error message)
      console.error("Login failed:", error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="w-full max-w-md bg-white p-8 rounded shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-center">{t("login")}</h2>
        <form className="space-y-4" onSubmit={handleLogin}>
          {/* Email Input Field */}
          <div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Email"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>

          {/* Password Input Field */}
          <div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Password"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>

          {/* Forgot Password Link */}
          <div className="flex items-center justify-between">
            <Link
              to="/login/forgot"
              className="text-sm text-indigo-600 hover:text-indigo-500"
            >
              {t("forgotYourPassword")}?
            </Link>
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              {t("login")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
