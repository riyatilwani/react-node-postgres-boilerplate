import { useEffect, useState } from "react";
import { useAppDispatch } from "../../store/hooks";
import { useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import { attemptLogout } from "../../store/thunks/authThunks";

export default function LogoutPage() {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const logout = async () => {
      try {
        // Dispatch the logout thunk
        await dispatch(attemptLogout()).unwrap();

        // Redirect to the home page after successful logout
        navigate("/login", { replace: true });
      } catch (err) {
        console.error("Logout failed:", err);
        setError(t("logoutFailed"));
      }
    };

    logout();
  }, [dispatch, navigate, t]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="w-full max-w-md bg-white p-8 rounded shadow-md text-center">
        <p>{t("logoutInProgress")}...</p>
        {error && <p className="text-red-500 mt-4">{error}</p>}
      </div>
    </div>
  );
}
