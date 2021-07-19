import Layout from '../../hoc/layout';
import { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import Card from '../../components/Card';
import Button from '../../components/Button';
import * as developerTokenActions from '../../store/actions/developerTokens';
import { useHistory, useParams } from 'react-router';
import TextBox from '../../components/TextBox';

const Detail = ({ loading, detail, getById, create }) => {
  const { id, developerId } = useParams();
  const history = useHistory();
  const [form, setForm] = useState({
    name: '',
  });

  const formTextHandler = (evt) => {
    setForm({
      ...form,
      [evt.target.name]: evt.target.value,
    });
  };

  useEffect(() => {
    getById(id)
      .then(({ name }) => {
        setForm({
          name,
        });
      })
      .catch((err) => console.log(err));
  }, [id]);

  const isNew = id === 'new' || (id ? false : true);

  const saveHandler = async () => {
    await create({ ...form, developerId });
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
        {isNew ? <Button clicked={saveHandler}>Save</Button> : null}
      </Card>
    </Layout>
  );
};

const mapStateToProps = (state) => {
  return {
    detail: state.developerTokens.detail,
    actions: state.developerTokens.actions,
    loading: state.developerTokens.loading,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getById: (id) => dispatch(developerTokenActions.getById({ id })),
    deleteDeveloperToken: (id) =>
      dispatch(developerTokenActions.deleteDeveloperToken({ id })),
    create: (data) => dispatch(developerTokenActions.create(data)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Detail);
