import * as actionTypes from './actionTypes';
import axios from '../../utils/axios-helper';

export const create = ({ name, email }) => {
  return (dispatch) => {
    return new Promise((resolve, reject) => {
      axios.api
        .post('/developers', {
          name,
          email,
        })
        .then((res) => {
          if (res.data) {
            dispatch({
              type: actionTypes.CREATE_DEVELOPER_SUCCESS,
              detail: res.data,
            });
          } else {
            dispatch({
              type: actionTypes.CREATE_DEVELOPER_FAILED,
              detail: {},
            });
          }

          return resolve(res.data);
        })
        .catch((err) => {
          dispatch({
            type: actionTypes.CREATE_DEVELOPER_FAILED,
            error: err,
          });
          return reject(err);
        });
    });
  };
};

export const update = (id, { name, email }) => {
  return (dispatch) => {
    return new Promise((resolve, reject) => {
      axios.api
        .put('/developers/' + id, {
          name,
          email,
        })
        .then((res) => {
          if (res.data) {
            dispatch({
              type: actionTypes.UPDATE_DEVELOPER_SUCCESS,
              detail: res.data,
            });
          } else {
            dispatch({
              type: actionTypes.UPDATE_DEVELOPER_FAILED,
              detail: {},
            });
          }

          return resolve(res.data);
        })
        .catch((err) => {
          dispatch({
            type: actionTypes.UPDATE_DEVELOPER_FAILED,
            error: err,
          });
          return reject(err);
        });
    });
  };
};

export const deleteDeveloper = (id) => {
  return (dispatch) => {
    return new Promise((resolve, reject) => {
      dispatch({
        type: actionTypes.DELETE_DEVELOPER,
      });
      axios.api
        .delete('/developers/' + id)
        .then((res) => {
          if (res.data) {
            dispatch({
              type: actionTypes.DELETE_DEVELOPER_SUCCESS,
              detail: res.data,
            });
          } else {
            dispatch({
              type: actionTypes.DELETE_DEVELOPER_FAILED,
              detail: {},
            });
          }

          return resolve(res.data);
        })
        .catch((err) => {
          dispatch({
            type: actionTypes.DELETE_DEVELOPER_FAILED,
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
      dispatch({ type: actionTypes.GET_DEVELOPER_LIST });
      axios.api
        .get('/developers', {
          params: { page, size, q, sort, srdir },
        })
        .then((res) => {
          if (res) {
            dispatch({
              type: actionTypes.GET_DEVELOPER_LIST_SUCCESS,
              developers: res.data,
            });
            resolve(res.data);
          } else {
            const err = new Error('Unauthorized');
            dispatch({
              type: actionTypes.GET_DEVELOPER_LIST_FAILED,
              error: err,
            });
            reject(err);
          }
        })
        .catch((err) => {
          dispatch({
            type: actionTypes.GET_DEVELOPER_LIST_FAILED,
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
        type: actionTypes.GET_DEVELOPER_BY_ID,
      });
      axios.api
        .get('/developers/' + id)
        .then((res) => {
          if (res.data) {
            dispatch({
              type: actionTypes.GET_DEVELOPER_BY_ID_SUCCESS,
              detail: res.data,
            });
          } else {
            dispatch({
              type: actionTypes.GET_DEVELOPER_BY_ID_FAILED,
              detail: {},
            });
          }

          return resolve(res.data);
        })
        .catch((err) => {
          dispatch({
            type: actionTypes.GET_DEVELOPER_BY_ID_FAILED,
            error: err,
          });
          return reject(err);
        });
    });
  };
};
