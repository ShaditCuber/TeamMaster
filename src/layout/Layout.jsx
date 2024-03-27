import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Sidebar from "../components/Sidebar/Sidebar";
import Navbar from "../components/Navbar/Navbar";
import Footer from "../components/Footer/Footer";

const Layout = ({ children }) => {
  const [t, i18n] = useTranslation("global");
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarVisible(!isSidebarVisible);
  };

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

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setIsSidebarVisible(true);
      } else {
        setIsSidebarVisible(false);
      }
    };

    handleResize();

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="flex overflow-hidden sm:overflow-auto">
      <Sidebar isVisible={isSidebarVisible} />
      <div className="flex flex-col w-full h-screen p-2">
        <Navbar onMenuClick={toggleSidebar} />
        <main
          className={`bg-gray-100 p-6 rounded-xl h-screen overflow-auto scroll-bar animate-fade-in`}
        >
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
