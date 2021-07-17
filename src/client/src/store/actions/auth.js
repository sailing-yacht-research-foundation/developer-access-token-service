import * as actionTypes from './actionTypes';
import conifg from '../../config';
import {
  storageSetItem,
  storageRemoveItem,
  deleteCookie,
  storageGetItem,
} from '../../utils/utilities';
import axios, { changeToken } from '../../utils/axios-helper';

export const validateToken = () => {
  return (dispatch) => {
    return new Promise((resolve, reject) => {
      axios.api
        .post('/auth/validate-token', {
          token: storageGetItem(conifg.AUTH_STORAGE_KEY),
        })
        .then((res) => {
          if (res) {
            dispatch({
              type: actionTypes.VALIDATE_TOKEN_SUCCESS,
              user: res.data,
            });
            resolve(res.data);
          } else {
            console.log(res.data);
            const err = new Error('Unauthorized');
            dispatch({
              type: actionTypes.VALIDATE_TOKEN_FAILED,
            });
            reject(err);
          }
        })
        .catch((err) => {
          console.log(err);
          dispatch({
            type: actionTypes.VALIDATE_TOKEN_FAILED,
          });
          reject(err);
        });
    });
  };
};

export const login = ({ access_token = '' }) => {
  return (dispatch) => {
    return new Promise((resolve, reject) => {
      console.log('signing in');
      axios.api
        .post('/auth/login', { access_token })
        .then((res) => {
          if (res.data.id) {
            storageSetItem(conifg.AUTH_STORAGE_KEY, res.data.token);
            changeToken(res.data.token);

            dispatch({
              type: actionTypes.LOGIN_SUCCESS,
              user: res.data,
            });
          } else {
            dispatch({
              type: actionTypes.LOGIN_FAILED,
              user: {},
            });
          }

          return resolve(res.data);
        })
        .catch((err) => {
          dispatch({
            type: actionTypes.LOGIN_FAILED,
            error: err,
          });
          return reject(err);
        });
    });
  };
};

export const logout = (data) => {
  return (dispatch) => {
    storageRemoveItem(conifg.AUTH_STORAGE_KEY);
    changeToken('');
    deleteCookie(conifg.AUTH_COOKIE_STORAGE_KEY);
    dispatch({
      type: actionTypes.LOGOUT,
    });
  };
};
