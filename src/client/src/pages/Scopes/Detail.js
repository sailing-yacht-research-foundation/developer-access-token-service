import Layout from '../../hoc/layout';
import { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import Card from '../../components/Card';
import Button from '../../components/Button';
import * as scopeActions from '../../store/actions/scopes';
import { useHistory, useParams } from 'react-router';
import TextBox from '../../components/TextBox';
import UnassignedActionsTable from './unassignedActionsTable';

const Detail = ({
  loading,
  detail,
  getById,
  update,
  create,
  getActions,
  actions,
}) => {
  const { id } = useParams();

  const [form, setForm] = useState({
    name: '',
    description: '',
  });

  const formTextHandler = (evt) => {
    setForm({
      ...form,
      [evt.target.name]: evt.target.value,
    });
  };

  useEffect(() => {
    Promise.all([getById(id), getActions(id)])
      .then(([{ name, description }]) => {
        setForm({
          name,
          description,
        });
      })
      .catch((err) => console.log(err));
  }, [id]);

  const isNew = id === 'new' || (id ? false : true);

  const history = useHistory();

  const saveHandler = async () => {
    if (isNew) {
      await create(form);
    } else {
      await update(id, form);
    }
    history.push('/scopes');
  };

  return (
    <Layout
      title={
        loading.detail ? 'loading...' : detail.name ? detail.name : 'New Scope'
      }
    >
      <Card className="flex flex-col p-8 gap-y-4 max-w-5xl mx-auto mb-6">
        <h2 className="font-semibold">Details</h2>
        <TextBox
          label="Name"
          name="name"
          value={form.name}
          changed={formTextHandler}
        />
        <TextBox
          label="Description"
          name="description"
          value={form.description}
          changed={formTextHandler}
          textarea={true}
          rows={3}
        />
        <Button clicked={saveHandler}>Save</Button>
      </Card>
      <div className="grid grid-cols-2 gap-x-4 max-w-5xl mx-auto">
        <Card className="flex flex-col p-8 gap-y-4 ">
          <h2 className="font-semibold">Assigned Actions</h2>
          <div className="flex flex-col flex-grow gap-y-2 h-96  overflow-auto bg-gray-100 rounded-md p-2">
            {(actions || []).map((t) => {
              return (
                <Card key={t.id} className="p-2 pr-4 flex flex-row">
                  <div className="flex flex-col gap-x-2 flex-grow  text-sm">
                    <h6>{t.name}</h6>
                    <div className="text-gray-500 italic text-xs">
                      <i className="fa fa-server text-gray-400"></i> :{' '}
                      {t.service}
                    </div>
                  </div>
                  <div>
                    <i className="fa fa-times text-red-600 cursor-pointer"></i>
                  </div>
                </Card>
              );
            })}
          </div>
          <Button clicked={saveHandler}>Save</Button>
        </Card>
        <Card className="flex flex-col p-8 gap-y-4">
          <h2 className="font-semibold">Unassigned Actions</h2>
          <UnassignedActionsTable
            id={id}
            addAction={() => {}}
          ></UnassignedActionsTable>
        </Card>
      </div>
    </Layout>
  );
};

const mapStateToProps = (state) => {
  return {
    detail: state.scopes.detail,
    actions: state.scopes.actions,
    loading: state.scopes.loading,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getById: (id) => dispatch(scopeActions.getById({ id })),
    deleteScope: (id) => dispatch(scopeActions.deleteScope({ id })),
    update: (id, data) => dispatch(scopeActions.update(id, data)),
    create: (data) => dispatch(scopeActions.create(data)),
    getActions: (id) => dispatch(scopeActions.getActions(id)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Detail);
