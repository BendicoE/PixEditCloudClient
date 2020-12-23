import * as React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router';
import { Field, reduxForm } from 'redux-form';
import { ApplicationState } from '../store';
import * as GlobalsStore from '../store/Globals';

type SignInProps =
    GlobalsStore.GlobalState
    & typeof GlobalsStore.actionCreators
    & RouteComponentProps<{}>;

// COMPONENT

class SignIn extends React.PureComponent<SignInProps> {
     public render() {
        const { handleSubmit } = this.props;
        return (
            <React.Fragment>
                <h1>{!this.props.authToken ? 'Sign In' : 'Sign Out'}</h1>
                <hr />
                <div>
                    <form onSubmit={handleSubmit(this.onFormSubmit)}>
                        { !this.props.authToken ?
                            <div className='row'>
                                <div className='input-group mb-3 col-sm-4'>
                                    <Field
                                        name='username'
                                        component='input'
                                        type='text'
                                        className='form-control'
                                        placeholder='Username'
                                    />
                                </div>
                                <div className='input-group mb-3 col-sm-4'>
                                    <Field
                                        name='password'
                                        component='input'
                                        type='password'
                                        className='form-control'
                                        placeholder='Password'
                                    />
                                </div>
                                <div className='input-group mb-3 col-sm-4'>
                                    <Field
                                        name='serialNo'
                                        component='input'
                                        type='text'
                                        className='form-control'
                                        placeholder='Serial Number'
                                    />
                                </div>
                            </div> : <div></div>
                        }
                        <div className='row'>
                            <div className='input-group mb-3 col-sm-4'>
                                <button type='submit' className='btn btn-outline-primary'>{!this.props.authToken ? 'Sign In' : 'Sign Out'}</button>
                            </div>
                        </div>
                    </form>
                </div>
            </React.Fragment>
        );
    }

    private signIn(username, password, serialNo) {
        this.props.signIn(username, password, serialNo);
    }

    private signOut() {
        this.props.signOut();
    }

    onFormSubmit = (formValues) => {
        if (this.props.authToken) {
            this.signOut();
        } else {
            this.signIn(formValues.username, formValues.password, formValues.serialNo);
        }
    };

}

export default reduxForm<GlobalsStore.Credentials>({
    form: 'sign-in-form'
})(connect(
    (state: ApplicationState) => state.globals,
    GlobalsStore.actionCreators
)(SignIn as any));