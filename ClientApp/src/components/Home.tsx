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
                <h1>PixEdit Server Cloud API Demo</h1>
                <p>This is a demo application for the PixEdit Server Cloud API. To use it, you will need a license for the API.<br />
                    If you have a license, please <a href='/sign-in'>sign in</a> to explore the application.<br />
                    To acquire a license, please <a href='https://www.pixedit.com/en/contact/'>contact us!</a>
                </p>
                <h2>API feature highlights</h2>
                <p>The PixEdit Server Cloud API features functionality for processing and converting scanned documents and office documents:</p>
                <p>
                    <ul>
                        <li>Convert scanned documents and office documents to various PDF formats. F.ex. PDF/A, which is optimized for archiving.</li>
                        <li>Recognize text in scanned documents and make them searchable</li>
                        <li>Clean up and enhance readability of scanned documents</li>
                        <li>Separate batch scanned documents with QR codes</li>
                        <li>Merge scanned documents and office documents together into one PDF and set bookmarks</li>
                        <li>Generate previews of documents for use in client applications</li>
                        <li>Convert scanned documents to office documents, f.ex. PDF to Microsoft Word</li>
                        <li>Search scanned documents and office documents for text categories, such as names, addresses, phone numbers, etc.</li>
                    </ul>
                </p>
                <h2>API documentation</h2>
                <p>If you are a developer and want to know more details about the API, products and licensing options, please visit our developer portal:</p>
                <h4><a href='https://pixeditservercloud.developer.azure-api.net/'>PixEdit Server Cloud Developer Portal</a></h4>
                <p>Our API is available as a SaaS, hosted in Azure. Optionally, the API can also be hosted by you, on-prem or in your own cloud environment. Please <a href='https://www.pixedit.com/en/contact/'>contact us</a> for more information.</p>
                <h2>Current API Info</h2>
                <p>{this.props.apiInfo ? this.props.apiInfo.name : null}<br/>
                Core Version: {this.props.apiInfo ? this.props.apiInfo.version : null}<br/>
                Published: {this.props.apiInfo ? this.props.apiInfo.publishedDate : null}</p>
                <p className='text-warning'>{this.props.apiInfo && this.props.apiInfo.unavailable ? 'Info unavailable at the moment:-(' : ''}</p>
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
