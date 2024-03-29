import {
  Switch,
  Route,
  Redirect,
  matchPath,
  useLocation,
  useHistory,
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
const DeveloperDetail = asyncComponent(() => {
  return import('./pages/Home/Detail');
});

const DeveloperToken = asyncComponent(() => {
  return import('./pages/DeveloperToken');
});

const DeveloperTokenDetail = asyncComponent(() => {
  return import('./pages/DeveloperToken/Detail');
});

const Actions = asyncComponent(() => {
  return import('./pages/Actions');
});

const ActionDetail = asyncComponent(() => {
  return import('./pages/Actions/Detail');
});

const Scopes = asyncComponent(() => {
  return import('./pages/Scopes');
});

const ScopeDetail = asyncComponent(() => {
  return import('./pages/Scopes/Detail');
});

const App = ({ validateToken: validateTokenProps, user, loading }) => {
  const { pathname } = useLocation();
  const validateToken = validateTokenProps;

  const token = storageGetItem(config.AUTH_STORAGE_KEY);
  const history = useHistory();
  useEffect(() => {
    if (isNullOrEmpty(user)) {
      validateToken().catch(() => {
        history.push('/login');
      });
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
        <Route path="/scopes/:id" exact component={ScopeDetail} />
        <Route path="/scopes" exact component={Scopes} />
        <Route path="/actions/:id" exact component={ActionDetail} />
        <Route path="/actions" exact component={Actions} />
        <Route path="/login" component={Login} />
        <Route
          path="/developers/:developerId/tokens/:id"
          exact
          component={DeveloperTokenDetail}
        />
        <Route
          path="/developers/:developerId/tokens"
          exact
          component={DeveloperToken}
        />
        <Route path="/developers/:id" exact component={DeveloperDetail} />
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
