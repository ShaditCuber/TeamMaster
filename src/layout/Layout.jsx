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
                <div className="bg-blue-500 text-white p-4 md:w-1/6 max-h-full">
                    <a href={user?.token ? `/competitions` : '/'} className="text-xl font-semibold mb-4">TeamMaster</a>

                    {user?.token != null ? <button onClick={handleSignOut} className="block py-2 px-4 hover:bg-gray-200">{t("sign-out")}</button> : <button onClick={handleSignIn} className="block py-2 px-4 hover:bg-gray-200">{t("sign-in")}</button>}

                    <div className="mt-auto">
                        <button onClick={() => i18n.changeLanguage("es")} className="block py-2 px-4 hover:bg-gray-200">ES</button>
                        <button onClick={() => i18n.changeLanguage("en")} className="block py-2 px-4 hover:bg-gray-200">EN</button>
                    </div>
                </div>

                <div className="flex-1 flex items-center justify-center w-3/4 mx-20">
                    {children}
                </div>
            </div >
        </div >
    );
};

export default Layout;
