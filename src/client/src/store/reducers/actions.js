import produce from 'immer';
import * as actionTypes from '../actions/actionTypes';

const initialState = {
  loading: {
    actions: true,
    detail: true,
    action: false,
  },
  actions: {},
  detail: {},
};

const upsert = (state, action) => {
  return produce(state, (draft) => {
    draft.loading.action = true;
  });
};

const upsertSuccess = (state, action) => {
  return produce(state, (draft) => {
    draft.loading.action = false;
    draft.detail = {};
  });
};

const upsertFail = (state, action) => {
  return produce(state, (draft) => {
    draft.loading.action = false;
  });
};

const getList = (state, action) => {
  return produce(state, (draft) => {
    draft.loading.actions = true;
  });
};

const getListSuccess = (state, action) => {
  return produce(state, (draft) => {
    draft.loading.actions = false;
    draft.actions = action.actions;
  });
};

const getListFail = (state, action) => {
  return produce(state, (draft) => {
    draft.loading.actions = false;
    draft.actions = {};
  });
};

const getById = (state, action) => {
  return produce(state, (draft) => {
    draft.loading.detail = true;
  });
};

const getByIdSuccess = (state, action) => {
  return produce(state, (draft) => {
    draft.loading.detail = false;
    draft.detail = action.detail;
  });
};

const getByIdFail = (state, action) => {
  return produce(state, (draft) => {
    draft.loading.detail = false;
    draft.detail = {};
  });
};

const deleteAction = (state, action) => {
  return produce(state, (draft) => {
    draft.loading.action = true;
  });
};

const deleteActionSuccess = (state, action) => {
  return produce(state, (draft) => {
    draft.loading.action = false;
    if (draft.actions?.rows?.length > 0) {
      draft.actions.rows = [...draft.actions.rows].filter(
        (t) => t.id !== action.detail.id,
      );
    }
  });
};

const deleteActionFail = (state, action) => {
  return produce(state, (draft) => {
    draft.loading.action = false;
  });
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.CREATE_ACTION:
      return upsert(state, action);
    case actionTypes.CREATE_ACTION_SUCCESS:
      return upsertSuccess(state, action);
    case actionTypes.CREATE_ACTION_FAILED:
      return upsertFail(state, action);

    case actionTypes.UPDATE_ACTION:
      return upsert(state, action);
    case actionTypes.UPDATE_ACTION_SUCCESS:
      return upsertSuccess(state, action);
    case actionTypes.UPDATE_ACTION_FAILED:
      return upsertFail(state, action);

    case actionTypes.GET_ACTION_LIST:
      return getList(state, action);
    case actionTypes.GET_ACTION_LIST_SUCCESS:
      return getListSuccess(state, action);
    case actionTypes.GET_ACTION_LIST_FAILED:
      return getListFail(state, action);

    case actionTypes.GET_ACTION_BY_ID:
      return getById(state, action);
    case actionTypes.GET_ACTION_BY_ID_SUCCESS:
      return getByIdSuccess(state, action);
    case actionTypes.GET_ACTION_BY_ID_FAILED:
      return getByIdFail(state, action);

    case actionTypes.DELETE_ACTION:
      return deleteAction(state, action);
    case actionTypes.DELETE_ACTION_SUCCESS:
      return deleteActionSuccess(state, action);
    case actionTypes.DELETE_ACTION_FAILED:
      return deleteActionFail(state, action);

    default:
      return state;
  }
};

export default reducer;
