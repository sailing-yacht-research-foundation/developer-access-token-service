import * as actionTypes from './actionTypes';
import { snackId } from '../../utils/utilities';

export const showSnackbar = (message, opt) => {
  return (dispatch) => {
    dispatch({
      type: actionTypes.FORCE_HIDE_SNACKBAR,
    });
    setTimeout(() => {
      const id = snackId();

      dispatch({
        type: actionTypes.SHOW_SNACKBAR,
        message,
        opt,
        id,
      });

      setTimeout(() => {
        dispatch({
          type: actionTypes.HIDE_SNACKBAR,
          id,
        });
      }, (opt || {}).timeout || 3000);
    }, 500);
  };
};

export const hideSnackbar = (id) => {
  return {
    type: actionTypes.HIDE_SNACKBAR,
    id,
  };
};

export const forceHideSnackbar = () => {
  return {
    type: actionTypes.FORCE_HIDE_SNACKBAR,
  };
};
