import produce from 'immer';
import * as actionTypes from '../actions/actionTypes';

const initialState = {
  snackbar: {
    show: false,
    message: '',
    opt: {},
    id: '',
  },
  loading: false,
};

const showSnackbar = (state, action) => {
  return produce(state, (draft) => {
    draft.snackbar = {
      show: true,
      message: action.message || '',
      opt: action.opt || {},
      id: action.id,
    };
  });
};

const hideSnackbar = (state, action) => {
  if (state.snackbar.id === action.id) {
    return produce(state, (draft) => {
      draft.snackbar.show = false;
    });
  } else {
    return state;
  }
};

const forceHideSnackbar = (state, action) => {
  return produce(state, (draft) => {
    draft.snackbar.show = false;
  });
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.SHOW_SNACKBAR:
      return showSnackbar(state, action);
    case actionTypes.HIDE_SNACKBAR:
      return hideSnackbar(state, action);
    case actionTypes.FORCE_HIDE_SNACKBAR:
      return forceHideSnackbar(state, action);
    default:
      return state;
  }
};

export default reducer;
