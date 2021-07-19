import produce from 'immer';
import * as actionTypes from '../actions/actionTypes';

const initialState = {
  loading: {
    developers: true,
    detail: true,
    developer: false,
  },
  developers: {},
  detail: {},
};

const upsert = (state, developer) => {
  return produce(state, (draft) => {
    draft.loading.developer = true;
  });
};

const upsertSuccess = (state, developer) => {
  return produce(state, (draft) => {
    draft.loading.developer = false;
    draft.detail = {};
  });
};

const upsertFail = (state, developer) => {
  return produce(state, (draft) => {
    draft.loading.developer = false;
  });
};

const getList = (state, developer) => {
  return produce(state, (draft) => {
    draft.loading.developers = true;
  });
};

const getListSuccess = (state, developer) => {
  return produce(state, (draft) => {
    draft.loading.developers = false;
    draft.developers = developer.developers;
  });
};

const getListFail = (state, developer) => {
  return produce(state, (draft) => {
    draft.loading.developers = false;
    draft.developers = {};
  });
};

const getById = (state, developer) => {
  return produce(state, (draft) => {
    draft.loading.detail = true;
  });
};

const getByIdSuccess = (state, developer) => {
  return produce(state, (draft) => {
    draft.loading.detail = false;
    draft.detail = developer.detail;
  });
};

const getByIdFail = (state, developer) => {
  return produce(state, (draft) => {
    draft.loading.detail = false;
    draft.detail = {};
  });
};

const deleteDeveloper = (state, developer) => {
  return produce(state, (draft) => {
    draft.loading.developer = true;
  });
};

const deleteDeveloperSuccess = (state, developer) => {
  return produce(state, (draft) => {
    draft.loading.developer = false;
    if (draft.developers?.rows?.length > 0) {
      draft.developers.rows = [...draft.developers.rows].filter(
        (t) => t.id !== developer.detail.id,
      );
    }
  });
};

const deleteDeveloperFail = (state, developer) => {
  return produce(state, (draft) => {
    draft.loading.developer = false;
  });
};

const reducer = (state = initialState, developer) => {
  switch (developer.type) {
    case actionTypes.CREATE_DEVELOPER:
      return upsert(state, developer);
    case actionTypes.CREATE_DEVELOPER_SUCCESS:
      return upsertSuccess(state, developer);
    case actionTypes.CREATE_DEVELOPER_FAILED:
      return upsertFail(state, developer);

    case actionTypes.UPDATE_DEVELOPER:
      return upsert(state, developer);
    case actionTypes.UPDATE_DEVELOPER_SUCCESS:
      return upsertSuccess(state, developer);
    case actionTypes.UPDATE_DEVELOPER_FAILED:
      return upsertFail(state, developer);

    case actionTypes.GET_DEVELOPER_LIST:
      return getList(state, developer);
    case actionTypes.GET_DEVELOPER_LIST_SUCCESS:
      return getListSuccess(state, developer);
    case actionTypes.GET_DEVELOPER_LIST_FAILED:
      return getListFail(state, developer);

    case actionTypes.GET_DEVELOPER_BY_ID:
      return getById(state, developer);
    case actionTypes.GET_DEVELOPER_BY_ID_SUCCESS:
      return getByIdSuccess(state, developer);
    case actionTypes.GET_DEVELOPER_BY_ID_FAILED:
      return getByIdFail(state, developer);

    case actionTypes.DELETE_DEVELOPER:
      return deleteDeveloper(state, developer);
    case actionTypes.DELETE_DEVELOPER_SUCCESS:
      return deleteDeveloperSuccess(state, developer);
    case actionTypes.DELETE_DEVELOPER_FAILED:
      return deleteDeveloperFail(state, developer);

    default:
      return state;
  }
};

export default reducer;
