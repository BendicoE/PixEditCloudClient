import * as React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router';
import { Field, reduxForm } from 'redux-form';
import { ApplicationState } from '../store';
import * as DocumentProcessStore from '../store/DocumentProcess';

type ConvertDocumentProps =
    DocumentProcessStore.DocumentProcessState
    & typeof DocumentProcessStore.actionCreators
    & RouteComponentProps<{}>;

// COMPONENT

class ConvertDocument extends React.PureComponent<ConvertDocumentProps> {
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
                            <div className='input-group mb-3  col-sm-3'>
                                <Field
                                    name='outputFormat'
                                    component='select'
                                    className='custom-select'>
                                    <option value='pdfa1b'>PDF/A-1b</option>
                                    <option value='pdfa2b'>PDF/A-2b</option>
                                    <option value='pdfa3b'>PDF/A-3b</option>
                                    <option value='pdf'>PDF</option>
                                </Field>
                            </div>
                            <div className='input-group mb-3 col-sm-3'>
                                <div className='custom-control custom-checkbox'>
                                    <Field
                                        id='inputOcr'
                                        name='doOcr'
                                        component='input'
                                        type='checkbox'
                                        className='custom-control-input'
                                    />
                                    <label className='custom-control-label' htmlFor='inputOcr'>Recognize Text</label>
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

    renderInputFile = ({ input, type, meta }) => {
        return (
            <div>
                <input
                    id='inputFile'
                    name={input.name}
                    type={type}
                    accept='application/pdf, application/zip, image/tiff, image/jpeg, image/png, application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document, \
                            application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-powerpoint, application/vnd.openxmlformats-officedocument.presentationml.presentation \
                            application/vnd.oasis.opendocument.text, application/vnd.ms-project, message/rfc822, application/vnd.ms-outlook '
                    onChange={event => this.handleChange(event, input)}
                />
            </div>
        );
    };

    handleChange = (event, input) => {
        event.preventDefault();
        let selectedFile = event.target.files[0];
        if (selectedFile) {
            this.props.selectFile(selectedFile.name, selectedFile.type, selectedFile);
        }
    };

    private processDocument(outputFormat, doOcr) {
        this.props.processDocument(outputFormat, doOcr);
    }

    onFormSubmit = (formValues) => {
        this.processDocument(formValues.outputFormat, formValues.doOcr);
    };

}

function mapStateToProps(state: ApplicationState) {
    return {
        inputFilename: state.docProcess.inputFilename,
        inputMimeType: state.docProcess.inputMimeType,
        inputFile: state.docProcess.inputFile,
        outputFormat: state.docProcess.outputFormat,
        doOcr: state.docProcess.doOcr,
        outputFilename: state.docProcess.outputFilename,
        downloadUrl: state.docProcess.downloadUrl,
        message: state.docProcess.message,
        initialvalues: state.docProcess
    };
}

export default reduxForm<DocumentProcessStore.DocumentProcessState>({
    form: 'upload-file-form'
})(connect(
    mapStateToProps,
    DocumentProcessStore.actionCreators
)(ConvertDocument as any));