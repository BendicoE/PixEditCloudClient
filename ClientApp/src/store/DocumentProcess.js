"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reducer = exports.actionCreators = void 0;
var axios_1 = require("axios");
var Globals = require("./Globals");
// ACTION CREATORS
exports.actionCreators = {
    selectFile: function (filename, mimeType, file) { return function (dispatch, getState) {
        var appState = getState();
        if (appState && appState.docProcess) {
            dispatch({ type: 'FILE_SELECTED', filename: filename, mimeType: mimeType, file: file });
        }
    }; },
    selectOutputFormat: function (format) { return function (dispatch, getState) {
        var appState = getState();
        if (appState && appState.docProcess) {
            dispatch({ type: 'OUTPUT_FORMAT_SELECTED', format: format });
        }
    }; },
    selectDoOcr: function (selected) { return function (dispatch, getState) {
        var appState = getState();
        if (appState && appState.docProcess) {
            dispatch({ type: 'DO_OCR_SELECTED', selected: selected });
        }
    }; },
    processDocument: function () { return function (dispatch, getState) {
        var appState = getState();
        if (appState && appState.docProcess) {
            dispatch({ type: 'PROCESS_DOCUMENT' });
            var url_1 = Globals.apiBaseUrl + '/Convert';
            var data_1 = new FormData();
            if (appState.docProcess.inputFile != null) {
                data_1.append('file', new Blob([appState.docProcess.inputFile], { type: appState.docProcess.inputMimeType }), appState.docProcess.inputFilename);
                var reader = new window.FileReader();
                reader.onloadend = function () {
                    if (appState.globals) {
                        axios_1.default.post(url_1, data_1, {
                            responseType: 'blob',
                            headers: {
                                'Authorization': 'Bearer ' + appState.globals.authToken,
                                'Accept': 'application/pdf, application/json'
                            },
                            params: {
                                'Format': appState.docProcess ? appState.docProcess.outputFormat : '',
                                'OCR': appState.docProcess ? appState.docProcess.doOcr : false
                            }
                        }).then(function (response) {
                            var respFilename = response.headers["content-disposition"].split("filename=")[1].split(";")[0];
                            respFilename = respFilename.replace(/^\"+|\"+$/g, '');
                            var respMimeType = response.headers["content-type"];
                            var url = window.URL.createObjectURL(new Blob([response.data], { type: respMimeType }));
                            dispatch({ type: 'DOCUMENT_READY', filename: respFilename, downloadUrl: url });
                        }, function (error) {
                            dispatch({ type: 'PROCESS_FAILED', error: error });
                        });
                    }
                };
                reader.readAsDataURL(appState.docProcess.inputFile);
            }
        }
    }; }
};
// REDUCER
var unloadedState = {
    inputFilename: '',
    inputMimeType: '',
    inputFile: null,
    outputFormat: 'pdfa1b',
    doOcr: false,
    outputFilename: '',
    downloadUrl: '',
    message: ''
};
exports.reducer = function (state, incomingAction) {
    if (state === undefined) {
        return unloadedState;
    }
    var action = incomingAction;
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
        case 'PROCESS_DOCUMENT':
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
        case 'PROCESS_FAILED':
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
//# sourceMappingURL=DocumentProcess.js.map