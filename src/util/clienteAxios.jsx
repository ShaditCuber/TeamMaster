import axios from 'axios';
import { getToken, clearStorage } from './util';

const clienteAxios = axios.create({
  baseURL: import.meta.env.VITE_WCA_BASE_URL,
});

const backUrl =
  import.meta.env.VITE_STATE === 'development'
    ? import.meta.env.VITE_BACK_BASE_URL_DEV
    : import.meta.env.VITE_BACK_BASE_URL_PROD;

export const clienteBack = axios.create({
  baseURL: backUrl,
});

export const callWCA = async (url) => {
  url = `/api/v0/${url}`;
  const response = await clienteAxios.get(url);
  return response.data;
};

clienteAxios.interceptors.request.use(
  function (config) {
    const token = getToken();
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  function (error) {
    if (error.response.status === 401) {
      clearStorage();
      window.location = '/';
    }
    return Promise.reject(error);
  }
);

clienteAxios.interceptors.response.use(
  function (response) {
    if (
      response.data.codigo === 401 ||
      response.data.status === 'Token is Expired'
    ) {
      clearStorage();
      window.location = '/';
    }

    if (response.data.codigo === 403) {
      //error de permisos
    }

    return response;
  },
  function (error) {
    if (error.response.status === 401) {
      clearStorage();
      window.location = '/';
    } else {
      return Promise.reject(error);
    }
  }
);

export default clienteAxios;
