import Layout from '../../hoc/layout';
import { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import Card from '../../components/Card';
import Button from '../../components/Button';
import * as scopeActions from '../../store/actions/scopes';
import { useHistory, useParams } from 'react-router';
import TextBox from '../../components/TextBox';
import AssignedActionsTable from './assignedActionsTable';

const Detail = ({ loading, detail, getById, update, create, getActions }) => {
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
    getById(id)
      .then(({ name, description }) => {
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

      <div className="flex flex-col p-8 gap-y-4 max-w-5xl mx-auto">
        <h2 className="font-semibold">Actions</h2>
        <div>
          <AssignedActionsTable
            getActions={(paging) => getActions(id, paging)}
            actions={(detail || {}).actions || {}}
          ></AssignedActionsTable>
        </div>
      </div>
    </Layout>
  );
};

const mapStateToProps = (state) => {
  return {
    detail: state.scopes.detail,
    loading: state.scopes.loading,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getById: (id) => dispatch(scopeActions.getById({ id })),
    deleteScope: (id) => dispatch(scopeActions.deleteScope({ id })),
    update: (id, data) => dispatch(scopeActions.update(id, data)),
    create: (data) => dispatch(scopeActions.create(data)),
    getActions: (id, paging) => dispatch(scopeActions.getActions(id, paging)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Detail);
