import Layout from '../../hoc/layout';
import { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import Card from '../../components/Card';
import Button from '../../components/Button';
import * as developerActions from '../../store/actions/developer';
import { useHistory, useParams } from 'react-router';
import TextBox from '../../components/TextBox';

const Detail = ({ loading, detail, getById, update, create }) => {
  const { id } = useParams();
  const history = useHistory();
  const [form, setForm] = useState({
    name: '',
    email: '',
  });

  const formTextHandler = (evt) => {
    setForm({
      ...form,
      [evt.target.name]: evt.target.value,
    });
  };

  useEffect(() => {
    getById(id)
      .then(({ name, email }) => {
        setForm({
          name,
          email,
        });
      })
      .catch((err) => console.log(err));
  }, [id]);

  const isNew = id === 'new' || (id ? false : true);

  const saveHandler = async () => {
    if (isNew) {
      await create(form);
    } else {
      await update(id, form);
    }
    history.push('/');
  };

  return (
    <Layout
      title={
        loading.detail
          ? 'loading...'
          : detail.name
          ? detail.name
          : 'New Developer'
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
          label="Email"
          name="email"
          value={form.email}
          changed={formTextHandler}
          type="email"
        />
        <Button clicked={saveHandler}>Save</Button>
      </Card>
    </Layout>
  );
};

const mapStateToProps = (state) => {
  return {
    detail: state.developers.detail,
    actions: state.developers.actions,
    loading: state.developers.loading,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getById: (id) => dispatch(developerActions.getById({ id })),
    deleteDeveloper: (id) => dispatch(developerActions.deleteDeveloper({ id })),
    update: (id, data) => dispatch(developerActions.update(id, data)),
    create: (data) => dispatch(developerActions.create(data)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Detail);
