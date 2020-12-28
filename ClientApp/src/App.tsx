import * as React from 'react';
import { Route } from 'react-router';
import Layout from './components/Layout';
import Home from './components/Home';
import SignIn from './components/SignIn';
import SignOut from './components/SignOut';
import ConvertDocument from './components/ConvertDocument';
import AuthRoute from './AuthRoute';

import './custom.css'

export default () => (
    <Layout>
        <Route exact path='/' component={Home} />
        <AuthRoute path='/convert-document' component={ConvertDocument} />
        <AuthRoute path='/sign-in' component={SignIn} />
        <AuthRoute path='/sign-out' component={SignOut} />
    </Layout>
);
