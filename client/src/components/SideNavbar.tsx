import {
  Bars3Icon,
  Cog6ToothIcon,
  ChartBarIcon,
} from "@heroicons/react/24/outline";
import { useState } from "react";
import { useAppSelector } from "../store/hooks";
import { Link } from "react-router-dom";
import "tailwindcss/tailwind.css";

const SideNavbar: React.FC = () => {
  const { user, isAuth } = useAppSelector((state) => state.user);
  const [isOpen, setIsOpen] = useState<boolean>(true);

  const toggleNavbar = () => setIsOpen(!isOpen);

  // Handle cases where user data might not be available
  if (!isAuth || !user) {
    return null; // Or render a placeholder
  }

  return (
    <div
      className={`bg-cyan-700 text-white ${
        isOpen ? "w-64" : "w-16"
      } flex-shrink-0 transition-all duration-300`}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-800">
        {isOpen && (
          <h1 className="text-lg font-semibold transition-opacity duration-300 ease-in-out">
            {/* Your Business */}
          </h1>
        )}
        <button onClick={toggleNavbar} className="">
          <Bars3Icon className="w-6 h-6" />
        </button>
      </div>
      <div
        className={`flex flex-col items-center p-4 transition-all duration-500 ease-in-out ${
          isOpen ? "opacity-100" : "opacity-0"
        } overflow-hidden`}
      ></div>

      {/* Menu Items */}
      <nav className="mt-4">
        <ul className="space-y-2">
          {/* Admin-specific Menu Items */}
          {user.isAdmin && (
            <>
              <li>
                <Link
                  to="/admin"
                  className="flex items-center px-4 py-2 hover:bg-gray-700 rounded transition-all duration-300 ease-in-out"
                >
                  <Cog6ToothIcon className="w-5 h-5" />
                  <span
                    className={`ml-3 transition-all duration-300 ease-in-out ${
                      isOpen ? "block" : "hidden"
                    }`}
                  >
                    Manage Users
                  </span>
                </Link>
              </li>
            </>
          )}

          {/* Client-specific Menu Items */}
          {!user.isAdmin && (
            <>
              <li>
                <Link
                  to="/client"
                  className="flex items-center px-4 py-2 hover:bg-gray-700 rounded transition-all duration-300 ease-in-out"
                >
                  <ChartBarIcon className="w-5 h-5" />
                  {isOpen && (
                    <>
                      <span className="ml-3">Dashboard</span>
                    </>
                  )}
                </Link>
              </li>
            </>
          )}
        </ul>
      </nav>
    </div>
  );
};

export default SideNavbar;
