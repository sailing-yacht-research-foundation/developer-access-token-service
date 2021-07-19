import * as actionTypes from './actionTypes';
import axios from '../../utils/axios-helper';

export const create = ({ name, email }) => {
  return (dispatch) => {
    return new Promise((resolve, reject) => {
      axios.api
        .post('/developer-tokens', {
          name,
          email,
        })
        .then((res) => {
          if (res.data) {
            dispatch({
              type: actionTypes.CREATE_DEVELOPER_TOKEN_SUCCESS,
              detail: res.data,
            });
          } else {
            dispatch({
              type: actionTypes.CREATE_DEVELOPER_TOKEN_FAILED,
              detail: {},
            });
          }

          return resolve(res.data);
        })
        .catch((err) => {
          dispatch({
            type: actionTypes.CREATE_DEVELOPER_TOKEN_FAILED,
            error: err,
          });
          return reject(err);
        });
    });
  };
};

export const deleteDeveloperToken = (id) => {
  return (dispatch) => {
    return new Promise((resolve, reject) => {
      dispatch({
        type: actionTypes.DELETE_DEVELOPER_TOKEN,
      });
      axios.api
        .delete('/developer-tokens/' + id)
        .then((res) => {
          if (res.data) {
            dispatch({
              type: actionTypes.DELETE_DEVELOPER_TOKEN_SUCCESS,
              detail: res.data,
            });
          } else {
            dispatch({
              type: actionTypes.DELETE_DEVELOPER_TOKEN_FAILED,
              detail: {},
            });
          }

          return resolve(res.data);
        })
        .catch((err) => {
          dispatch({
            type: actionTypes.DELETE_DEVELOPER_TOKEN_FAILED,
            error: err,
          });
          return reject(err);
        });
    });
  };
};

export const getList = (id, { page, size, q, sort, srdir }) => {
  return (dispatch) => {
    debugger;
    return new Promise((resolve, reject) => {
      dispatch({ type: actionTypes.GET_DEVELOPER_TOKEN_LIST });
      axios.api
        .get('/developers/' + id + '/tokens', {
          params: { page, size, q, sort, srdir },
        })
        .then((res) => {
          if (res) {
            dispatch({
              type: actionTypes.GET_DEVELOPER_TOKEN_LIST_SUCCESS,
              developerTokens: res.data,
            });
            resolve(res.data);
          } else {
            const err = new Error('Unauthorized');
            dispatch({
              type: actionTypes.GET_DEVELOPER_TOKEN_LIST_FAILED,
              error: err,
            });
            reject(err);
          }
        })
        .catch((err) => {
          dispatch({
            type: actionTypes.GET_DEVELOPER_TOKEN_LIST_FAILED,
            error: err,
          });
          reject(err);
        });
    });
  };
};

export const getById = ({ id }) => {
  return (dispatch) => {
    return new Promise((resolve, reject) => {
      dispatch({
        type: actionTypes.GET_DEVELOPER_TOKEN_BY_ID,
      });
      axios.api
        .get('/developer-tokens/' + id)
        .then((res) => {
          if (res.data) {
            dispatch({
              type: actionTypes.GET_DEVELOPER_TOKEN_BY_ID_SUCCESS,
              detail: res.data,
            });
          } else {
            dispatch({
              type: actionTypes.GET_DEVELOPER_TOKEN_BY_ID_FAILED,
              detail: {},
            });
          }

          return resolve(res.data);
        })
        .catch((err) => {
          dispatch({
            type: actionTypes.GET_DEVELOPER_TOKEN_BY_ID_FAILED,
            error: err,
          });
          return reject(err);
        });
    });
  };
};
