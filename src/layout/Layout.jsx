import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useUsuario } from '../context/AuthContext'

const Layout = ({ children }) => {

    const [t, i18n] = useTranslation('global');
    const { signIn, user, signOut } = useUsuario();


    const handleSignIn = () => {
        signIn();
    }

    const handleSignOut = () => {
        signOut();
    }

    return (
        <div className="bg-gray-100 flex flex-col max-h">
            <div className="flex flex-col md:flex-row h-screen">
                <div className="bg-opacity-90 bg-black p-4 md:w-1/6 flex flex-col justify-between">
                    <a href={user?.token ? "/competitions" : "/"} className="text-2xl font-semibold mb-4 text-red-500">Team<span className="text-blue-500">Master</span></a>
                    {user?.token != null ? (
                        <button onClick={handleSignOut} className="block py-2 px-4 rounded-lg bg-white text-blue-500 font-semibold hover:bg-gray-200">{t("sign-out")}</button>
                    ) : (
                        <button onClick={handleSignIn} className="block py-2 px-4 rounded-lg bg-white text-blue-500 font-semibold hover:bg-gray-200">{t("sign-in")}</button>
                    )}
                    <div className="flex flex-col mt-4">
                        <p className="text-white font-semibold mb-2">{t("change-language")}</p>
                        <button onClick={() => i18n.changeLanguage("es")} className={`py-2 px-4 rounded-lg bg-white text-blue-500 font-semibold hover:bg-gray-200 ${i18n.language === 'es' ? 'bg-blue-200' : ''} mb-2`}>{t("lang-es")}</button>
                        <button onClick={() => i18n.changeLanguage("en")} className={`py-2 px-4 rounded-lg bg-white text-blue-500 font-semibold hover:bg-gray-200 ${i18n.language === 'en' ? 'bg-blue-200' : ''}`}>{t("lang-en")}</button>
                    </div>
                </div>
                <div className="flex-1 flex my-10 justify-center w-3/4 mx-auto">
                    {children}
                </div>
            </div >
        </div >
    );
};

export default Layout;
