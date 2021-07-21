import produce from 'immer';
import * as actionTypes from '../actions/actionTypes';

const initialState = {
  loading: {
    developerTokens: true,
    detail: true,
    developerToken: false,
  },
  developerTokens: {},
  detail: {},
  scopes: [],
  unassignedScopes: {},
};

const upsert = (state, developerToken) => {
  return produce(state, (draft) => {
    draft.loading.developerToken = true;
  });
};

const upsertSuccess = (state, developerToken) => {
  return produce(state, (draft) => {
    draft.loading.developerToken = false;
    draft.detail = developerToken.detail;
  });
};

const upsertFail = (state, developerToken) => {
  return produce(state, (draft) => {
    draft.loading.developerToken = false;
  });
};

const getList = (state, developerToken) => {
  return produce(state, (draft) => {
    draft.loading.developerTokens = true;
  });
};

const getListSuccess = (state, developerToken) => {
  return produce(state, (draft) => {
    draft.loading.developerTokens = false;
    draft.developerTokens = developerToken.developerTokens;
  });
};

const getListFail = (state, developerToken) => {
  return produce(state, (draft) => {
    draft.loading.developerTokens = false;
    draft.developerTokens = {};
  });
};

const getById = (state, developerToken) => {
  return produce(state, (draft) => {
    draft.loading.detail = true;
  });
};

const getByIdSuccess = (state, developerToken) => {
  return produce(state, (draft) => {
    draft.loading.detail = false;
    draft.detail = developerToken.detail;
  });
};

const getByIdFail = (state, developerToken) => {
  return produce(state, (draft) => {
    draft.loading.detail = false;
    draft.detail = {};
  });
};

const deleteDeveloperToken = (state, developerToken) => {
  return produce(state, (draft) => {
    draft.loading.developerToken = true;
  });
};

const deleteDeveloperTokenSuccess = (state, developerToken) => {
  return produce(state, (draft) => {
    draft.loading.developerToken = false;
    if (draft.developerTokens?.rows?.length > 0) {
      draft.developerTokens.rows = [...draft.developerTokens.rows].filter(
        (t) => t.id !== developerToken.detail.id,
      );
    }
  });
};

const deleteDeveloperTokenFail = (state, developerToken) => {
  return produce(state, (draft) => {
    draft.loading.developerToken = false;
  });
};

const getUnassignedScopesList = (state, scope) => {
  return produce(state, (draft) => {
    draft.loading.unassignedScopes = true;
  });
};

const getUnassignedScopesListSuccess = (state, scope) => {
  return produce(state, (draft) => {
    draft.loading.unassignedScopes = false;
    draft.unassignedScopes = scope.unassignedScopes;
  });
};

const getUnassignedScopesListFail = (state, scope) => {
  return produce(state, (draft) => {
    draft.loading.unassignedScopes = false;
    draft.unassignedScopes = {};
  });
};

const removeScope = (state, action) => {
  return produce(state, (draft) => {
    if (action.scope.isNew) {
      draft.scopes = draft.scopes.filter((t) => t.id !== action.scope.id);
    } else {
      const index = draft.scopes.findIndex((t) => t.id === action.scope.id);
      draft.scopes[index].deleted = !draft.scopes[index].deleted;
    }
  });
};

const addScope = (state, action) => {
  return produce(state, (draft) => {
    draft.scopes.push({ ...action.scope, isNew: true });
  });
};

const getScopeList = (state, scope) => {
  return produce(state, (draft) => {
    draft.loading.scopes = true;
  });
};

const getScopeListSuccess = (state, scope) => {
  return produce(state, (draft) => {
    draft.loading.scopes = false;
    draft.scopes = scope.scopes;

    draft.scopes.sort((a, b) => (a.service > b.service ? 1 : -1));
  });
};

const getScopeListFail = (state, scope) => {
  return produce(state, (draft) => {
    draft.loading.scopes = false;
    draft.scopes = [];
  });
};

const reducer = (state = initialState, developerToken) => {
  switch (developerToken.type) {
    case actionTypes.CREATE_DEVELOPER_TOKEN:
      return upsert(state, developerToken);
    case actionTypes.CREATE_DEVELOPER_TOKEN_SUCCESS:
      return upsertSuccess(state, developerToken);
    case actionTypes.CREATE_DEVELOPER_TOKEN_FAILED:
      return upsertFail(state, developerToken);

    case actionTypes.UPDATE_DEVELOPER_TOKEN:
      return upsert(state, developerToken);
    case actionTypes.UPDATE_DEVELOPER_TOKEN_SUCCESS:
      return upsertSuccess(state, developerToken);
    case actionTypes.UPDATE_DEVELOPER_TOKEN_FAILED:
      return upsertFail(state, developerToken);

    case actionTypes.GET_DEVELOPER_TOKEN_LIST:
      return getList(state, developerToken);
    case actionTypes.GET_DEVELOPER_TOKEN_LIST_SUCCESS:
      return getListSuccess(state, developerToken);
    case actionTypes.GET_DEVELOPER_TOKEN_LIST_FAILED:
      return getListFail(state, developerToken);

    case actionTypes.GET_DEVELOPER_TOKEN_BY_ID:
      return getById(state, developerToken);
    case actionTypes.GET_DEVELOPER_TOKEN_BY_ID_SUCCESS:
      return getByIdSuccess(state, developerToken);
    case actionTypes.GET_DEVELOPER_TOKEN_BY_ID_FAILED:
      return getByIdFail(state, developerToken);

    case actionTypes.DELETE_DEVELOPER_TOKEN:
      return deleteDeveloperToken(state, developerToken);
    case actionTypes.DELETE_DEVELOPER_TOKEN_SUCCESS:
      return deleteDeveloperTokenSuccess(state, developerToken);
    case actionTypes.DELETE_DEVELOPER_TOKEN_FAILED:
      return deleteDeveloperTokenFail(state, developerToken);

    case actionTypes.ADD_SCOPES_TO_DEVELOPER_TOKEN:
      return addScope(state, developerToken);
    case actionTypes.REMOVE_SCOPES_FROM_DEVELOPER_TOKEN:
      return removeScope(state, developerToken);

    case actionTypes.GET_DEVELOPER_TOKEN_SCOPES_LIST:
      return getScopeList(state, developerToken);
    case actionTypes.GET_DEVELOPER_TOKEN_SCOPES_LIST_SUCCESS:
      return getScopeListSuccess(state, developerToken);
    case actionTypes.GET_DEVELOPER_TOKEN_SCOPES_LIST_FAILED:
      return getScopeListFail(state, developerToken);

    case actionTypes.GET_DEVELOPER_TOKEN_UNASSIGNED_SCOPES_LIST:
      return getUnassignedScopesList(state, developerToken);
    case actionTypes.GET_DEVELOPER_TOKEN_UNASSIGNED_SCOPES_LIST_SUCCESS:
      return getUnassignedScopesListSuccess(state, developerToken);
    case actionTypes.GET_DEVELOPER_TOKEN_UNASSIGNED_SCOPES_LIST_FAILED:
      return getUnassignedScopesListFail(state, developerToken);
    default:
      return state;
  }
};

export default reducer;
