import { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import * as developerTokensScopes from '../../store/actions/developerTokens';
import SearchBox from '../../components/SearchBox';
import Card from '../../components/Card';

const UnassignedScopes = ({
  getUnassignedScopes,
  unassignedScopes,
  loading,
  id,
  addScope,
  scopes,
}) => {
  const [paging, setPaging] = useState({
    page: 1,
    q: '',
  });

  useEffect(() => {
    getUnassignedScopes({
      page: 1,
      size: 10,
      sort: 'group',
      srdir: 1,
      q: '',
    });
  }, []);

  useEffect(() => {
    getUnassignedScopes({
      page: paging.page,
      size: 10,
      sort: 'group',
      srdir: 1,
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
          ((unassignedScopes || {}).rows || []).map((t) => {
            const added =
              scopes.findIndex((existing) => t.id === existing) >= 0;
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
                  <div className="text-gray-500 italic text-xs">{t.group}</div>
                </div>
                <div>
                  {added ? null : (
                    <i
                      className="fa fa-plus text-indigo-700 cursor-pointer"
                      onClick={() => addScope(t)}
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
          {paging.page}/{unassignedScopes.pageCount}
        </span>
        <i
          className={[
            'fa fa-chevron-right mr-auto cursor-pointer',
            paging.page < unassignedScopes.pageCount ? '' : 'invisible',
          ].join(' ')}
          onClick={nextPage}
        ></i>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    unassignedScopes: state.developerTokens.unassignedScopes,
    loading: state.developerTokens.loading.unassignedScopes,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getUnassignedScopes: (paging) =>
      dispatch(developerTokensScopes.getUnassignedScopes(paging)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(UnassignedScopes);
