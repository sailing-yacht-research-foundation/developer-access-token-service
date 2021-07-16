import produce from 'immer';
import * as actionTypes from '../actions/actionTypes';

const initialState = {
  loading: {
    scopes: true,
    detail: true,
    scope: false,
    actions: true,
  },
  scopes: {},
  detail: {},
  unassignedActions: {},
};

const upsert = (state, scope) => {
  return produce(state, (draft) => {
    draft.loading.scope = true;
  });
};

const upsertSuccess = (state, scope) => {
  return produce(state, (draft) => {
    draft.loading.scope = false;
    draft.detail = {};
  });
};

const upsertFail = (state, scope) => {
  return produce(state, (draft) => {
    draft.loading.scope = false;
  });
};

const getList = (state, scope) => {
  return produce(state, (draft) => {
    draft.loading.scopes = true;
  });
};

const getListSuccess = (state, scope) => {
  return produce(state, (draft) => {
    draft.loading.scopes = false;
    draft.scopes = scope.scopes;
  });
};

const getListFail = (state, scope) => {
  return produce(state, (draft) => {
    draft.loading.scopes = false;
    draft.scopes = {};
  });
};

const getActionList = (state, scope) => {
  return produce(state, (draft) => {
    draft.loading.actions = true;
  });
};

const getActionListSuccess = (state, scope) => {
  return produce(state, (draft) => {
    draft.loading.actions = false;
    draft.detail.actions = scope.actions;
  });
};

const getActionListFail = (state, scope) => {
  return produce(state, (draft) => {
    draft.loading.actions = false;
    draft.detail.actions = [];
  });
};

const getById = (state, scope) => {
  return produce(state, (draft) => {
    draft.loading.detail = true;
  });
};

const getByIdSuccess = (state, scope) => {
  return produce(state, (draft) => {
    draft.loading.detail = false;
    draft.detail = scope.detail;
  });
};

const getByIdFail = (state, scope) => {
  return produce(state, (draft) => {
    draft.loading.detail = false;
    draft.detail = {};
  });
};

const deleteScope = (state, scope) => {
  return produce(state, (draft) => {
    draft.loading.scope = true;
  });
};

const deleteScopeSuccess = (state, scope) => {
  return produce(state, (draft) => {
    draft.loading.scope = false;
    if (draft.scopes?.rows?.length > 0) {
      draft.scopes.rows = [...draft.scopes.rows].filter(
        (t) => t.id !== scope.detail.id,
      );
    }
  });
};

const deleteScopeFail = (state, scope) => {
  return produce(state, (draft) => {
    draft.loading.scope = false;
  });
};

const reducer = (state = initialState, scope) => {
  switch (scope.type) {
    case actionTypes.CREATE_SCOPE:
      return upsert(state, scope);
    case actionTypes.CREATE_SCOPE_SUCCESS:
      return upsertSuccess(state, scope);
    case actionTypes.CREATE_SCOPE_FAILED:
      return upsertFail(state, scope);

    case actionTypes.UPDATE_SCOPE:
      return upsert(state, scope);
    case actionTypes.UPDATE_SCOPE_SUCCESS:
      return upsertSuccess(state, scope);
    case actionTypes.UPDATE_SCOPE_FAILED:
      return upsertFail(state, scope);

    case actionTypes.GET_SCOPE_LIST:
      return getList(state, scope);
    case actionTypes.GET_SCOPE_LIST_SUCCESS:
      return getListSuccess(state, scope);
    case actionTypes.GET_SCOPE_LIST_FAILED:
      return getListFail(state, scope);

    case actionTypes.GET_SCOPE_ACTION_LIST:
      return getActionList(state, scope);
    case actionTypes.GET_SCOPE_ACTION_LIST_SUCCESS:
      return getActionListSuccess(state, scope);
    case actionTypes.GET_SCOPE_ACTION_LIST_FAILED:
      return getActionListFail(state, scope);

    case actionTypes.GET_SCOPE_BY_ID:
      return getById(state, scope);
    case actionTypes.GET_SCOPE_BY_ID_SUCCESS:
      return getByIdSuccess(state, scope);
    case actionTypes.GET_SCOPE_BY_ID_FAILED:
      return getByIdFail(state, scope);

    case actionTypes.DELETE_SCOPE:
      return deleteScope(state, scope);
    case actionTypes.DELETE_SCOPE_SUCCESS:
      return deleteScopeSuccess(state, scope);
    case actionTypes.DELETE_SCOPE_FAILED:
      return deleteScopeFail(state, scope);

    default:
      return state;
  }
};

export default reducer;
