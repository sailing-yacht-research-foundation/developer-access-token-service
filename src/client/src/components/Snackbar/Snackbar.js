import React from 'react';
import { connect } from 'react-redux';
import CSSTransition from 'react-transition-group/CSSTransition';
import * as styles from './Snackbar.module.css';
// import * as utilsaction from '../../store/actions/utils';

const Snackbar = (props) => {
  const animationTiming = {
    enter: 500,
    exit: 200,
  };

  const iconclass = 'mr-4';

  let prefix = props.snackbar.opt.success ? (
    <i className={['fa fa-check', 'text-green-700', iconclass].join(' ')}></i>
  ) : null;
  prefix = props.snackbar.opt.failed ? (
    <i className={['fa fa-times', 'text-red-500', iconclass].join(' ')}></i>
  ) : (
    prefix
  );
  prefix = props.snackbar.opt.icon ? (
    <i className={[props.snackbar.opt.icon, iconclass].join(' ')}></i>
  ) : (
    prefix
  );
  const nodeRef = React.useRef(null);
  return (
    <CSSTransition
      nodeRef={nodeRef}
      mountOnEnter
      unmountOnExit
      in={props.snackbar.show}
      timeout={animationTiming}
      classNames={{
        enter: '',
        enterActive: styles.show,
        exit: '',
        exitActive: styles.close,
      }}
    >
      <div className={styles.snackbar}>
        {prefix}
        {props.snackbar.message}
      </div>
    </CSSTransition>
  );
};

const mapStateToProps = (state) => {
  return {
    snackbar: state.utils.snackbar,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    // hideSnackbar: () => dispatch(utilsaction.hideSnackbar()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Snackbar);
