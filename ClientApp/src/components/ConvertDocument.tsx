import * as React from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { RouteComponentProps } from 'react-router';
import { Field, reduxForm, InjectedFormProps } from 'redux-form';
import { ApplicationState } from '../store';
import * as DocumentProcessStore from '../store/DocumentProcess';

type ConvertDocumentProps =
    DocumentProcessStore.DocumentProcessState
    & typeof DocumentProcessStore.actionCreators
    & RouteComponentProps<{}>;

interface ConvertDocumentValues {
    file: File;
    outputFormat: string;
    doOcr: boolean;
}

// COMPONENT

class ConvertDocument extends React.PureComponent<ConvertDocumentProps & InjectedFormProps<ConvertDocumentValues, ConvertDocumentProps>> {
    public render() {
        const { handleSubmit } = this.props;
        return (
            <React.Fragment>
                <h1>Convert Document</h1>
                <hr />
                <div>
                    <form onSubmit={handleSubmit(this.onFormSubmit)}>
                        <div className='row'>
                            <div className='input-group mb-3 col-sm-6'>
                                <div className='custom-file'>
                                    <Field
                                        name='file'
                                        type='file'
                                        component={this.renderInputFile}
                                    />
                                    <label className='custom-file-label' htmlFor='inputFile'>{this.props.inputFilename || 'Choose file'}</label>
                                </div>
                                <div className='input-group-append'>
                                    <button type='submit' className='btn btn-outline-primary'>Convert</button>
                                </div>
                            </div>
                            <div className='input-group mb-3 col-sm-3'>
                                <Field
                                    name='outputFormat'
                                    component={this.renderSelectOutputFormat}
                                />
                            </div>
                            <div className='input-group mb-3 col-sm-3'>
                                <div className='custom-control custom-checkbox'>
                                    <Field
                                        name='doOcr'
                                        component={this.renderCheckDoOcr}
                                        type='checkbox'
                                        className='custom-control-input'
                                    />
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
                <div>
                    <p>{this.props.message}</p>
                </div>
                <div>
                    <h2><a href={this.props.downloadUrl || ''} target='_blank'>{this.props.outputFilename || ''}</a></h2>
                </div>
            </React.Fragment>
        );
    }

    renderInputFile = ({ input, type }: { input: HTMLInputElement, type: string }) => {
        return (
            <div>
                <input
                    id='inputFile'
                    name={input.name}
                    type={type}
                    accept='application/pdf, application/zip, image/tiff, image/jpeg, image/png, application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document, \
                            application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-powerpoint, application/vnd.openxmlformats-officedocument.presentationml.presentation \
                            application/vnd.oasis.opendocument.text, application/vnd.ms-project, message/rfc822, application/vnd.ms-outlook '
                    onChange={event => this.handleInputFileChange(event)}
                />
            </div>
        );
    };

    handleInputFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        event.preventDefault();
        if (event.target && event.target.files) {
            let selectedFile = event.target.files[0];
            if (selectedFile) {
                this.props.selectFile(selectedFile.name, selectedFile.type, selectedFile);
            }
        }
    };

    renderSelectOutputFormat = ({ input }: { input: HTMLSelectElement }) => {
        return (
            <select
                id='selectOutputFormat'
                name={input.name}
                className='custom-select'
                onChange={event => this.handleOutputFormatChange(event)}
            >
                <option value='pdfa1b'>PDF/A-1b</option>
                <option value='pdfa2b'>PDF/A-2b</option>
                <option value='pdfa3b'>PDF/A-3b</option>
                <option value='pdf'>PDF</option>
            </select>
        );
    };

    handleOutputFormatChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        if (event.target && event.target.value) {
            this.props.selectOutputFormat(event.target.value);
        }
    };

    renderCheckDoOcr = ({ input, type }: { input: HTMLInputElement, type: string }) => {
        return (
            <div>
                <input
                    id='checkDoOcr'
                    name={input.name}
                    type={type}
                    className='custom-control-input'
                    onChange={event => this.handleDoOcrChange(event)}
                />
                <label className='custom-control-label' htmlFor='checkDoOcr'>Recognize Text</label>
            </div>
        );
    };

    handleDoOcrChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target) {
            this.props.selectDoOcr(event.target.checked);
        }
    };

    onFormSubmit = () => {
        this.props.processDocument();
    };

}

function mapStateToProps(state: ApplicationState) {
    return {
        inputFilename: state.docProcess ? state.docProcess.inputFilename : '',
        inputMimeType: state.docProcess ? state.docProcess.inputMimeType : '',
        inputFile: state.docProcess ? state.docProcess.inputFile : null,
        outputFormat: state.docProcess ? state.docProcess.outputFormat : '',
        doOcr: state.docProcess ? state.docProcess.doOcr : false,
        outputFilename: state.docProcess ? state.docProcess.outputFilename : '',
        downloadUrl: state.docProcess ? state.docProcess.downloadUrl : '',
        message: state.docProcess ? state.docProcess.message : '',
        initialvalues: state.docProcess
    };
}

export default compose(
    connect(
        mapStateToProps,
        DocumentProcessStore.actionCreators),
    reduxForm({
        form: 'upload-file-form',
        enableReinitialize: true,
        keepDirtyOnReinitialize: true
    })
)(ConvertDocument as any);

