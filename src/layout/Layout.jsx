import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useUsuario } from '../context/AuthContext'
import { IconTeamMaster } from '../Icons/Icons';
import { GitHub } from '../components/Icons/Icons';

const Layout = ({ children }) => {

    const [t, i18n] = useTranslation('global');
    const { signIn, user, signOut } = useUsuario();

    // guardar el idioma en el localstorage
    useEffect(() => {
        const savedLanguage = localStorage.getItem('i18nextLng');
        if (savedLanguage) {
            i18n.changeLanguage(savedLanguage);
        }
    }, [i18n]);

    useEffect(() => {
        localStorage.setItem('i18nextLng', i18n.language);
    }, [i18n.language]);

    return (
        <div className="bg-gray-100 flex flex-col h-screen">
            <div className="flex flex-col md:flex-row h-full">
                <div className="bg-opacity-90 bg-black p-4 md:w-1/6 flex flex-col justify-between">
                    <div className="flex items-center justify-center">
                        <IconTeamMaster width={40} height={40} />
                        <a href={user?.token ? "/competitions" : "/"} className="mt-4 text-3xl font-semibold mb-4 text-red-500 inline-flex items-center mx-4">
                            Team<span className="text-blue-500">Master</span>
                        </a>
                        <a href="https://github.com/ShaditCuber/TeamMaster" target="_blank" rel="noopener noreferrer" className="text-white ml-2 hover:text-blue-500">
                            <GitHub fill="white" className="hover:red" />
                        </a>
                    </div>
                    {user?.token != null ? (
                        <button onClick={() => signOut()} className="block py-2 px-4 rounded-lg bg-white text-blue-500 font-semibold hover:bg-gray-200">{t("sign-out")}</button>
                    ) : (
                        <button onClick={() => signIn()} className="block py-2 px-4 rounded-lg bg-white text-blue-500 font-semibold hover:bg-gray-200">{t("sign-in")}</button>
                    )}
                    <div className="flex flex-col mt-4">
                        <p className="text-white font-semibold mb-2">{t("change-language")}</p>
                        <button onClick={() => i18n.changeLanguage("es")} className={`py-2 px-4 rounded-lg bg-white text-blue-500 font-semibold hover:bg-gray-200 ${i18n.language === 'es' ? 'bg-blue-200' : ''} mb-2`}>{t("lang-es")}</button>
                        <button onClick={() => i18n.changeLanguage("en")} className={`py-2 px-4 rounded-lg bg-white text-blue-500 font-semibold hover:bg-gray-200 ${i18n.language === 'en' ? 'bg-blue-200' : ''}`}>{t("lang-en")}</button>
                    </div>
                </div>
                <div className="flex-1 flex my-10 justify-center w-3/4 mx-auto overflow-y-auto">
                    {children}
                </div>
            </div >
        </div >
    );
};

export default Layout;
