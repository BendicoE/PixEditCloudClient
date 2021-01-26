import * as React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router';
import { ApplicationState } from '../store';
import * as ApiInfoStore from '../store/ApiInfo';
import { appVersion } from '../store/Globals';

type ApiInfoProps =
    ApiInfoStore.ApiInfoState
    & typeof ApiInfoStore.actionCreators
    & RouteComponentProps<{}>;

// COMPONENT

class Home extends React.PureComponent<ApiInfoProps> {
    public componentDidMount() {
        this.ensureDataFetched();
    }

    public componentDidUpdate() {
        this.ensureDataFetched();
    }

    public render() {
        return (
            <React.Fragment>
                <h1>PixEdit Server Cloud API</h1>
                <p>Name: {this.props.apiInfo ? this.props.apiInfo.name : null}</p>
                <p>Core Version: {this.props.apiInfo ? this.props.apiInfo.version : null}</p>
                <p>Published: {this.props.apiInfo ? this.props.apiInfo.publishedDate : null}</p>
                <p className='text-warning'>{this.props.apiInfo && this.props.apiInfo.unavailable ? 'Info unavailable at the moment:-(' : ''}</p>
                <p>
                    For developers: our APIs are hosted on Azure and documented in a developer portal <a href='https://pixeditservercloud.developer.azure-api.net/'>here</a>.
                    Our APIs can also be self-hosted by you, either in the cloud or on-prem. Please <a href='https://www.pixedit.com/en/contact/'>contact us</a> for more information.
                </p>
                <p>Demo App Version: {appVersion}</p>
            </React.Fragment>
        );
    }

    private ensureDataFetched() {
        if (this.props.apiInfo.name == '') {
            this.props.requestApiInfo();
        }
    }
}

export default connect(
    (state: ApplicationState) => state.apiInfo,
    ApiInfoStore.actionCreators
)(Home as any);
