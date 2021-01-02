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

const fileRequired = (value: any) => (value ? undefined : '*Required');

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
                            <Field
                                name='file'
                                type='file'
                                filename={this.props.inputFilename}
                                colClass='input-group mb-3 col-sm-6'
                                component={this.renderInputFile}
                            />
                            <Field
                                name='outputFormat'
                                colClass='input-group mb-3 col-sm-3'
                                component={this.renderSelectOutputFormat}
                            />
                            <Field
                                name='doOcr'
                                component={this.renderCheckDoOcr}
                                type='checkbox'
                                colClass='input-group mb-3 col-sm-3'
                                className='custom-control-input'
                            />
                        </div>
                    </form>
                </div>
                <div>
                    <p>{this.props.message}</p>
                </div>
                <div>
                    <h2><a href={this.props.downloadUrl || ''} target='_blank' rel='noopener noreferrer'>{this.props.outputFilename || ''}</a></h2>
                </div>
            </React.Fragment>
        );
    }

    renderInputFile = ( { input, type, colClass, filename, pristine, submitting, meta: { touched, error, warning } }:
                        { input: HTMLInputElement, type: string, colClass: string, filename: string, pristine: boolean, submitting: boolean, meta: { touched: boolean, error: string, warning: string } }) => {
        return (
            <div className={colClass}>
                <div className='custom-file w-100'>
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
                    <label className='custom-file-label' htmlFor='inputFile'>{filename || 'Choose file'}</label>
                </div>
                <div className='input-group-append'>
                    <button type='submit' disabled={pristine || submitting} className='btn btn-outline-primary'>Convert</button>
                </div>
                {/*
                * <div className='w-100'>
                *    {error && <span className='text-danger'>{error}</span>}
                * </div>
                */}
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

    renderSelectOutputFormat = ({ input, colClass }: { input: HTMLSelectElement, colClass: string }) => {
        return (
            <div className={colClass}>
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
            </div>
        );
    };

    handleOutputFormatChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        if (event.target && event.target.value) {
            this.props.selectOutputFormat(event.target.value);
        }
    };

    renderCheckDoOcr = ({ input, type, colClass }: { input: HTMLInputElement, type: string, colClass: string }) => {
        return (
            <div className={colClass}>
                <div className='custom-control custom-checkbox'>
                        <input
                            id='checkDoOcr'
                            name={input.name}
                            type={type}
                            className='custom-control-input'
                            onChange={event => this.handleDoOcrChange(event)}
                        />
                    <label className='custom-control-label' htmlFor='checkDoOcr'>Recognize Text</label>
                </div>
            </div>
        );
    };

    handleDoOcrChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target) {
            this.props.selectDoOcr(event.target.checked);
        }
    };

    onFormSubmit = () => {
        this.props.inputFile && this.props.processDocument();
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
        initialValues: state.docProcess
    };
}

export default compose(
    connect(
        mapStateToProps,
        DocumentProcessStore.actionCreators),
    reduxForm<ConvertDocumentValues>({
        form: 'upload-file-form'
    })
)(ConvertDocument as any);

