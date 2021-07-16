import * as actionTypes from './actionTypes';
import axios from '../../utils/axios-helper';

export const create = ({ name, description }) => {
  return (dispatch) => {
    return new Promise((resolve, reject) => {
      axios.api
        .post('/scopes', {
          name,
          description,
        })
        .then((res) => {
          if (res.data) {
            dispatch({
              type: actionTypes.CREATE_SCOPE_SUCCESS,
              detail: res.data,
            });
          } else {
            dispatch({
              type: actionTypes.CREATE_SCOPE_FAILED,
              detail: {},
            });
          }

          return resolve(res.data);
        })
        .catch((err) => {
          dispatch({
            type: actionTypes.CREATE_SCOPE_FAILED,
            error: err,
          });
          return reject(err);
        });
    });
  };
};

export const update = (id, { name, description }) => {
  return (dispatch) => {
    return new Promise((resolve, reject) => {
      axios.api
        .put('/scopes/' + id, {
          name,
          description,
        })
        .then((res) => {
          if (res.data) {
            dispatch({
              type: actionTypes.UPDATE_SCOPE_SUCCESS,
              detail: res.data,
            });
          } else {
            dispatch({
              type: actionTypes.UPDATE_SCOPE_FAILED,
              detail: {},
            });
          }

          return resolve(res.data);
        })
        .catch((err) => {
          dispatch({
            type: actionTypes.UPDATE_SCOPE_FAILED,
            error: err,
          });
          return reject(err);
        });
    });
  };
};

export const deleteScope = (id) => {
  return (dispatch) => {
    return new Promise((resolve, reject) => {
      dispatch({
        type: actionTypes.DELETE_SCOPE,
      });
      axios.api
        .delete('/scopes/' + id)
        .then((res) => {
          if (res.data) {
            dispatch({
              type: actionTypes.DELETE_SCOPE_SUCCESS,
              detail: res.data,
            });
          } else {
            dispatch({
              type: actionTypes.DELETE_SCOPE_FAILED,
              detail: {},
            });
          }

          return resolve(res.data);
        })
        .catch((err) => {
          dispatch({
            type: actionTypes.DELETE_SCOPE_FAILED,
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
      dispatch({ type: actionTypes.GET_SCOPE_LIST });
      axios.api
        .get('/scopes', {
          params: { page, size, q, sort, srdir },
        })
        .then((res) => {
          if (res) {
            dispatch({
              type: actionTypes.GET_SCOPE_LIST_SUCCESS,
              scopes: res.data,
            });
            resolve(res.data);
          } else {
            const err = new Error('Unauthorized');
            dispatch({
              type: actionTypes.GET_SCOPE_LIST_FAILED,
              error: err,
            });
            reject(err);
          }
        })
        .catch((err) => {
          dispatch({
            type: actionTypes.GET_SCOPE_LIST_FAILED,
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
        type: actionTypes.GET_SCOPE_BY_ID,
      });
      axios.api
        .get('/scopes/' + id)
        .then((res) => {
          if (res.data) {
            dispatch({
              type: actionTypes.GET_SCOPE_BY_ID_SUCCESS,
              detail: res.data,
            });
          } else {
            dispatch({
              type: actionTypes.GET_SCOPE_BY_ID_FAILED,
              detail: {},
            });
          }

          return resolve(res.data);
        })
        .catch((err) => {
          dispatch({
            type: actionTypes.GET_SCOPE_BY_ID_FAILED,
            error: err,
          });
          return reject(err);
        });
    });
  };
};

export const getActions = (id) => {
  return (dispatch) => {
    return new Promise((resolve, reject) => {
      dispatch({
        type: actionTypes.GET_SCOPE_ACTION_LIST,
      });
      axios.api
        .get('/scopes/' + id + '/actions')
        .then((res) => {
          if (res.data) {
            dispatch({
              type: actionTypes.GET_SCOPE_ACTION_LIST_SUCCESS,
              actions: res.data,
            });
          } else {
            dispatch({
              type: actionTypes.GET_SCOPE_ACTION_LIST_FAILED,
              actions: {},
            });
          }

          return resolve(res.data);
        })
        .catch((err) => {
          dispatch({
            type: actionTypes.GET_SCOPE_ACTION_LIST_FAILED,
            error: err,
          });
          return reject(err);
        });
    });
  };
};

export const getUnassignedActions = (id, { page, size, q, sort, srdir }) => {
  return (dispatch) => {
    return new Promise((resolve, reject) => {
      dispatch({ type: actionTypes.GET_SCOPE_UNASSIGNED_ACTION_LIST });
      axios.api
        .get('/scopes/' + id + '/unassigned-actions', {
          params: { page, size, q, sort, srdir },
        })
        .then((res) => {
          if (res) {
            dispatch({
              type: actionTypes.GET_SCOPE_UNASSIGNED_ACTION_LIST_SUCCESS,
              unassignedActions: res.data,
            });
            resolve(res.data);
          } else {
            const err = new Error('Unauthorized');
            dispatch({
              type: actionTypes.GET_SCOPE_UNASSIGNED_ACTION_LIST_FAILED,
              error: err,
            });
            reject(err);
          }
        })
        .catch((err) => {
          dispatch({
            type: actionTypes.GET_SCOPE_UNASSIGNED_ACTION_LIST_FAILED,
            error: err,
          });
          reject(err);
        });
    });
  };
};
