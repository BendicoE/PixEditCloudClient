import * as React from 'react';
import { Tabs, Tab } from 'react-bootstrap'
import { connect } from 'react-redux';
import { compose } from 'redux';
import { RouteComponentProps } from 'react-router';
import { Field, reduxForm, InjectedFormProps } from 'redux-form';
import { ApplicationState } from '../store';
import * as DocumentProcessStore from '../store/DocumentProcess';
import { Enum } from '../store/DocumentProcess';

type ProcessDocumentProps =
    DocumentProcessStore.DocumentProcessState
    & typeof DocumentProcessStore.actionCreators
    & RouteComponentProps<{}>;

interface ProcessDocumentValues {
    file: File;
    outputFormat: string;
    doOcr: boolean;
    pixSize: number;
    pagePreviews: DocumentProcessStore.PagePreview[] | null;
}

// COMPONENT

const fileRequired = (value: any) => (value ? undefined : '*Required');

class ProcessDocument extends React.PureComponent<ProcessDocumentProps & InjectedFormProps<ProcessDocumentValues, ProcessDocumentProps>> {
    public render() {
        const { handleSubmit, submitting } = this.props;
        return (
            <React.Fragment>
                <h1>Process Document</h1>
                <hr />
                <div>
                    <form onSubmit={handleSubmit(this.onFormSubmit)}>
                        <div className='row'>
                            <div className='input-group mb-3 col-sm-6'>
                                <Field
                                    name='file'
                                    type='file'
                                    filename={this.props.inputFilename}
                                    component={this.renderInputFile}
                                    />
                            </div>
                        </div>
                        <div className='row'>
                            <div className='col-sm-12'>
                                <Tabs activeKey={this.props.mode} onSelect={ this.onModeSelect }>
                                    <Tab eventKey='convert' title='Convert' disabled={this.props.isProcessing}>
                                        <div className='row mt-3 mb-3'>
                                            <div className='col-sm-3'>
                                                <Field
                                                    name='outputFormat'
                                                    elemId='selectOutputFormat'
                                                    label='Output Format'
                                                    options={DocumentProcessStore.OutputFormat}
                                                    component={this.renderSelectOption}
                                                    onChangeHandler={(event: React.ChangeEvent<HTMLSelectElement>) => this.handleOutputFormatChange(event)}
                                                />
                                            </div>
                                            <div className='col-sm-3'>
                                                <label>Options</label>
                                                <Field
                                                    name='doOcr'
                                                    component={this.renderCheckDoOcr}
                                                    type='checkbox'
                                                    className='custom-control-input'
                                                />
                                            </div>
                                        </div>
                                    </Tab>
                                    <Tab eventKey='preview' title='Preview' disabled={this.props.isProcessing}>
                                        <div className='row mt-3 mb-3'>
                                            <div className='col-sm-3'>
                                                <Field
                                                    name='pixSize'
                                                    pixSize={this.props.pixSize}
                                                    component={this.renderSelectPixSize}
                                                />
                                            </div>
                                        </div>
                                    </Tab>
                                    <Tab eventKey='process' title='Process' disabled={this.props.isProcessing}>
                                        <div className='row mt-3 mb-3'>
                                            <div className='col-sm-3'>
                                                <Field
                                                    name='processOperations.removeBlackBorders'
                                                    elemId='checkRemoveBlackBorders'
                                                    component={this.renderCheckOperation}
                                                    label='Remove Black Borders'
                                                    type='checkbox'
                                                    className='custom-control-input'
                                                />
                                            </div>
                                        </div>
                                        <div className='row mt-3 mb-3'>
                                            <div className='col-sm-3'>
                                                <Field
                                                    name='processOperations.removeBlankPages'
                                                    elemId='checkRemoveBlankPages'
                                                    component={this.renderCheckOperation}
                                                    label='Remove Blank Pages'
                                                    type='checkbox'
                                                    className='custom-control-input'
                                                />
                                            </div>
                                        </div>
                                        <div className='row mt-3 mb-3'>
                                            <div className='col-sm-3'>
                                                <Field
                                                    name='processOperations.autoOrientation'
                                                    elemId='checkAutoOrientation'
                                                    component={this.renderCheckOperation}
                                                    label='Correct Page Orientation'
                                                    type='checkbox'
                                                    className='custom-control-input'
                                                />
                                            </div>
                                        </div>
                                        <div className='row mt-3 mb-3'>
                                            <div className='col-sm-3'>
                                                <Field
                                                    name='processOperations.documentSeparationType'
                                                    elemId='selectDocumentSeparationType'
                                                    label='Separate Documents'
                                                    options={DocumentProcessStore.DocumentSeparationType}
                                                    component={this.renderSelectOption}
                                                    onChangeHandler={(event: React.ChangeEvent<HTMLSelectElement>) => this.handleDocumentSeparationTypeChange(event)}
                                                />
                                            </div>
                                        </div>

                                    </Tab>
                                </Tabs>
                            </div>
                        </div>
                        <div className='row'>
                            <div className='mb-3 col-sm-3'>
                                <button type='submit' disabled={submitting || this.props.inputFile == null || this.props.isProcessing} className='btn btn-outline-primary'>Do it!</button>
                            </div>
                        </div>
                    </form>
                </div>
                <div>
                    <p>{this.props.message}</p>
                </div>
                {
                    (this.props.mode === 'convert' || this.props.mode === 'process') && this.props.downloadUrl ?
                        <div>
                            <h2><a href={this.props.downloadUrl || ''} target='_blank' rel='noopener noreferrer' download={this.props.outputFilename}>{this.props.outputFilename || ''}</a></h2>
                        </div>
                        : <div/>
                }
                {
                    this.props.mode === 'preview' && this.props.pagePreviews ?
                        this.props.pagePreviews.map((x, i) =>
                            <div className='page-thumb' style={{ width: this.props.pixSize + 16, height: this.props.pixSize + 16 }}>
                                <img src={"data:image/jpeg;base64," + x.imageData} />
                            </div>
                        )
                        : <div/>
                }
            </React.Fragment>
        );
    }

