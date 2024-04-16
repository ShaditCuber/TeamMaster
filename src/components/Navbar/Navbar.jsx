import React, { useEffect, useState } from "react";
import { IconTeamMaster, MenuIcons } from "../../Icons/Icons";
import { GitHub } from "../Icons/Icons";
import { useTranslation } from "react-i18next";
import { useUsuario } from "../../context/AuthContext";

const Navbar = ({ showNav, setShowNav }) => {
  const [t, i18n] = useTranslation("global");
  const { user } = useUsuario();
  const savedLanguage = localStorage.getItem("i18nextLng");

  useState(showNav);

  useEffect(() => {
    if (savedLanguage) {
      i18n.changeLanguage(savedLanguage);
    }
  }, [i18n]);

  useEffect(() => {
    localStorage.setItem("i18nextLng", i18n.language);
    i18n.changeLanguage(i18n.language);
  }, [i18n.language]);

  const changeLanguage = (e) => {
    localStorage.setItem("i18nextLng", e.target.value);
    i18n.changeLanguage(e.target.value);
  };

  return (
    <header className={`${!user ? "bg-white border-b fixed w-full z-10" : ""}`}>
      <div
        className={`mx-auto flex justify-between h-16 items-center  px-2 sm:px-6 lg:px-8 ${
          !user && "max-w-screen-xl"
        }`}
      >
        {!user ? (
          <div className="flex items-center justify-center gap-2">
            <IconTeamMaster width={40} height={40} />
            <a
              href="#"
              className="text-xl font-semibold text-red-500 inline-flex items-center sm:text-3xl"
            >
              Team<span className="text-blue-500">Master</span>
            </a>
            <a
              href="https://github.com/ShaditCuber/TeamMaster"
              target="_blank"
              rel="noopener noreferrer"
              className="text-black hover:text-blue-500 ml-0 sm:ml-2"
            >
              {!user && <GitHub fill="black" className="hover:red" />}
            </a>
          </div>
        ) : (
          <div className="flex-1 md:flex md:justify-between md:items-center md:gap-12">
            <button
              className="btn btn-ghost text-xl"
              onClick={() => setShowNav(!showNav)}
            >
              <span className="sr-only">Home</span>
              <MenuIcons className="h-8 w-8" />
            </button>
          </div>
        )}

        <div>
          <label
            htmlFor="HeadlineAct"
            className="block text-sm sm:text-base text-center font-medium text-gray-900"
          >
            {t("language")}
          </label>

          <select
            name="HeadlineAct"
            id="HeadlineAct"
            className="w-full rounded-lg border border-gray-300 text-gray-700 text-sm sm:text-base"
            value={savedLanguage || "es"}
            onChange={(e) => changeLanguage(e)}
          >
            <option value="es">{t("lang-es")}</option>
            <option value="en">{t("lang-en")}</option>
          </select>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
