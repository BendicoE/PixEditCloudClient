import * as React from 'react';
import { Tabs, Tab, Card, Accordion, Button } from 'react-bootstrap'
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
    removeBlackBorders: boolean;
    removePunchHoles: boolean;
    removeBlankPages: boolean;
    autoOrientation: boolean;
    deskew: boolean;
    enhanceText: boolean;
    documentSeparationType: DocumentProcessStore.DocumentSeparationType;
    exportFormat: DocumentProcessStore.ExportFormat;
    exportLayout: DocumentProcessStore.ExportLayout;
    redactType: string;
    textSearchType: string;
    searchText: string;
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
                                        <div className='row mt-3 mb-3'>
                                            <div className='col-sm-3'>
                                                <Field
                                                    name='previewAllPages'
                                                    label='All Pages'
                                                    isChecked={this.props.previewAllPages}
                                                    component={this.renderCheckOption}
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
                                                    name='removePunchHoles'
                                                    label='Remove Punch Holes'
                                                    isChecked={this.props.removePunchHoles}
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
                                            <div className='col-sm-3'>
                                                <Field
                                                    name='exportLayout'
                                                    selectedValue={this.props.exportLayout}
                                                    label='Export Layout'
                                                    options={DocumentProcessStore.ExportLayout}
                                                    component={this.renderSelectOption}
                                                    onChangeHandler={(event: React.ChangeEvent<HTMLSelectElement>) => this.handleExportLayoutChange(event)}
                                                    disabled={this.props.isProcessing}
                                                />
                                            </div>
                                        </div>
                                    </Tab>
                                    <Tab eventKey='redact' title='Redact Document' disabled={this.props.isProcessing}>
                                        <div className='row mt-3 mb-3'>
                                            <div className='col-sm-6'>
                                                <Field
                                                    name='redactType'
                                                    label='Redact Type'
                                                    component={this.renderRedactType}
                                                    onChangeHandler={(event: React.ChangeEvent<HTMLInputElement>) => this.handleRedactTypeChange(event)}
                                                    disabled={this.props.isProcessing}
                                                    currentSelection={this.props.redactType}
                                                />
                                                <Field
                                                    name='textSearchType'
                                                    label='Text Search Type'
                                                    component={this.renderTextSearchType}
                                                    onChangeHandler={(event: React.ChangeEvent<HTMLInputElement>) => this.handleTextSearchTypeChange(event)}
                                                    disabled={this.props.isProcessing}
                                                    currentSelection={this.props.textSearchType}
                                                />
                                                <Field
                                                    name='searchText'
                                                    label='Search Text'
                                                    type='text'
                                                    value={this.props.searchText}
                                                    component={this.renderSearchText}
                                                    onChangeHandler={(event: React.ChangeEvent<HTMLInputElement>) => this.handleSearchTextChange(event)}
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
                    (this.props.mode === 'convert' || this.props.mode === 'process' || this.props.mode === 'export' || this.props.mode === 'redact') && this.props.downloadUrl ?
                        <div>
                            <h2><a href={this.props.downloadUrl || ''} target='_blank' rel='noopener noreferrer' download={this.props.outputFilename}>{this.props.outputFilename || ''}</a></h2>
                        </div>
                        : <div/>
                }
                {
                    this.props.mode === 'preview' && this.props.pagePreviews ?
                        this.props.pagePreviews.map((x, i) =>
                            <div className='page-thumb' style={{ width: this.props.pixSize + 16, height: this.props.pixSize + 16 }}>
                                <img src={"data:image/jpeg;base64," + x.imageData} style={{ maxWidth: this.props.pixSize, maxHeight: this.props.pixSize }} />
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
                        accept='application/pdf, application/zip, image/tiff, image/jpeg, image/png, image/heic, image/heif, application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document, \
                                application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-powerpoint, application/vnd.openxmlformats-officedocument.presentationml.presentation \
                                application/vnd.oasis.opendocument.text, application/vnd.ms-project, message/rfc822, application/vnd.ms-outlook, text/html'
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

    renderSelectOption =
        ({ input, options, selectedValue, label, disabled, onChangeHandler }: {
            input: HTMLSelectElement,
            options: Enum,
            selectedValue: string,
            label: string,
            disabled: boolean,
            onChangeHandler: (event: React.ChangeEvent<HTMLSelectElement>) => any
        }) => {
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

    renderRedactType =
        ({ input, label, currentSelection, disabled, onChangeHandler }: {
            input: HTMLDivElement,
            label: string,
            currentSelection: string,
            disabled: boolean
            onChangeHandler: (event: React.ChangeEvent<HTMLInputElement>) => any
        }) => {
            return (
                <div>
                    <br />
                    {label}<br />
                    <div>
                        <input type="radio" value="markup" name="redactOption" checked={currentSelection === "markup"} disabled={disabled} onChange={onChangeHandler} /> Markup<br />
                        <input type="radio" value="redact" name="redactOption" checked={currentSelection === "redact"} disabled={disabled} onChange={onChangeHandler} /> Redact<br />
                        <input type="radio" value="markupandredact" name="redactOption" checked={currentSelection === "markupandredact"} disabled={disabled} onChange={onChangeHandler} /> Markup and Redact<br />
                    </div>
                </div>
            );
        };

    renderTextSearchType =
        ({ input, label, currentSelection, disabled, onChangeHandler }: {
            input: HTMLDivElement,
            label: string,
            currentSelection: string,
            disabled: boolean
            onChangeHandler: (event: React.ChangeEvent<HTMLInputElement>) => any
        }) => {
        return (
            <div>
                <br />
                {label}<br />
                <div>
                    <input type="radio" value="phrase" name="textSearchOption" checked={currentSelection === "phrase"} disabled={disabled} onChange={onChangeHandler} /> Phrase<br/>
                    <input type="radio" value="regex" name="textSearchOption" checked={currentSelection === "regex"} disabled={disabled} onChange={onChangeHandler} /> Regular Expression<br/>
                    <input type="radio" value="piicat" name="textSearchOption" checked={currentSelection === "piicat"} disabled={disabled} onChange={onChangeHandler} /> PII Categories<br/>
                    <input type="radio" value="dataextract" name="textSearchOption" checked={currentSelection === "dataextract"} disabled={disabled} onChange={onChangeHandler} /> AI Data Extraction<br/>
                    <input type="radio" value="highlightedareas" name="textSearchOption" checked={currentSelection === "highlightedareas"} disabled={disabled} onChange={onChangeHandler} /> Highlighted Areas<br />
                </div>
            </div>
        );
    };

    renderSearchText = ({ input, label, type, value, meta: { touched, error, warning }, onChangeHandler }: {
        input: any,
        label: string,
        type: string,
        value: string,
        meta: { touched: boolean, error: string, warning: string },
        onChangeHandler: (event: React.ChangeEvent<HTMLInputElement>) => any
    }) => (
        <div>
            <div>
                <br />
                <input className='w-100' id={input.name} name={input.name} placeholder={label} type={type} value={value} onChange={onChangeHandler} />
            </div>
            <div>
                {touched &&
                    ((error && <span className='text-danger'>{error}</span>) ||
                        (warning && <span className='text-warning'>{warning}</span>))}
            </div>
        </div>
    );


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
                    <option value={800}>800 px</option>
                    <option value={1200}>1200 px</option>
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

    handleExportLayoutChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        if (event.target && event.target.value) {
            this.props.selectExportLayout(event.target.value as DocumentProcessStore.ExportLayout);
        }
    };

    handleTextSearchTypeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target && event.target.value) {
            this.props.selectTextSearchType(event.target.value);
        }
    }

    handleRedactTypeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target && event.target.value) {
            this.props.selectRedactType(event.target.value);
        }
    }

    handleSearchTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        event.preventDefault();
        if (event.target && event.target.value) {
            this.props.setSearchText(event.target.value);
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
        else if (this.props.mode === 'redact') {
            this.props.inputFile && this.props.redactDocument();
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
            removePunchHoles: false,
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

