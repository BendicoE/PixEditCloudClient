import * as React from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
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

const required = (value: any) => (value ? undefined : '*Required');

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
                            <Field
                                name='username'
                                component={this.renderField}
                                type='text'
                                colClass='input-group mb-3 col-sm-4'
                                label='Username'
                                validate={required}
                            />
                            <Field
                                name='password'
                                component={this.renderField}
                                type='password'
                                colClass='input-group mb-3 col-sm-4'
                                label='Password'
                                validate={required}
                            />
                            <Field
                                name='serialNo'
                                component={this.renderField}
                                type='text'
                                colClass='input-group mb-3 col-sm-4'
                                label='Serial Number'
                                validate={required}
                            />
                        </div>
                        <div className='row'>
                            <div className='input-group mb-3 col-sm-4'>
                                <button type='submit' className='btn btn-outline-primary'>Sign In</button>
                            </div>
                        </div>
                    </form>
                </div>
                <div>
                    <p>{this.props.signInError && this.props.signInError.response &&
                            (this.props.signInError.response.status == 401 ?
                                <span className='text-danger'>Invalid user name, password and serial number combination :-(</span> :
                                <span className='text-danger'>Sign in failed: { this.props.signInError.response.message }</span>)
                    }</p>
                </div>
            </React.Fragment>
         );
    }

    renderField = ({ input, label, type, colClass, meta: { touched, error, warning } }:
        { input: any, label: string, type: string, colClass: string, meta: { touched: boolean, error: string, warning: string } }) => (
            <div className={colClass}>
                <div className='w-100'>
                    <input {...input} placeholder={label} type={type} className='form-control' />
                </div>
                <div>
                    {touched &&
                        ((error && <span className='text-danger'>{error}</span>) ||
                            (warning && <span className='text-warning'>{warning}</span>))}
                </div>
            </div>
        );

    private signIn(username: string, password: string, serialNo: string) {
       this.props.signIn(username, password, serialNo);
    }

    onFormSubmit = (formValues: SignInValues) => {
        this.signIn(formValues.username, formValues.password, formValues.serialNo);
    };

}

export default compose(
    connect(
        (state: ApplicationState) => state.globals,
        GlobalsStore.actionCreators),
    reduxForm<GlobalsStore.Credentials>({
        form: 'sign-in-form'
    })
)(SignIn as any);
