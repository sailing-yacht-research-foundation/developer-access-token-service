import { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import copy from 'copy-to-clipboard';
import Layout from '../../hoc/layout';
import Card from '../../components/Card';
import Button from '../../components/Button';
import * as developerTokenActions from '../../store/actions/developerTokens';
import { useHistory, useParams } from 'react-router';
import TextBox from '../../components/TextBox';
import Scopes from './Scopes';

const Detail = ({
  loading,
  detail,
  getById,
  create,
  scopes,
  getScopes,
  addScope,
  removeScope,
}) => {
  const { id: urlId, developerId } = useParams();
  const [form, setForm] = useState({
    name: '',
  });

  const id = detail?.id;

  const isNew = !urlId === 'new' || (id ? false : true);
  const formTextHandler = (evt) => {
    setForm({
      ...form,
      [evt.target.name]: evt.target.value,
    });
  };

  useEffect(() => {
    Promise.all([getById(urlId), getScopes(urlId)])
      .then(([{ name }]) => {
        setForm({
          name,
        });
      })
      .catch((err) => console.log(err));
  }, [urlId]);

  const saveHandler = async () => {
    await create({ ...form, developerId, scopeIds: scopes.map((t) => t.id) });
  };

  const onTokenClicked = (evt) => {
    debugger;
    evt.target.select();
    copy(detail.token);
  };

  return (
    <Layout
      title={
        loading.detail
          ? 'loading...'
          : detail.name
          ? detail.name
          : 'New DeveloperToken'
      }
    >
      <Card className="flex flex-col p-8 gap-y-4 max-w-5xl mx-auto mb-6">
        <h2 className="font-semibold">Details</h2>
        <TextBox
          label="Name"
          name="name"
          value={form.name}
          changed={formTextHandler}
          disabled={!isNew}
        />
        {detail.token && urlId === 'new' ? (
          <div>
            <TextBox
              label="Token"
              readOnly
              value={detail.token}
              helptext="click to copy"
              clicked={onTokenClicked}
              groupclass="mb-1"
            />
            <div className="bg-yellow-400 text-white rounded-md text-sm p-2 px-4">
              <i className="fa fa-exclamation-triangle mr-2"></i>
              IMPORTANT : This token will only appear once, please keep it
              somewhere safe!
            </div>
          </div>
        ) : null}
      </Card>
      <div
        className={[
          isNew ? 'grid grid-cols-2 ' : null,
          'gap-x-4 max-w-5xl mx-auto',
        ].join(' ')}
      >
        <Card className="flex flex-col p-8 gap-y-4 ">
          <h2 className="font-semibold">Assigned Scopes</h2>
          <div className="flex flex-col flex-grow gap-y-2 h-96  overflow-auto bg-gray-100 rounded-md p-2">
            {(scopes || []).map((t) => {
              return (
                <Card key={t.id} className="p-2 pr-4 flex flex-row">
                  <div className="flex flex-col gap-x-2 flex-grow  text-sm">
                    {t.isNew ? (
                      <span className="text-xs text-indigo-500">new</span>
                    ) : t.deleted ? (
                      <span className="text-xs text-red-500">removed</span>
                    ) : null}
                    <h6>{t.name}</h6>
                    <div className="text-gray-500 italic text-xs">
                      {t.group}
                    </div>
                  </div>
                  {isNew ? (
                    <div>
                      {t.deleted ? (
                        <i
                          className="fa fa-undo-alt text-indigo-500 cursor-pointer"
                          onClick={() => removeScope(t)}
                        ></i>
                      ) : (
                        <i
                          className="fa fa-times text-red-600 cursor-pointer"
                          onClick={() => removeScope(t)}
                        ></i>
                      )}
                    </div>
                  ) : null}
                </Card>
              );
            })}
          </div>
        </Card>
        {isNew ? (
          <Card className="flex flex-col p-8 gap-y-4">
            <h2 className="font-semibold">Unassigned Scopes</h2>
            <Scopes
              id={id}
              addScope={addScope}
              scopes={(scopes || []).map((t) => t.id)}
            ></Scopes>
          </Card>
        ) : null}
      </div>
      <div className="mt-4 flex flex-col max-w-5xl mx-auto">
        {isNew ? <Button clicked={saveHandler}>Save</Button> : null}
      </div>
    </Layout>
  );
};

const mapStateToProps = (state) => {
  return {
    detail: state.developerTokens.detail,
    scopes: state.developerTokens.scopes,
    loading: state.developerTokens.loading,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getById: (id) => dispatch(developerTokenActions.getById({ id })),
    deleteDeveloperToken: (id) =>
      dispatch(developerTokenActions.deleteDeveloperToken({ id })),
    create: (data) => dispatch(developerTokenActions.create(data)),
    getScopes: (id) => dispatch(developerTokenActions.getScopes(id)),
    addScope: (scope) => dispatch(developerTokenActions.addScope(scope)),
    removeScope: (scope) => dispatch(developerTokenActions.removeScope(scope)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Detail);
