import * as React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router';
import { Field, reduxForm, InjectedFormProps } from 'redux-form';
import { ApplicationState } from '../store';
import * as GlobalsStore from '../store/Globals';

type SignInProps =
    GlobalsStore.GlobalState
    & typeof GlobalsStore.actionCreators
    & RouteComponentProps<{}>;

interface SignInValues {
    username: string;
    password: string;
    serialNo: string;
}

// COMPONENT

class SignIn extends React.PureComponent<SignInProps & InjectedFormProps<SignInValues, SignInProps>> {
    public render() {
        const { handleSubmit } = this.props;
        return (
            <React.Fragment>
                <h1>Sign In</h1>
                <hr />
                <div>
                    <form onSubmit={handleSubmit(this.onFormSubmit)} autoComplete='on'>
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
                        </div>
                        <div className='row'>
                            <div className='input-group mb-3 col-sm-4'>
                                <button type='submit' className='btn btn-outline-primary'>Sign In</button>
                            </div>
                        </div>
                    </form>
                    <div className='row'>
                        <p className='alert'></p>
                    </div>
                </div>
            </React.Fragment>
         );
     }

    private signIn(username: string, password: string, serialNo: string) {
       this.props.signIn(username, password, serialNo);
    }

    onFormSubmit = (formValues: SignInValues) => {
        this.signIn(formValues.username, formValues.password, formValues.serialNo);
    };

}

export default reduxForm<GlobalsStore.Credentials>({
    form: 'sign-in-form'
})(connect(
    (state: ApplicationState) => state.globals,
    GlobalsStore.actionCreators
)(SignIn as any));