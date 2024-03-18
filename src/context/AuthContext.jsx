import React, { createContext, useContext, useState, useMemo, useEffect } from "react";
import { clearStorage, getToken } from "../util/util";
import { WCA_BASE_URL, WCA_CLIENT_ID, WCA_REDIRECT_URI } from '../Const/Const';
const UsuarioContext = createContext();

const UsuarioProvider = (props) => {


    const [user, setUser] = useState(null);

    useEffect(() => {
        getUsuario();
    }, []);


    const signIn = async () => {
        try {
            const params = new URLSearchParams({
                client_id: WCA_CLIENT_ID,
                response_type: 'token',
                redirect_uri: WCA_REDIRECT_URI,
                scope: 'manage_competitions',
            });
            window.location = `${WCA_BASE_URL}/oauth/authorize?${params.toString()}`;
        }
        catch (error) {
            console.error('Error signing in', error);
        }
    };

    const getUsuario = async () => {
        if (!getToken()) {
            return;
        }
        const expire = localStorage.getItem('expire');

        if (expire) {
            const expireDate = new Date(expire);

            if (expireDate < new Date()) {
                clearStorage();
                window.location = "/";
                return;
            }
        }

        setUser({ 'token': getToken() });
    };


    const signOut = async () => {
        clearStorage();
        window.location = "/";
    };

    const value = useMemo(() => {
        return {
            user,
            signIn,
            signOut,
        };
    }, [user, signIn, signOut]);

    return <UsuarioContext.Provider
        value={value}
        {...props}
    />;
};

const useUsuario = () => {
    return useContext(UsuarioContext);
};

export { UsuarioProvider, useUsuario };