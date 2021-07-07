import React, { Component } from 'react'
import Box from '../Card'
import * as styles from './Modal.module.css'
import CSSTransition from 'react-transition-group/CSSTransition'

class Modal extends Component {

    render() {

        const animationTiming = {
            enter: 300,
            exit: 300
        };

        return (
            <React.Fragment>
                <CSSTransition
                    mountOnEnter
                    unmountOnExit
                    in={this.props.show}
                    timeout={animationTiming}
                    classNames={{
                        enter: '',
                        enterActive: styles.OpenBg,
                        exit: '',
                        exitActive: styles.CloseBg
                    }} >
                    <div className={styles.overlay} onClick={this.props.closed}></div>
                </CSSTransition>
                {/* <CSSTransition
                    mountOnEnter
                    unmountOnExit
                    in={this.props.show}
                    timeout={animationTiming}
                    classNames={{
                        enter: '',
                        enterActive: styles.OpenModal,
                        exit: '',
                        exitActive: styles.CloseModal
                    }} > */}
                    <div className={styles.container}>
                        <CSSTransition
                            mountOnEnter
                            unmountOnExit
                            in={this.props.show}
                            timeout={animationTiming}
                            classNames={{
                                enter: '',
                                enterActive: styles.OpenModal,
                                exit: '',
                                exitActive: styles.CloseModal
                            }} >
                            <Box className={[styles.box,this.props.boxstyle,'p-4'].join(' ')} >
                                <i className={['fa fa-times', 'text-gray-700', styles.close].join(' ')}
                                    onClick={this.props.closed}></i>
                                <div className={styles.content}>
                                    {this.props.children}
                                </div>
                            </Box>
                        </CSSTransition>
                    </div>
                {/* </CSSTransition> */}
            </React.Fragment>
        )
    }

}

export default Modal