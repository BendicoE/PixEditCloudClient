import { Action, Reducer } from 'redux';
import { AppThunkAction } from './';
import axios from 'axios';

// STATE

export interface DocumentProcessState {
    inputFilename: string;
    inputMimeType: string;
    inputFile: File;
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

interface ProcessDocumentAction {
    type: 'PROCESS_DOCUMENT';
    outputFormat: string;
    doOcr: boolean;
}

interface DocumentReadyAction {
    type: 'DOCUMENT_READY';
    filename: string;
    downloadUrl: string;
}

interface ProcessFailedAction {
    type: 'PROCESS_FAILED';
    error: string;
}

type KnownAction = FileSelectedAction | ProcessDocumentAction | DocumentReadyAction | ProcessFailedAction;

// ACTION CREATORS

export const actionCreators = {
    selectFile: (filename, mimeType, file): AppThunkAction<KnownAction> => (dispatch, getState) => {
        const appState = getState();
        if (appState && appState.docProcess) {
            dispatch({ type: 'FILE_SELECTED', filename: filename, mimeType: mimeType, file: file });
        }
    },

    processDocument: (outputFormat, doOcr): AppThunkAction<KnownAction> => (dispatch, getState) => {
        const appState = getState();
        if (appState && appState.docProcess) {
            dispatch({ type: 'PROCESS_DOCUMENT', outputFormat: outputFormat, doOcr: doOcr });
            const url = appState.globals.apiBaseUrl + '/Convert';
            const data = new FormData();
            data.append('file', new Blob([appState.docProcess.inputFile], { type: appState.docProcess.inputMimeType }), appState.docProcess.inputFilename);
            const reader = new window.FileReader();
            reader.onloadend = () => {
                axios.post(url, data, {
                    responseType: 'blob',
                    headers: {
                        'Authorization': 'Bearer ' + appState.globals.authToken,
                        'Accept': 'application/pdf, application/json'
                    },
                    params: {
                        'Format': outputFormat,
                        'OCR': doOcr
                    }
                }).then((response) => {
                    let respFilename = response.headers["content-disposition"].split("filename=")[1].split(";")[0];
                    respFilename = respFilename.replace(/^\"+|\"+$/g, '');
                    let respMimeType = response.headers["content-type"];
                    const url = window.URL.createObjectURL(new Blob([response.data], { type: respMimeType }));
                    dispatch({ type: 'DOCUMENT_READY', filename: respFilename, downloadUrl: url });
                }, (error) => {
                    dispatch({ type: 'PROCESS_FAILED', error: error });
                });
            };
            reader.readAsDataURL(appState.docProcess.inputFile);
        }
    }
};

// REDUCER

const unloadedState: DocumentProcessState = {
    inputFilename: null,
    inputMimeType: null,
    inputFile: null,
    outputFormat: 'pdfa1b',
    doOcr: false,
    outputFilename: null,
    downloadUrl: null,
    message: ''
};

export const reducer: Reducer<DocumentProcessState> = (state: DocumentProcessState | undefined, incomingAction: Action): DocumentProcessState => {
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
                outputFilename: null,
                downloadUrl: null,
                message: ''
            };
        case 'PROCESS_DOCUMENT':
            return {
                inputFilename: state.inputFilename,
                inputMimeType: state.inputMimeType,
                inputFile: state.inputFile,
                outputFormat: action.outputFormat,
                doOcr: action.doOcr,
                outputFilename: null,
                downloadUrl: null,
                message: 'Processing document, please wait...'
            };
        case 'DOCUMENT_READY':
            return {
                inputFilename: null,
                inputMimeType: null,
                inputFile: null,
                outputFormat: state.outputFormat,
                doOcr: state.doOcr,
                outputFilename: action.filename,
                downloadUrl: action.downloadUrl,
                message: 'Document processed successfully:-)'
            };
        case 'PROCESS_FAILED':
            return {
                inputFilename: null,
                inputMimeType: null,
                inputFile: null,
                outputFormat: state.outputFormat,
                doOcr: state.doOcr,
                outputFilename: null,
                downloadUrl: null,
                message: 'Sorry, an error occurred:-( ' + action.error
            };
        default:
            return state;
    }
};
