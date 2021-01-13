import { Action, Reducer } from 'redux';
import { AppThunkAction } from '.';
import axios from 'axios';
import * as Globals from './Globals';

// STATE

export interface PagePreview {
    pageNo: number;
    imageData: string;
}

export interface DocumentProcessState {
    mode: string;
    inputFilename: string;
    inputMimeType: string;
    inputFile: File | null;
    outputFormat: string;
    doOcr: boolean;
    outputFilename: string;
    downloadUrl: string;
    pixSize: number;
    pagePreviews: PagePreview[] | null;
    message: string;
}

// ACTIONS

interface ModeSelectedAction {
    type: 'MODE_SELECTED';
    mode: string;
}

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

interface PixSizeSelectedAction {
    type: 'PIXSIZE_SELECTED';
    pixSize: number;
}

interface PreviewDocumentAction {
    type: 'PREVIEW_DOCUMENT';
}

interface PreviewReadyAction {
    type: 'PREVIEW_READY';
    pagePreviews: PagePreview[];
}

interface ProcessFailedAction {
    type: 'PROCESS_FAILED';
    error: string;
}


type KnownAction =
    ModeSelectedAction |
    FileSelectedAction |
    OutputFormatSelectedAction |
    DoOcrSelectedAction |
    ConvertDocumentAction |
    DocumentReadyAction |
    PixSizeSelectedAction |
    PreviewDocumentAction |
    PreviewReadyAction |
    ProcessFailedAction;

// ACTION CREATORS

export const actionCreators = {
    selectMode: (mode: string): AppThunkAction<KnownAction> => (dispatch, getState) => {
        const appState = getState();
        if (appState && appState.docProcess) {
            dispatch({ type: 'MODE_SELECTED', mode: mode });
        }
    },

    selectFile: (filename: string, mimeType: string, file: File): AppThunkAction<KnownAction> => (dispatch, getState) => {
        const appState = getState();
        if (appState && appState.docProcess) {
            dispatch({ type: 'FILE_SELECTED', filename: filename, mimeType: mimeType, file: file });
        }
    },

    selectOutputFormat: (format: string): AppThunkAction<KnownAction> => (dispatch, getState) => {
        const appState = getState();
        if (appState && appState.docProcess) {
            dispatch({ type: 'OUTPUT_FORMAT_SELECTED', format: format });
        }
    },

    selectDoOcr: (selected: boolean): AppThunkAction<KnownAction> => (dispatch, getState) => {
        const appState = getState();
        if (appState && appState.docProcess) {
            dispatch({ type: 'DO_OCR_SELECTED', selected: selected });
        }
    },

    convertDocument: (): AppThunkAction<KnownAction> => (dispatch, getState) => {
        const appState = getState();
        if (appState && appState.docProcess) {
            dispatch({ type: 'CONVERT_DOCUMENT' });
            const url = Globals.apiBaseUrl + '/Convert';
            const data = new FormData();
            if (appState.docProcess.inputFile != null) {
                data.append('file', new Blob([appState.docProcess.inputFile], { type: appState.docProcess.inputMimeType }), appState.docProcess.inputFilename);
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
                                'Format': appState.docProcess ? appState.docProcess.outputFormat : '',
                                'OCR': appState.docProcess ? appState.docProcess.doOcr : false
                            }
                        }).then((response) => {
                            let respFilename = response.headers["content-disposition"].split("filename=")[1].split(";")[0];
                            respFilename = respFilename.replace(/^"+|"+$/g, '');
                            let respMimeType = response.headers["content-type"];
                            const url = window.URL.createObjectURL(new Blob([response.data], { type: respMimeType }));
                            dispatch({ type: 'DOCUMENT_READY', filename: respFilename, downloadUrl: url });
                        }, (error) => {
                            dispatch({ type: 'PROCESS_FAILED', error: error });
                        });
                    }
                };
                reader.readAsDataURL(appState.docProcess.inputFile);
            }
        }
    },

    selectPixSize: (pixSize: number): AppThunkAction<KnownAction> => (dispatch, getState) => {
        const appState = getState();
        if (appState && appState.docProcess) {
            dispatch({ type: 'PIXSIZE_SELECTED', pixSize: pixSize });
        }
    },

    previewDocument: (): AppThunkAction<KnownAction> => (dispatch, getState) => {
        const appState = getState();
        if (appState && appState.docProcess) {
            dispatch({ type: 'PREVIEW_DOCUMENT' });
            const url = Globals.apiBaseUrl + '/Preview';
            const data = new FormData();
            if (appState.docProcess.inputFile != null) {
                data.append('file', new Blob([appState.docProcess.inputFile], { type: appState.docProcess.inputMimeType }), appState.docProcess.inputFilename);
                const reader = new window.FileReader();
                reader.onloadend = () => {
                    if (appState.globals) {
                        axios.post(url, data, {
                            headers: {
                                'Authorization': 'Bearer ' + appState.globals.authToken,
                                'Accept': 'application/json'
                            },
                            params: {
                                'PixSize': appState.docProcess ? appState.docProcess.pixSize : 100
                            }
                        }).then((response) => {
                            dispatch({ type: 'PREVIEW_READY', pagePreviews: response.data });
                        }, (error) => {
                            dispatch({ type: 'PROCESS_FAILED', error: error });
                        });
                    }
                };
                reader.readAsDataURL(appState.docProcess.inputFile);
            }
        }
    }
};

