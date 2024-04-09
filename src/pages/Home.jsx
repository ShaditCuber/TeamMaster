import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useUsuario } from "../context/AuthContext";
import Navbar from "../components/Navbar/Navbar";
import Footer from "../components/Footer/Footer";

export const Home = () => {
  const { t } = useTranslation("global");
  const { signIn } = useUsuario();

  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      const hashParams = new URLSearchParams(hash.substring(1));
      const accessToken = hashParams.get("access_token");
      const expire = hashParams.get("expires_in");

      const date = new Date();
      date.setSeconds(date.getSeconds() + parseInt(expire));
      const expireDate = date.toISOString();

      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("expire", expireDate);
      window.location = "/competitions";
    }
  }, []);

  return (
    <>
      <Navbar />
      <div className="grid place-items-center bg-cover bg-center grid-cols-1 grid-rows-1 min-h-dvh ">
        <div className="z-0 flex items-center justify-center max-w-screen-xl gap-4 p-4 text-center">
          <div className="max-w-2xl my-[90px]">
            <h2 className="lg:text-3xl mb-2 font-semibold text-gray-800">
              {t("welcome")} <span className="text-red-500">Team</span>
              <span className="text-blue-500">Master</span>
            </h2>
            <p className="text-lg text-gray-700 mb-6 text-justify">
              {t("description")}{" "}
              <a className="text-blue-500" href="https://www.worldcubeassociation.org/" target="_blank">
                WCA (World Cube Association)
              </a>
              <br />
              {t("with-teammaster")}
            </p>
            <ul className="list-disc list-inside text-left">
              <li>{t("tag1")}</li>
              <li>{t("tag2")}</li>
              <li>{t("tag3")}</li>
              <li>{t("tag4")}</li>
            </ul>
            <p className="text-lg text-gray-700 font-semibold mt-6 text-justify">
              {t("more-info")}
            </p>
            <button
              onClick={() => signIn()}
              className="mt-4 p-4 rounded-2xl bg-blue-500 text-white transition-all duration-500 hover:bg-blue-600"
            >
              {t("sign-in")}
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};
