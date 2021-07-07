import Layout from '../../hoc/layout';

import { useState } from 'react';
import { connect } from 'react-redux';

const Home = ({ userData = {} }) => {
  return (
    <Layout title="Developer Access Token Admin">
      <h1>Hello {userData.name}</h1>
    </Layout>
  );
};

const mapStateToProps = (state) => {
  return {
    userData: state.auth.user,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);
