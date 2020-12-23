import * as React from 'react';
import { Route } from 'react-router';
import Layout from './components/Layout';
import Home from './components/Home';
import SignIn from './components/SignIn';
import ConvertDocument from './components/ConvertDocument';
import AuthRoute from './AuthRoute';
import { GlobalState } from './store/Globals';

import './custom.css'

export default () => (
    <Layout>
        <Route exact path='/' component={Home} />
        <Route path='/sign-in' component={SignIn} />
        <AuthRoute path='/convert-document' component={ConvertDocument} />
    </Layout>
);
