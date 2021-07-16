import { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import * as scopeActions from '../../store/actions/scopes';
import SearchBox from '../../components/SearchBox';
import Card from '../../components/Card';

const UnassignedActions = ({
  getUnassignedActions,
  unassignedActions,
  loading,
  id,
  addAction,
  actions,
}) => {
  const [paging, setPaging] = useState({
    page: 1,
    q: '',
  });

  useEffect(() => {
    getUnassignedActions(id, {
      page: 1,
      size: 5,
      q: '',
    });
  }, []);

  useEffect(() => {
    getUnassignedActions(id, {
      page: paging.page,
      size: 5,
      q: paging.q,
    });
  }, [id, paging.page, paging.q]);

  const search = ({ value }) => {
    setPaging({
      page: 1,
      q: value || '',
    });
  };

  const prevPage = () => {
    setPaging({
      ...paging,
      page: paging.page - 1,
    });
  };

  const nextPage = () => {
    setPaging({
      ...paging,
      page: paging.page + 1,
    });
  };

  return (
    <div className="flex flex-col">
      <SearchBox changed={search} placeholder="Search"></SearchBox>
      <div className="flex flex-col gap-y-2 h-96 mt-4 overflow-auto bg-gray-100 rounded-md p-2">
        {loading ? (
          <span className="text-xs">Loading...</span>
        ) : (
          ((unassignedActions || {}).rows || []).map((t) => {
            const added =
              actions.findIndex((existing) => t.id === existing) >= 0;
            return (
              <Card
                key={t.id}
                className={[
                  'p-2 pr-4 flex flex-row',
                  added ? 'bg-gray-200' : '',
                ].join(' ')}
              >
                <div className="flex flex-col gap-x-2 flex-grow text-sm">
                  {added ? (
                    <span className="text-xs text-indigo-500">added</span>
                  ) : null}
                  <h6>{t.name}</h6>
                  <div className="text-gray-500 italic text-xs">
                    <i className="fa fa-server text-gray-400"></i> : {t.service}
                  </div>
                </div>
                <div>
                  {added ? null : (
                    <i
                      className="fa fa-plus text-indigo-700 cursor-pointer"
                      onClick={() => addAction(t)}
                    ></i>
                  )}
                </div>
              </Card>
            );
          })
        )}
      </div>
      <div className="flex flex-row gap-x-8 mt-4 text-indigo-700">
        <i
          className={[
            'fa fa-chevron-left ml-auto cursor-pointer',
            paging.page > 1 ? '' : 'invisible',
          ].join(' ')}
          onClick={prevPage}
        ></i>
        <span className="text-xs">
          {paging.page}/{unassignedActions.pageCount}
        </span>
        <i
          className={[
            'fa fa-chevron-right mr-auto cursor-pointer',
            paging.page < unassignedActions.pageCount ? '' : 'invisible',
          ].join(' ')}
          onClick={nextPage}
        ></i>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    unassignedActions: state.scopes.unassignedActions,
    loading: state.scopes.loading.unassignedActions,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getUnassignedActions: (id, paging) =>
      dispatch(scopeActions.getUnassignedActions(id, paging)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(UnassignedActions);
