import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { IconTeamMaster } from "../../Icons/Icons";
import { useUsuario } from "../../context/AuthContext";
import { useTranslation } from "react-i18next";
import { GitHub } from "../Icons/Icons";

const Sidebar = ({ isVisible }) => {
  const [t, i18n] = useTranslation("global");

  const { user, signOut } = useUsuario();

  // USELOCATION FOR ACTIVE NAV a COLOR
  const location = useLocation();

  const sidebarClass = isVisible
    ? "translate-x-0 opacity-100 relative"
    : "-translate-x-full absolute";

  return (
    <div
      className={`${sidebarClass} scroll-bar 2xl:overflow-hidden sm:overflow-auto ease-linear duration-300 md:flex flex-col justify-between gap-8 min-h-screen max-h-screen w-[250px] p-4 z-10`}
    >
      <section>
        <a className="logo flex items-center justify-center mb-8">
          <IconTeamMaster width={40} height={40} />
          <p className="mt-4 text-xl font-semibold mb-4 text-red-500 inline-flex items-center mx-4">
            Team<span className="text-blue-500">Master</span>
          </p>
        </a>

        {/* MENU SECTION */}
        <h5 className="uppercase font-semibold text-xs text-gray-500 tracking-[2px] mb-4">
          Menu
        </h5>

        <ul className="menu">
          <li>
            <Link
              to="/competitions"
              // HERE YOU MUST CHANGE IT FOR YOURS ROUTES
              className={`${location.pathname === "/"
                ? "block rounded-lg px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
                : "block rounded-lg px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 "
                } `}
            >
              {t("home")}
            </Link>
          </li>
        </ul>
        {/* END MENU SECTION */}

        {/* OTHERS SECTION */}
        <h5 className="uppercase font-semibold text-xs text-gray-500 tracking-[2px] my-4">
          {t("others")}
        </h5>

        <ul className="my-4 menu">
          <li>
            <a
              href="#"
              className="block rounded-lg px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
            >
              {t("contact")}
            </a>
          </li>
        </ul>
        {/*END OTHERS SECTION */}
      </section>
      {user !== null ? (
        <div className="flex gap-8 items-center">
          <a
            href="https://github.com/ShaditCuber/TeamMaster"
            target="_blank"
            rel="noopener noreferrer"
            className="text-black ml-2 hover:text-blue-500"
          >
            <GitHub fill="black" className="hover:red" />
          </a>
          <button
            onClick={() => signOut()}
            className="block py-2 px-4 rounded-lg bg-red-500 text-white font-semibold hover:bg-red-600 transitio-all duration-500"
          >
            {t("sign-out")}
          </button>
        </div>
      ) : (
        ""
      )}
    </div>
  );
};

export default Sidebar;
