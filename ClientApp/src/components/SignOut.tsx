import * as React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router';
import { Field, reduxForm, InjectedFormProps } from 'redux-form';
import { ApplicationState } from '../store';
import * as GlobalsStore from '../store/Globals';

type SignOutProps =
    GlobalsStore.GlobalState
    & typeof GlobalsStore.actionCreators
    & RouteComponentProps<{}>;

interface SignOutValues {
}

// COMPONENT

class SignIn extends React.PureComponent<SignOutProps & InjectedFormProps<SignOutValues, SignOutProps>> {
    public render() {
        const { handleSubmit } = this.props;
        return (
            <React.Fragment>
                <h1>Sign Out</h1>
                <hr />
                <div>
                    <form onSubmit={handleSubmit(this.onFormSubmit)}>
                        <div className='row'>
                            <div className='input-group mb-3 col-sm-4'>
                                <button type='submit' className='btn btn-outline-primary'>Sign Out</button>
                            </div>
                        </div>
                    </form>
                </div>
            </React.Fragment>
        );
    }

    private signOut() {
        this.props.signOut();
    }

    onFormSubmit = () => {
        this.signOut();
    };

}

export default reduxForm({
    form: 'sign-out-form'
})(connect(
    (state: ApplicationState) => state.globals,
    GlobalsStore.actionCreators
)(SignIn as any));