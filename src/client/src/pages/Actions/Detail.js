import Layout from '../../hoc/layout';
import { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import Card from '../../components/Card';
import Button from '../../components/Button';
import * as actionsActions from '../../store/actions/actions';
import { useHistory, useParams } from 'react-router';
import TextBox from '../../components/TextBox';

const Detail = ({ loading, detail, getById, update, create }) => {
  const { id } = useParams();

  const [form, setForm] = useState({
    name: '',
    service: '',
  });

  const formTextHandler = (evt) => {
    setForm({
      ...form,
      [evt.target.name]: evt.target.value,
    });
  };

  useEffect(() => {
    getById(id)
      .then(({ name, service }) => {
        setForm({
          name,
          service,
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
    history.push('/actions');
  };

  return (
    <Layout
      title={
        loading.detail ? 'loading...' : detail.name ? detail.name : 'New Action'
      }
    >
      <Card className="flex flex-col p-8 gap-y-4 max-w-5xl mx-auto">
        <TextBox
          label="Name"
          name="name"
          value={form.name}
          changed={formTextHandler}
        />
        <TextBox
          label="Service"
          name="service"
          value={form.service}
          changed={formTextHandler}
        />
        <Button clicked={saveHandler}>Save</Button>
      </Card>
    </Layout>
  );
};

const mapStateToProps = (state) => {
  return {
    detail: state.actions.detail,
    loading: state.actions.loading,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getById: (id) => dispatch(actionsActions.getById({ id })),
    deleteAction: (id) => dispatch(actionsActions.deleteAction({ id })),
    update: (id, data) => dispatch(actionsActions.update(id, data)),
    create: (data) => dispatch(actionsActions.create(data)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Detail);