    renderInputFile = ( { input, type, filename, meta: { touched, error, warning } }:
                        { input: HTMLInputElement, type: string, filename: string, meta: { touched: boolean, error: string, warning: string } }) => {
        return (
            <div className='custom-file w-100'>
                <div>
                    <input
                        id='inputFile'
                        name={input.name}
                        type={type}
                        accept='application/pdf, application/zip, image/tiff, image/jpeg, image/png, application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document, \
                                application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-powerpoint, application/vnd.openxmlformats-officedocument.presentationml.presentation \
                                application/vnd.oasis.opendocument.text, application/vnd.ms-project, message/rfc822, application/vnd.ms-outlook'
                        onChange={event => this.handleInputFileChange(event)}
                        />
                </div>
                <label className='custom-file-label' htmlFor='inputFile'>{filename || 'Choose file'}</label>
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

    renderSelectOption = ({ input, options, outputFormat, elemId, label, onChangeHandler }: { input: HTMLSelectElement, options: Enum, outputFormat: string, elemId: string, label: string, onChangeHandler: (event: React.ChangeEvent<HTMLSelectElement>) => any }) => {
        return (
            <div>
                <label htmlFor={elemId}>{label}</label>
                <select
                    id={elemId}
                    name={input.name}
                    className='custom-select'
                    value={outputFormat}
                    onChange={onChangeHandler}
                >
                    {
                        Object.keys(options).map(key => {
                            return (
                                <option key={key} value={key}>{options[key]}</option>
                            );
                        })
                    }
                </select>
            </div>
        );
    };

    handleOutputFormatChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        if (event.target && event.target.value) {
            this.props.selectOutputFormat(event.target.value as DocumentProcessStore.OutputFormat);
        }
    };

    renderCheckDoOcr = ({ input, type }: { input: HTMLInputElement, type: string }) => {
        return (
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
        );
    };

    handleDoOcrChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target) {
            this.props.selectDoOcr(event.target.checked);
        }
    };

    renderSelectPixSize = ({ input, pixSize }: { input: HTMLSelectElement, pixSize: number }) => {
        return (
            <div>
                <label htmlFor='selectPixSize'>Size in Pixels</label>
                <select
                    id='selectPixSize'
                    name={input.name}
                    className='custom-select'
                    value={pixSize}
                    onChange={event => this.handlePixSizeChange(event)}
                >
                    <option value={80}>80 px</option>
                    <option value={100}>100 px</option>
                    <option value={140}>140 px</option>
                    <option value={200}>200 px</option>
                    <option value={400}>400 px</option>
                </select>
            </div>
        );
    };

    handlePixSizeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        if (event.target && event.target.value) {
            this.props.selectPixSize(+event.target.value);
        }
    };

    renderCheckOperation = ({ input, type, elemId, label }: { input: HTMLInputElement, type: string, elemId: string, label: string }) => {
        return (
            <div className='custom-control custom-checkbox'>
                <input
                    id={elemId}
                    name={input.name}
                    type={type}
                    className='custom-control-input'
                    onChange={event => this.handleCheckOperationChange(event)}
                />
                <label className='custom-control-label' htmlFor={elemId}>{label}</label>
            </div>
        );
    };

    handleCheckOperationChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target) {
            this.props.selectOperation(event.target.id, event.target.checked);
        }
    };

    handleDocumentSeparationTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        if (event.target && event.target.value) {
            this.props.selectDocumentSeparationType(event.target.value as DocumentProcessStore.DocumentSeparationType);
        }
    };

    onModeSelect = (mode: any) => {
        this.props.selectMode(mode);
    };

    onFormSubmit = () => {
        if (this.props.mode === 'convert') {
            this.props.inputFile && this.props.convertDocument();
        }
        else if (this.props.mode === 'preview') {
            this.props.inputFile && this.props.previewDocument();
        }
        else if (this.props.mode === 'process') {
            this.props.inputFile && this.props.processDocument();
        }

    };

}

function mapStateToProps(state: ApplicationState) {
    return {
        mode: state.docProcess ? state.docProcess.mode : 'convert',
        inputFilename: state.docProcess ? state.docProcess.inputFilename : '',
        inputMimeType: state.docProcess ? state.docProcess.inputMimeType : '',
        inputFile: state.docProcess ? state.docProcess.inputFile : null,
        outputFormat: state.docProcess ? state.docProcess.outputFormat : '',
        doOcr: state.docProcess ? state.docProcess.doOcr : false,
        outputFilename: state.docProcess ? state.docProcess.outputFilename : '',
        downloadUrl: state.docProcess ? state.docProcess.downloadUrl : '',
        pixSize: state.docProcess ? state.docProcess.pixSize : 100,
        pagePreviews: state.docProcess ? state.docProcess.pagePreviews : null,
        processOperations: state.docProcess ? state.docProcess.processOperations : undefined,
        isProcessing: state.docProcess ? state.docProcess.isProcessing : false,
        message: state.docProcess ? state.docProcess.message : '',
        initialValues: state.docProcess
    };
}

export default compose(
    connect(
        mapStateToProps,
        DocumentProcessStore.actionCreators),
    reduxForm<ProcessDocumentValues>({
        form: 'input-file-form'
    })
)(ProcessDocument as any);

