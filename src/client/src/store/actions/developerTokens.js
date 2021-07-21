import * as actionTypes from './actionTypes';
import axios from '../../utils/axios-helper';

export const create = ({ name, developerId, scopeIds = [] }) => {
  return (dispatch) => {
    return new Promise((resolve, reject) => {
      axios.api
        .post('/developer-tokens', {
          name,
          developerId,
          scopeIds,
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

export const getUnassignedScopes = ({ page, size, q, sort, srdir }) => {
  return (dispatch) => {
    return new Promise((resolve, reject) => {
      dispatch({
        type: actionTypes.GET_DEVELOPER_TOKEN_UNASSIGNED_SCOPES_LIST,
      });
      axios.api
        .get('/scopes', {
          params: { page, size, q, sort, srdir },
        })
        .then((res) => {
          if (res) {
            dispatch({
              type: actionTypes.GET_DEVELOPER_TOKEN_UNASSIGNED_SCOPES_LIST_SUCCESS,
              unassignedScopes: res.data,
            });
            resolve(res.data);
          } else {
            const err = new Error('Unauthorized');
            dispatch({
              type: actionTypes.GET_DEVELOPER_TOKEN_UNASSIGNED_SCOPES_LIST_FAILED,
              error: err,
            });
            reject(err);
          }
        })
        .catch((err) => {
          dispatch({
            type: actionTypes.GET_DEVELOPER_TOKEN_UNASSIGNED_SCOPES_LIST_FAILED,
            error: err,
          });
          reject(err);
        });
    });
  };
};

export const addScope = (scope) => {
  return (dispatch) => {
    dispatch({
      type: actionTypes.ADD_SCOPES_TO_DEVELOPER_TOKEN,
      scope: scope,
    });
  };
};

export const removeScope = (scope) => {
  return (dispatch) => {
    dispatch({
      type: actionTypes.REMOVE_SCOPES_FROM_DEVELOPER_TOKEN,
      scope: scope,
    });
  };
};

export const getScopes = (id) => {
  return (dispatch) => {
    return new Promise((resolve, reject) => {
      dispatch({
        type: actionTypes.GET_DEVELOPER_TOKEN_SCOPES_LIST,
      });
      axios.api
        .get('/developer-tokens/' + id + '/scopes')
        .then((res) => {
          if (res.data) {
            dispatch({
              type: actionTypes.GET_DEVELOPER_TOKEN_SCOPES_LIST_SUCCESS,
              scopes: res.data,
            });
          } else {
            dispatch({
              type: actionTypes.GET_DEVELOPER_TOKEN_SCOPES_LIST_FAILED,
              scopes: [],
            });
          }

          return resolve(res.data);
        })
        .catch((err) => {
          dispatch({
            type: actionTypes.GET_DEVELOPER_TOKEN_SCOPES_LIST_FAILED,
            error: err,
          });
          return reject(err);
        });
    });
  };
};
