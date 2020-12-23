import * as React from 'react';
import { connect } from 'react-redux';
import { Redirect, Route } from 'react-router';
import { ApplicationState } from './store';


const AuthRoute = props => {
    const { authToken } = props;
    if (!authToken)
        return <Redirect to='/sign-in' />;
    return <Route {...props} />;
};

export default connect(
    (state: ApplicationState) => state.globals
)(AuthRoute);