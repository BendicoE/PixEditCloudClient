import * as React from 'react';
import { Route } from 'react-router';
import Layout from './components/Layout';
import Home from './components/Home';
import SignIn from './components/SignIn';
import SignOut from './components/SignOut';
import ProcessDocument from './components/ProcessDocument';
import AuthRoute from './AuthRoute';

import './custom.css'

export default () => (
    <Layout>
        <Route exact path='/' component={Home} />
        <AuthRoute path='/process-document' component={ProcessDocument} />
        <AuthRoute path='/sign-in' component={SignIn} />
        <AuthRoute path='/sign-out' component={SignOut} />
    </Layout>
);
