import React, { Fragment, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import Sidebar from "../components/Sidebar/Sidebar";
import Navbar from "../components/Navbar/Navbar";
import Footer from "../components/Footer/Footer";
import { Transition } from "@headlessui/react";

const Layout = ({ children }) => {
  const [t, i18n] = useTranslation("global");
  const [showNav, setShowNav] = useState(true);
  const sidebarRef = useRef(null);

  // guardar el idioma en el localstorage
  useEffect(() => {
    const savedLanguage = localStorage.getItem("i18nextLng");
    if (savedLanguage) {
      i18n.changeLanguage(savedLanguage);
    }
  }, [i18n]);

  useEffect(() => {
    localStorage.setItem("i18nextLng", i18n.language);
  }, [i18n.language]);

  const handleClickOutside = (event) => {
    if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
      setShowNav(false);
    }
  };

  useEffect(() => {
    if (window.innerWidth <= 640 && showNav) {
      document.addEventListener("click", handleClickOutside);
    }

    return () => {
      if (window.innerWidth <= 640) {
        document.removeEventListener("click", handleClickOutside);
      }
    };
  }, [showNav]);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 640px)");
    setShowNav(!mediaQuery.matches);

    const handleResize = () => {
      setShowNav(!mediaQuery.matches);
    };

    mediaQuery.addEventListener("change", handleResize);

    return () => {
      mediaQuery.removeEventListener("change", handleResize);
    };
  }, []);

  return (
    <div className="flex overflow-hidden sm:overflow-auto">
      <Transition
        as={Fragment}
        show={showNav}
        enter="transform transition duration-[400ms]"
        enterFrom="-translate-x-full"
        enterTo="translate-x-0"
        leave="transform duration-[400ms] transition ease-in-out"
        leaveFrom="translate-x-0"
        leaveTo="-translate-x-full"
      >
        <Sidebar showNav={showNav} setShowNav={setShowNav} ref={sidebarRef} />
      </Transition>
      <div className="flex flex-col w-full h-screen p-2">
        <Navbar showNav={showNav} setShowNav={setShowNav} />
        <main
          className={`bg-gray-100 p-6 rounded-xl h-screen overflow-auto scroll-bar animate-blurred-fade-in`}
        >
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