// REDUCER

const unloadedState: DocumentProcessState = {
    mode: 'convert',
    inputFilename: '',
    inputMimeType: '',
    inputFile: null,
    outputFormat: 'pdfa1b',
    doOcr: false,
    outputFilename: '',
    downloadUrl: '',
    pixSize: 100,
    pagePreviews: null,
    message: ''
};

export const reducer: Reducer<DocumentProcessState> = (state: DocumentProcessState | undefined, incomingAction: Action): DocumentProcessState => {
    if (state === undefined) {
        return unloadedState;
    }

    const action = incomingAction as KnownAction;
    switch (action.type) {
        case 'MODE_SELECTED':
            return {
                mode: action.mode,
                inputFilename: state.inputFilename,
                inputMimeType: state.inputMimeType,
                inputFile: state.inputFile,
                outputFormat: state.outputFormat,
                doOcr: state.doOcr,
                outputFilename: state.outputFilename,
                downloadUrl: state.downloadUrl,
                pixSize: state.pixSize,
                pagePreviews: state.pagePreviews,
                message: state.message
            };
        case 'FILE_SELECTED':
            return {
                mode: state.mode,
                inputFilename: action.filename,
                inputMimeType: action.mimeType,
                inputFile: action.file,
                outputFormat: state.outputFormat,
                doOcr: state.doOcr,
                outputFilename: '',
                downloadUrl: '',
                pixSize: state.pixSize,
                pagePreviews: null,
                message: ''
            };
        case 'OUTPUT_FORMAT_SELECTED':
            return {
                mode: state.mode,
                inputFilename: state.inputFilename,
                inputMimeType: state.inputMimeType,
                inputFile: state.inputFile,
                outputFormat: action.format,
                doOcr: state.doOcr,
                outputFilename: '',
                downloadUrl: '',
                pixSize: state.pixSize,
                pagePreviews: state.pagePreviews,
                message: ''
            };
        case 'DO_OCR_SELECTED':
            return {
                mode: state.mode,
                inputFilename: state.inputFilename,
                inputMimeType: state.inputMimeType,
                inputFile: state.inputFile,
                outputFormat: state.outputFormat,
                doOcr: action.selected,
                outputFilename: '',
                downloadUrl: '',
                pixSize: state.pixSize,
                pagePreviews: state.pagePreviews,
                message: ''
            };
        case 'CONVERT_DOCUMENT':
            return {
                mode: state.mode,
                inputFilename: state.inputFilename,
                inputMimeType: state.inputMimeType,
                inputFile: state.inputFile,
                outputFormat: state.outputFormat,
                doOcr: state.doOcr,
                outputFilename: '',
                downloadUrl: '',
                pixSize: state.pixSize,
                pagePreviews: null,
                message: 'Processing document, please wait...'
            };
        case 'DOCUMENT_READY':
            return {
                mode: state.mode,
                inputFilename: state.inputFilename,
                inputMimeType: state.inputMimeType,
                inputFile: state.inputFile,
                outputFormat: state.outputFormat,
                doOcr: state.doOcr,
                outputFilename: action.filename,
                downloadUrl: action.downloadUrl,
                pixSize: state.pixSize,
                pagePreviews: state.pagePreviews,
                message: 'Document processed successfully:-)'
            };
        case 'PIXSIZE_SELECTED':
            return {
                mode: state.mode,
                inputFilename: state.inputFilename,
                inputMimeType: state.inputMimeType,
                inputFile: state.inputFile,
                outputFormat: state.outputFormat,
                doOcr: state.doOcr,
                outputFilename: state.outputFilename,
                downloadUrl: state.downloadUrl,
                pixSize: action.pixSize,
                pagePreviews: null,
                message: ''
            };
        case 'PREVIEW_DOCUMENT':
            return {
                mode: state.mode,
                inputFilename: state.inputFilename,
                inputMimeType: state.inputMimeType,
                inputFile: state.inputFile,
                outputFormat: state.outputFormat,
                doOcr: state.doOcr,
                outputFilename: '',
                downloadUrl: '',
                pixSize: state.pixSize,
                pagePreviews: null,
                message: 'Processing document, please wait...'
            };
        case 'PREVIEW_READY':
            return {
                mode: state.mode,
                inputFilename: state.inputFilename,
                inputMimeType: state.inputMimeType,
                inputFile: state.inputFile,
                outputFormat: state.outputFormat,
                doOcr: state.doOcr,
                outputFilename: state.outputFilename,
                downloadUrl: state.downloadUrl,
                pixSize: state.pixSize,
                pagePreviews: action.pagePreviews,
                message: ''
            };

        case 'PROCESS_FAILED':
            return {
                mode: state.mode,
                inputFilename: state.inputFilename,
                inputMimeType: state.inputMimeType,
                inputFile: state.inputFile,
                outputFormat: state.outputFormat,
                doOcr: state.doOcr,
                outputFilename: '',
                downloadUrl: '',
                pixSize: state.pixSize,
                pagePreviews: null,
                message: 'Sorry, an error occurred:-( ' + action.error
            };
        default:
            return state;
    }
};
