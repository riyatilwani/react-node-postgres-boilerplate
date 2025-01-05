import { useTranslation } from "react-i18next";
import { useAppSelector } from "../../store/hooks";

export default function ProfilePage() {
  const { t } = useTranslation();
  const user = useAppSelector((state) => state.user.user);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-md bg-white p-8 rounded shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-center">{t('myProfile')}</h2>
        {user ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">{t('username')}:</label>
              <p className="mt-1 text-lg text-gray-900">{user.username}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">{t('email')}:</label>
              <p className="mt-1 text-lg text-gray-900">{user.email}</p>
            </div>
          </div>
        ) : (
          <p className="text-center text-gray-700">{t('noUserDataAvailable')}</p>
        )}
      </div>
    </div>
  );
}
