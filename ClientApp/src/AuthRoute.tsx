import * as React from 'react';
import { FunctionComponent } from "react";
import { connect } from 'react-redux';
import { Redirect, Route, RouteProps } from 'react-router';
import { useLocation } from 'react-router-dom';
import { ApplicationState } from './store';

const AuthRoute = (props: any) => {
    const { authToken } = props;
    const curPath = useLocation().pathname;
    if (authToken && curPath == '/sign-in')
        return <Redirect to='/convert-document' />;
    else if (!authToken && curPath == '/convert-document')
        return <Redirect to='/sign-in' />;
    else if (!authToken && curPath == '/sign-out')
        return <Redirect to='/' />
    return <Route {...props} />;
};

export default connect(
    (state: ApplicationState) => state.globals
)(AuthRoute);