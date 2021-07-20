import produce from 'immer';
import * as actionTypes from '../actions/actionTypes';

const initialState = {
  loading: false,
  user: {},
};

const validateToken = (state, action) => {
  return produce(state, (draft) => {
    draft.loading = true;
  });
};

const validateTokenSuccess = (state, action) => {
  return produce(state, (draft) => {
    draft.appauth = action.token;
    draft.loading = false;
    draft.user = action.user;
  });
};

const validateTokenFail = (state, action) => {
  return produce(state, (draft) => {
    draft.loading = false;
    draft.appauth = null;
    draft.user = {};
  });
};

const login = (state, action) => {
  return produce(state, (draft) => {
    draft.loading = true;
  });
};

const loginSuccess = (state, action) => {
  return produce(state, (draft) => {
    const { id, email, name } = action.user;
    draft.loading = false;
    draft.user = {
      id,
      email,
      name,
    };
  });
};

const loginFail = (state, action) => {
  return produce(state, (draft) => {
    draft.loading = false;
    draft.user = {};
  });
};

const logout = (state, action) => {
  return produce(state, (draft) => {
    draft.user = {};
  });
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.VALIDATE_TOKEN:
      return validateToken(state, action);
    case actionTypes.VALIDATE_TOKEN_SUCCESS:
      return validateTokenSuccess(state, action);
    case actionTypes.VALIDATE_TOKEN_FAILED:
      return validateTokenFail(state, action);

    case actionTypes.LOGIN:
      return login(state, action);
    case actionTypes.LOGIN_SUCCESS:
      return loginSuccess(state, action);
    case actionTypes.LOGIN_FAILED:
      return loginFail(state, action);

    case actionTypes.LOGOUT:
      return logout(state, action);
    default:
      return state;
  }
};

export default reducer;
