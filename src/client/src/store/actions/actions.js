import * as actionTypes from './actionTypes';
import axios from '../../utils/axios-helper';

export const create = ({ name, service }) => {
  return (dispatch) => {
    return new Promise((resolve, reject) => {
      axios.api
        .post('/actions', {
          name,
          service,
        })
        .then((res) => {
          if (res.data) {
            dispatch({
              type: actionTypes.CREATE_ACTION_SUCCESS,
              detail: res.data,
            });
          } else {
            dispatch({
              type: actionTypes.CREATE_ACTION_FAILED,
              detail: {},
            });
          }

          return resolve(res.data);
        })
        .catch((err) => {
          dispatch({
            type: actionTypes.CREATE_ACTION_FAILED,
            error: err,
          });
          return reject(err);
        });
    });
  };
};

export const update = (id, { name, service }) => {
  return (dispatch) => {
    return new Promise((resolve, reject) => {
      axios.api
        .put('/actions/' + id, {
          name,
          service,
        })
        .then((res) => {
          if (res.data) {
            dispatch({
              type: actionTypes.UPDATE_ACTION_SUCCESS,
              detail: res.data,
            });
          } else {
            dispatch({
              type: actionTypes.UPDATE_ACTION_FAILED,
              detail: {},
            });
          }

          return resolve(res.data);
        })
        .catch((err) => {
          dispatch({
            type: actionTypes.UPDATE_ACTION_FAILED,
            error: err,
          });
          return reject(err);
        });
    });
  };
};

export const deleteAction = (id) => {
  return (dispatch) => {
    return new Promise((resolve, reject) => {
      dispatch({
        type: actionTypes.DELETE_ACTION,
      });
      axios.api
        .delete('/actions/' + id)
        .then((res) => {
          if (res.data) {
            dispatch({
              type: actionTypes.DELETE_ACTION_SUCCESS,
              detail: res.data,
            });
          } else {
            dispatch({
              type: actionTypes.DELETE_ACTION_FAILED,
              detail: {},
            });
          }

          return resolve(res.data);
        })
        .catch((err) => {
          dispatch({
            type: actionTypes.DELETE_ACTION_FAILED,
            error: err,
          });
          return reject(err);
        });
    });
  };
};

export const getList = ({ page, size, q, sort, srdir }) => {
  return (dispatch) => {
    return new Promise((resolve, reject) => {
      dispatch({ type: actionTypes.GET_ACTION_LIST });
      axios.api
        .get('/actions', {
          params: { page, size, q, sort, srdir },
        })
        .then((res) => {
          if (res) {
            dispatch({
              type: actionTypes.GET_ACTION_LIST_SUCCESS,
              actions: res.data,
            });
            resolve(res.data);
          } else {
            const err = new Error('Unauthorized');
            dispatch({
              type: actionTypes.GET_ACTION_LIST_FAILED,
              error: err,
            });
            reject(err);
          }
        })
        .catch((err) => {
          dispatch({
            type: actionTypes.GET_ACTION_LIST_FAILED,
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
        type: actionTypes.GET_ACTION_BY_ID,
      });
      axios.api
        .get('/actions/' + id)
        .then((res) => {
          if (res.data) {
            dispatch({
              type: actionTypes.GET_ACTION_BY_ID_SUCCESS,
              detail: res.data,
            });
          } else {
            dispatch({
              type: actionTypes.GET_ACTION_BY_ID_FAILED,
              detail: {},
            });
          }

          return resolve(res.data);
        })
        .catch((err) => {
          dispatch({
            type: actionTypes.GET_ACTION_BY_ID_FAILED,
            error: err,
          });
          return reject(err);
        });
    });
  };
};
