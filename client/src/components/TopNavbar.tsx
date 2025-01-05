import React from "react";
import { NavLink, NavLinkProps } from "react-router-dom";
import { useAppSelector } from "../store/hooks";
import { User } from "lucide-react";
import { useTranslation } from "react-i18next";
import i18n from "../i18n";
import { LogoIcon } from "../assets/images";

export const TopNavbar: React.FC = () => {
  const { isAuth } = useAppSelector((state) => state.user);
  const { t } = useTranslation();

  const toggleLanguage = () => {
    const newLanguage = i18n.language === "en" ? "de" : "en";
    i18n.changeLanguage(newLanguage);
  };

  const navLinkClass: NavLinkProps["className"] = ({ isActive }) => {
    return isActive
      ? "text-white bg-indigo-700 p-2 rounded"
      : "text-black p-2 rounded hover:bg-indigo-100";
  };

  const iconStyle = (isActive: boolean) =>
    isActive ? { color: "white" } : { color: "black" };

  return (
    <nav
      className="shadow-sm p-4 text-black flex justify-between items-center w-full sticky top-0 z-50"
      style={{ backgroundColor: "#FFFFF" }}
    >
      <div className="flex items-center">
        <NavLink to="/">
          <img
            src={LogoIcon}
            alt="Logo"
            style={{ height: "3rem", width: "auto" }}
          />
        </NavLink>
      </div>
      <div className="flex items-center space-x-4">
        {isAuth ? (
          <>
            <NavLink className={navLinkClass} to="/">
              {t("home")}
            </NavLink>
            <NavLink className={navLinkClass} to="/logout">
              {t("logout")}
            </NavLink>
            <NavLink
              className={navLinkClass}
              to="/my-profile"
              title={t("myProfile")}
            >
              {({ isActive }) => <User style={iconStyle(isActive)} size={24} />}
            </NavLink>
          </>
        ) : (
          <>
            <NavLink className={navLinkClass} to="/login">
              {t("login")}
            </NavLink>
            {/* <NavLink className={navLinkClass} to="/register">
              {t("signup")}
            </NavLink> */}
          </>
        )}
        <button
          onClick={toggleLanguage}
          className="p-2 rounded hover:bg-gray-100"
          title={
            i18n.language === "en" ? "Switch to German" : "Switch to English"
          }
          aria-label={
            i18n.language === "en" ? "Switch to German" : "Switch to English"
          }
        >
          {i18n.language === "en" ? "DE" : "EN"}
        </button>
      </div>
    </nav>
  );
};

export default TopNavbar;
