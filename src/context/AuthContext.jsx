import React, { createContext, useContext, useState, useMemo, useEffect } from "react";
import { clearStorage, getToken } from "../util/util";
const UsuarioContext = createContext();

const UsuarioProvider = (props) => {


    const [user, setUser] = useState(null);

    useEffect(() => {
        getUsuario();
    }, []);


    const signIn = async () => {

        const client_id = import.meta.env.VITE_STATE === 'production' ? import.meta.env.VITE_WCA_CLIENT_ID_PROD : import.meta.env.VITE_WCA_CLIENT_ID_DEV;


        try {
            const params = new URLSearchParams({
                client_id: client_id,
                response_type: 'token',
                redirect_uri: window.location.origin,
                scope: 'manage_competitions',
            });
            window.location = `${import.meta.env.VITE_WCA_BASE_URL}/oauth/authorize?${params.toString()}`;
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