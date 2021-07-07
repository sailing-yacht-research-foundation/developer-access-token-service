import axios from 'axios';
import { storageGetItem } from './utilities';
import * as configs from '../config';

//let token = storageGetItem(configs.STORAGE_AUTH_KEY)

let api = axios.create({
  baseURL: configs.API_BASE_URL + '/v1',
  headers: {
    Authorization: 'Bearer ' + (storageGetItem(configs.AUTH_STORAGE_KEY) || ''),
  },
});

api.interceptors.request.use(
  (config) => {
    config.headers.Authorization = `Bearer ${
      storageGetItem(configs.AUTH_STORAGE_KEY) || ''
    }`;

    return config;
  },
  (error) => {
    console.error(error);

    Promise.reject(error);
  },
);

export default {
  api,
};

export const changeToken = (newToken) => {
  api.defaults.headers.common['Authorization'] =
    'Bearer ' + (storageGetItem(configs.AUTH_STORAGE_KEY) || '');
};
