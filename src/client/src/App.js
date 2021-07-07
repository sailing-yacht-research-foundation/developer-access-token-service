import {
  Switch,
  Route,
  Redirect,
  matchPath,
  useLocation,
} from 'react-router-dom';
import { connect } from 'react-redux';
import { useEffect } from 'react';
import * as authactions from './store/actions/auth';
import { isNullOrEmpty, storageGetItem } from './utils/utilities';
import config from './config';

import Login from './pages/Login';
import asyncComponent from './hoc/asyncComponent';

const Home = asyncComponent(() => {
  return import('./pages/Home');
});

const App = ({ validateToken: validateTokenProps, user, loading }) => {
  const { pathname } = useLocation();
  const validateToken = validateTokenProps;

  const token = storageGetItem(config.AUTH_STORAGE_KEY);

  useEffect(() => {
    if (isNullOrEmpty(user)) {
      validateToken();
    }
  }, [token]);

  const currUrl = pathname;
  const isLogin = matchPath(currUrl, {
    path: '/login',
  });

  if (loading) {
    return <div>Loading...</div>;
  } else if ((token && typeof token !== 'undefined') || isLogin) {
    return (
      <Switch>
        <Route path="/login" component={Login} />
        <Route path="/" exact component={Home} />
      </Switch>
    );
  } else {
    return <Redirect to={'/login'} />;
  }
};

const mapStateToProps = (state) => {
  return {
    user: state.auth.user,
    loading: state.auth.loading,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    validateToken: () => dispatch(authactions.validateToken()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
