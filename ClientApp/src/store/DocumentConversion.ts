import { Action, Reducer } from 'redux';
import { AppThunkAction } from '.';
import axios from 'axios';
import * as Globals from './Globals';

// STATE

export interface DocumentConversionState {
    inputFilename: string;
    inputMimeType: string;
    inputFile: File | null;
    outputFormat: string;
    doOcr: boolean;
    outputFilename: string;
    downloadUrl: string;
    message: string;
}

// ACTIONS

interface FileSelectedAction {
    type: 'FILE_SELECTED';
    filename: string;
    mimeType: string;
    file: File;
}

interface OutputFormatSelectedAction {
    type: 'OUTPUT_FORMAT_SELECTED';
    format: string;
}

interface DoOcrSelectedAction {
    type: 'DO_OCR_SELECTED';
    selected: boolean;
}

interface ConvertDocumentAction {
    type: 'CONVERT_DOCUMENT';
}

interface DocumentReadyAction {
    type: 'DOCUMENT_READY';
    filename: string;
    downloadUrl: string;
}

interface ConversionFailedAction {
    type: 'CONVERSION_FAILED';
    error: string;
}

type KnownAction = FileSelectedAction | OutputFormatSelectedAction | DoOcrSelectedAction | ConvertDocumentAction | DocumentReadyAction | ConversionFailedAction;

// ACTION CREATORS

export const actionCreators = {
    selectFile: (filename: string, mimeType: string, file: File): AppThunkAction<KnownAction> => (dispatch, getState) => {
        const appState = getState();
        if (appState && appState.docConversion) {
            dispatch({ type: 'FILE_SELECTED', filename: filename, mimeType: mimeType, file: file });
        }
    },

    selectOutputFormat: (format: string): AppThunkAction<KnownAction> => (dispatch, getState) => {
        const appState = getState();
        if (appState && appState.docConversion) {
            dispatch({ type: 'OUTPUT_FORMAT_SELECTED', format: format });
        }
    },

    selectDoOcr: (selected: boolean): AppThunkAction<KnownAction> => (dispatch, getState) => {
        const appState = getState();
        if (appState && appState.docConversion) {
            dispatch({ type: 'DO_OCR_SELECTED', selected: selected });
        }
    },

    processDocument: (): AppThunkAction<KnownAction> => (dispatch, getState) => {
        const appState = getState();
        if (appState && appState.docConversion) {
            dispatch({ type: 'CONVERT_DOCUMENT' });
            const url = Globals.apiBaseUrl + '/Convert';
            const data = new FormData();
            if (appState.docConversion.inputFile != null) {
                data.append('file', new Blob([appState.docConversion.inputFile], { type: appState.docConversion.inputMimeType }), appState.docConversion.inputFilename);
                const reader = new window.FileReader();
                reader.onloadend = () => {
                    if (appState.globals) {
                        axios.post(url, data, {
                            responseType: 'blob',
                            headers: {
                                'Authorization': 'Bearer ' + appState.globals.authToken,
                                'Accept': 'application/pdf, application/json'
                            },
                            params: {
                                'Format': appState.docConversion ? appState.docConversion.outputFormat : '',
                                'OCR': appState.docConversion ? appState.docConversion.doOcr : false
                            }
                        }).then((response) => {
                            let respFilename = response.headers["content-disposition"].split("filename=")[1].split(";")[0];
                            respFilename = respFilename.replace(/^"+|"+$/g, '');
                            let respMimeType = response.headers["content-type"];
                            const url = window.URL.createObjectURL(new Blob([response.data], { type: respMimeType }));
                            dispatch({ type: 'DOCUMENT_READY', filename: respFilename, downloadUrl: url });
                        }, (error) => {
                            dispatch({ type: 'CONVERSION_FAILED', error: error });
                        });
                    }
                };
                reader.readAsDataURL(appState.docConversion.inputFile);
            }
        }
    }
};

// REDUCER

const unloadedState: DocumentConversionState = {
    inputFilename: '',
    inputMimeType: '',
    inputFile: null,
    outputFormat: 'pdfa1b',
    doOcr: false,
    outputFilename: '',
    downloadUrl: '',
    message: ''
};

export const reducer: Reducer<DocumentConversionState> = (state: DocumentConversionState | undefined, incomingAction: Action): DocumentConversionState => {
    if (state === undefined) {
        return unloadedState;
    }

    const action = incomingAction as KnownAction;
    switch (action.type) {
        case 'FILE_SELECTED':
            return {
                inputFilename: action.filename,
                inputMimeType: action.mimeType,
                inputFile: action.file,
                outputFormat: state.outputFormat,
                doOcr: state.doOcr,
                outputFilename: '',
                downloadUrl: '',
                message: ''
            };
        case 'OUTPUT_FORMAT_SELECTED':
            return {
                inputFilename: state.inputFilename,
                inputMimeType: state.inputMimeType,
                inputFile: state.inputFile,
                outputFormat: action.format,
                doOcr: state.doOcr,
                outputFilename: '',
                downloadUrl: '',
                message: ''
            };
        case 'DO_OCR_SELECTED':
            return {
                inputFilename: state.inputFilename,
                inputMimeType: state.inputMimeType,
                inputFile: state.inputFile,
                outputFormat: state.outputFormat,
                doOcr: action.selected,
                outputFilename: '',
                downloadUrl: '',
                message: ''
            };
        case 'CONVERT_DOCUMENT':
            return {
                inputFilename: state.inputFilename,
                inputMimeType: state.inputMimeType,
                inputFile: state.inputFile,
                outputFormat: state.outputFormat,
                doOcr: state.doOcr,
                outputFilename: '',
                downloadUrl: '',
                message: 'Processing document, please wait...'
            };
        case 'DOCUMENT_READY':
            return {
                inputFilename: '',
                inputMimeType: '',
                inputFile: null,
                outputFormat: state.outputFormat,
                doOcr: state.doOcr,
                outputFilename: action.filename,
                downloadUrl: action.downloadUrl,
                message: 'Document processed successfully:-)'
            };
        case 'CONVERSION_FAILED':
            return {
                inputFilename: '',
                inputMimeType: '',
                inputFile: null,
                outputFormat: state.outputFormat,
                doOcr: state.doOcr,
                outputFilename: '',
                downloadUrl: '',
                message: 'Sorry, an error occurred:-( ' + action.error
            };
        default:
            return state;
    }
};
