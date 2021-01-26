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
    removeBlackBorders: boolean,
    removeBlankPages: boolean,
    autoOrientation: boolean,
    deskew: boolean,
    enhanceText: boolean,
    documentSeparationType: DocumentProcessStore.DocumentSeparationType,
    exportFormat: DocumentProcessStore.ExportFormat
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
                                    disabled={this.props.isProcessing}
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
                                                    selectedValue={this.props.outputFormat}
                                                    label='Output Format'
                                                    options={DocumentProcessStore.OutputFormat}
                                                    component={this.renderSelectOption}
                                                    onChangeHandler={(event: React.ChangeEvent<HTMLSelectElement>) => this.handleOutputFormatChange(event)}
                                                    disabled={this.props.isProcessing}
                                                />
                                            </div>
                                        </div>
                                        <div className='row mt-3 mb-3'>
                                            <div className='col-sm-3'>
                                                <Field
                                                    name='doOcr'
                                                    label='Recognize Text'
                                                    isChecked={this.props.doOcr}
                                                    component={this.renderCheckOption}
                                                    disabled={this.props.isProcessing}
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
                                                    disabled={this.props.isProcessing}
                                                />
                                            </div>
                                        </div>
                                    </Tab>
                                    <Tab eventKey='process' title='Process' disabled={this.props.isProcessing}>
                                        <div className='row mt-3 mb-3'>
                                            <div className='col-sm-3'>
                                                <Field
                                                    name='removeBlackBorders'
                                                    label='Remove Black Borders'
                                                    isChecked={this.props.removeBlackBorders}
                                                    component={this.renderCheckOption}
                                                    disabled={this.props.isProcessing}
                                                />
                                            </div>
                                        </div>
                                        <div className='row mt-3 mb-3'>
                                            <div className='col-sm-3'>
                                                <Field
                                                    name='removeBlankPages'
                                                    label='Remove Blank Pages'
                                                    isChecked={this.props.removeBlankPages}
                                                    component={this.renderCheckOption}
                                                    disabled={this.props.isProcessing}
                                                />
                                            </div>
                                        </div>
                                        <div className='row mt-3 mb-3'>
                                            <div className='col-sm-3'>
                                                <Field
                                                    name='autoOrientation'
                                                    label='Correct Page Orientation'
                                                    isChecked={this.props.autoOrientation}
                                                    component={this.renderCheckOption}
                                                    disabled={this.props.isProcessing}
                                                />
                                            </div>
                                        </div>
                                        <div className='row mt-3 mb-3'>
                                            <div className='col-sm-3'>
                                                <Field
                                                    name='deskew'
                                                    label='Deskew Pages (Straighten)'
                                                    isChecked={this.props.deskew}
                                                    component={this.renderCheckOption}
                                                    disabled={this.props.isProcessing}
                                                />
                                            </div>
                                        </div>
                                        <div className='row mt-3 mb-3'>
                                            <div className='col-sm-3'>
                                                <Field
                                                    name='enhanceText'
                                                    label='Enhance Text'
                                                    isChecked={this.props.enhanceText}
                                                    component={this.renderCheckOption}
                                                    disabled={this.props.isProcessing}
                                                />
                                            </div>
                                        </div>
                                        <div className='row mt-3 mb-3'>
                                            <div className='col-sm-3'>
                                                <Field
                                                    name='doOcr'
                                                    label='Recognize Text'
                                                    isChecked={this.props.doOcr}
                                                    component={this.renderCheckOption}
                                                    disabled={this.props.isProcessing}
                                                />
                                            </div>
                                        </div>
                                        <div className='row mt-3 mb-3'>
                                            <div className='col-sm-3'>
                                                <Field
                                                    name='documentSeparationType'
                                                    label='Separate Documents'
                                                    selectedValue={this.props.documentSeparationType}
                                                    options={DocumentProcessStore.DocumentSeparationType}
                                                    component={this.renderSelectOption}
                                                    disabled={this.props.isProcessing}
                                                    onChangeHandler={(event: React.ChangeEvent<HTMLSelectElement>) => this.handleDocumentSeparationTypeChange(event)}
                                                />
                                            </div>
                                        </div>
                                    </Tab>
                                    <Tab eventKey='export' title='Convert to Office' disabled={this.props.isProcessing}>
                                        <div className='row mt-3 mb-3'>
                                            <div className='col-sm-3'>
                                                <Field
                                                    name='exportFormat'
                                                    selectedValue={this.props.exportFormat}
                                                    label='Export Format'
                                                    options={DocumentProcessStore.ExportFormat}
                                                    component={this.renderSelectOption}
                                                    onChangeHandler={(event: React.ChangeEvent<HTMLSelectElement>) => this.handleExportFormatChange(event)}
                                                    disabled={this.props.isProcessing}
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
                    (this.props.mode === 'convert' || this.props.mode === 'process' || this.props.mode === 'export') && this.props.downloadUrl ?
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

    renderInputFile = ( { input, type, filename, disabled, meta: { touched, error, warning } }:
                        { input: HTMLInputElement, type: string, filename: string, disabled: boolean, meta: { touched: boolean, error: string, warning: string } }) => {
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
                        disabled={disabled}
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

    renderSelectOption = ({ input, options, selectedValue, label, disabled, onChangeHandler }: { input: HTMLSelectElement, options: Enum, selectedValue: string, label: string, disabled: boolean, onChangeHandler: (event: React.ChangeEvent<HTMLSelectElement>) => any }) => {
        return (
            <div>
                <label htmlFor={input.name}>{label}</label>
                <select
                    id={input.name}
                    name={input.name}
                    className='custom-select'
                    value={selectedValue}
                    disabled={disabled}
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

    renderCheckOption = ({ input, type, label, isChecked, disabled }: { input: HTMLInputElement, type: string, label: string, isChecked: boolean, disabled: boolean }) => {
        return (
            <div className='custom-control custom-checkbox'>
                <input
                    id={input.name}
                    name={input.name}
                    type='checkbox'
                    className='custom-control-input'
                    checked={isChecked}
                    disabled={disabled}
                    onChange={event => this.handleCheckOptionChange(event)}
                />
                <label className='custom-control-label' htmlFor={input.name}>{label}</label>
            </div>
        );
    };

    handleCheckOptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target) {
            this.props.selectOption(event.target.id, event.target.checked);
        }
    };

    renderSelectPixSize = ({ input, pixSize, disabled }: { input: HTMLSelectElement, pixSize: number, disabled: boolean }) => {
        return (
            <div>
                <label htmlFor='selectPixSize'>Size in Pixels</label>
                <select
                    id={input.name}
                    name={input.name}
                    className='custom-select'
                    value={pixSize}
                    disabled={disabled}
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

    handleDocumentSeparationTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        if (event.target && event.target.value) {
            this.props.selectDocumentSeparationType(event.target.value as DocumentProcessStore.DocumentSeparationType);
        }
    };

    handleExportFormatChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        if (event.target && event.target.value) {
            this.props.selectExportFormat(event.target.value as DocumentProcessStore.ExportFormat);
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
        else if (this.props.mode === 'export') {
            this.props.inputFile && this.props.exportDocument();
        }

    };

}

function mapStateToProps(state: ApplicationState) {
    if (state.docProcess)
        return { ...(state.docProcess), initialValues: state.docProcess }
    else
        return {
            mode: 'convert',
            inputFilename: '',
            inputMimeType: '',
            inputFile: null,
            outputFormat: '',
            doOcr: false,
            outputFilename: '',
            downloadUrl: '',
            pixSize: 100,
            pagePreviews: null,
            removeBlackBorders: false,
            removeBlankPages: false,
            autoOrientation: false,
            deskew: false,
            enhanceText: false,
            documentSeparationType: '',
            exportFormat: '',
            isProcessing: false,
            message: '',
            initialValues: undefined
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

