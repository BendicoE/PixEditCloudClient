import { Action, Reducer } from 'redux';
import { AppThunkAction } from '.';
import axios from 'axios';
import * as Globals from './Globals';
import {
    cmdJobTicketHeader,
    cmdRemoveBlackBorders,
    cmdRemovePunchHoles,
    cmdRemoveBlankPages,
    cmdAutoOrientation,
    cmdDeskew,
    cmdAutoReduceColors,
    cmdEraseBorders,
    cmdTurn,
    cmdEnhanceContrast,
    cmdSplitBooklet,
    cmdOcr,
    cmdSplitPages,
    cmdSeparationGenericBarcodes,
    cmdSeparationSIBarcodes,
    cmdSeparationTechSoftSepSheets,
    cmdSeparationEphorteSepSheets,
    cmdSeparationAcosSepSheets,
    cmdSeparationUDI,
    cmdSeparationBlankSheets,
    cmdSeparationFixedPageCount,
    cmdSeparationQRCodes,
    cmdCombineDocObject,
    cmdBrightnessAndContrast,
    cmdAutoCrop,
    cmdCropHalfPageSize,
    cmdScaleDownPages,
    cmdResizeToStandardPageSize,
    cmdRemovePixelNoise,
    cmdDespeckle,
    cmdMedianFilter,
    cmdImageToning,
    cmdColorDropout,
    cmdDocStamp,
    cmdSaveProperties,
    cmdConvertProperties,
    cmdOcrExport,
    cmdJobTicketFooter
} from './ProcessCommands';

// STATE

export interface PagePreview {
    pageNo: number;
    imageData: string;
}

export interface Enum {
    [id: string]: string
}

export enum OutputFormat {
    PDFA1B = 'PDF/A-1b',
    PDFA2B = 'PDF/A-2b',
    PDFA3B = 'PDF/A-3b',
    PDF = 'PDF',
    TIFF = 'TIFF'
}

export enum DocumentSeparationType {
    None = 'No Separation',
    QRCodes = 'QR-Codes',
    GenericType39 = 'Generic (Type39)',
    BlankSheets = 'Blank Sheets'
}

export enum ExportFormat {
    MSWord = 'Microsoft Word (DOCX)',
    MSExcel = 'Microsoft Excel (XLSX)',
    MSPowerPoint = 'Microsoft PowerPoint (PPTX)'
}

export enum ExportFormatEnum {
    PlainText = 0,
    HTML = 1,
    RTF = 2,
    PDF = 3,
    CSV = 4,
    WordML = 5,
    ExcelML = 6,
    OpenDoc = 7,
    OpenXML = 8,
    MicrosoftWord = 9,
    MicrosoftExcel = 10,
    EPUB = 11,
    MicrosoftPowerPoint = 12
};


export interface DocumentProcessState {
    mode: string;
    inputFilename: string;
    inputMimeType: string;
    inputFile: File | null;
    outputFormat: OutputFormat;
    doOcr: boolean;
    outputFilename: string;
    downloadUrl: string;
    pixSize: number;
    pagePreviews: PagePreview[] | null;
    removeBlackBorders: boolean,
    removeBlankPages: boolean,
    autoOrientation: boolean,
    deskew: boolean,
    enhanceText: boolean,
    documentSeparationType: DocumentSeparationType,
    exportFormat: ExportFormat,
    isProcessing: boolean,
    message: string
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
    format: OutputFormat;
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

interface OperationSelectedAction {
    type: 'OPERATION_SELECTED';
    id: string;
    selected: boolean;
}

interface DocumentSeparationTypeSelectedAction {
    type: 'DOCUMENT_SEPARATION_TYPE_SELECTED';
    separationType: DocumentSeparationType;
}

interface DExportFormatSelectedAction {
    type: 'EXPORT_FORMAT_SELECTED';
    format: ExportFormat;
}

interface ProcessDocumentAction {
    type: 'PROCESS_DOCUMENT';
}

interface ProcessFailedAction {
    type: 'PROCESS_FAILED';
    error: string;
}


type KnownAction =
    ModeSelectedAction |
    FileSelectedAction |
    OutputFormatSelectedAction |
    ConvertDocumentAction |
    DocumentReadyAction |
    PixSizeSelectedAction |
    PreviewDocumentAction |
    PreviewReadyAction |
    OperationSelectedAction |
    DocumentSeparationTypeSelectedAction |
    DExportFormatSelectedAction |
    ProcessDocumentAction |
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

    selectOutputFormat: (format: OutputFormat): AppThunkAction<KnownAction> => (dispatch, getState) => {
        const appState = getState();
        if (appState && appState.docProcess) {
            dispatch({ type: 'OUTPUT_FORMAT_SELECTED', format: format });
        }
    },

    selectOption: (id: string, selected: boolean): AppThunkAction<KnownAction> => (dispatch, getState) => {
        const appState = getState();
        if (appState && appState.docProcess) {
            switch (id) {
                case 'doOcr':
                case 'removeBlackBorders':
                case 'removeBlankPages':
                case 'autoOrientation':
                case 'enhanceText':
                    dispatch({ type: 'OPERATION_SELECTED', id: id, selected: selected });
                    break;
            }
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
                            const url = (window.URL || window.webkitURL).createObjectURL(new Blob([response.data], { type: respMimeType }));
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
    },

    selectDocumentSeparationType: (separationType: DocumentSeparationType): AppThunkAction<KnownAction> => (dispatch, getState) => {
        const appState = getState();
        if (appState && appState.docProcess) {
            dispatch({ type: 'DOCUMENT_SEPARATION_TYPE_SELECTED', separationType: separationType });
        }
    },

    processDocument: (): AppThunkAction<KnownAction> => (dispatch, getState) => {
        const appState = getState();
        if (appState && appState.docProcess) {
            dispatch({ type: 'PROCESS_DOCUMENT' });
            const url = Globals.apiBaseUrl + '/Process';
            const data = new FormData();
            if (appState.docProcess.inputFile != null) {
                let jobSpec = cmdJobTicketHeader();
                jobSpec += cmdConvertProperties();
                if (appState.docProcess.removeBlackBorders)
                    jobSpec += cmdRemoveBlackBorders();
                if (appState.docProcess.removeBlankPages)
                    jobSpec += cmdRemoveBlankPages();
                if (appState.docProcess.autoOrientation)
                    jobSpec += cmdAutoOrientation();
                if (appState.docProcess.deskew)
                    jobSpec += cmdDeskew();
                if (appState.docProcess.enhanceText)
                    jobSpec += cmdImageToning();
                if (appState.docProcess.doOcr)
                    jobSpec += cmdOcr();

                switch (appState.docProcess.documentSeparationType as string) {
                    default:
                    case 'None':
                        break;
                    case 'QRCodes':
                        jobSpec += cmdSeparationQRCodes();
                        break;
                    case 'GenericType39':
                        jobSpec += cmdSeparationGenericBarcodes();
                        break;
                    case 'BlankSheets':
                        jobSpec += cmdSeparationBlankSheets();
                        break;
                }
                jobSpec += cmdSaveProperties();
                jobSpec += cmdJobTicketFooter();
                data.append('file', new Blob([jobSpec], { type: 'application/json'}), 'jobspec.json');
                data.append('file', new Blob([appState.docProcess.inputFile], { type: appState.docProcess.inputMimeType }), appState.docProcess.inputFilename);
                const reader = new window.FileReader();
                reader.onloadend = () => {
                    if (appState.globals) {
                        axios.post(url, data, {
                            responseType: 'blob',
                            headers: {
                                'Authorization': 'Bearer ' + appState.globals.authToken,
                                'Accept': 'application/pdf, application/zip, application/json'
                            }
                        }).then((response) => {
                            let respFilename = response.headers["content-disposition"].split("filename=")[1].split(";")[0];
                            respFilename = respFilename.replace(/^"+|"+$/g, '');
                            let respMimeType = response.headers["content-type"];
                            const url = (window.URL || window.webkitURL).createObjectURL(new Blob([response.data], { type: respMimeType }));
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

    selectExportFormat: (format: ExportFormat): AppThunkAction<KnownAction> => (dispatch, getState) => {
        const appState = getState();
        if (appState && appState.docProcess) {
            dispatch({ type: 'EXPORT_FORMAT_SELECTED', format: format });
        }
    },

    exportDocument: (): AppThunkAction<KnownAction> => (dispatch, getState) => {
        const appState = getState();
        if (appState && appState.docProcess) {
            dispatch({ type: 'PROCESS_DOCUMENT' });
            const url = Globals.apiBaseUrl + '/Process';
            const data = new FormData();
            if (appState.docProcess.inputFile != null) {
                let jobSpec = cmdJobTicketHeader();
                jobSpec += cmdConvertProperties();
                jobSpec += cmdRemoveBlackBorders();
                jobSpec += cmdAutoOrientation();
                jobSpec += cmdDeskew();
                jobSpec += cmdImageToning(undefined, undefined, undefined, undefined, undefined, undefined, 150, undefined);

                var ocrExportFormat;
                switch (appState.docProcess.exportFormat as string) {
                    default:
                    case 'MSWord':
                        ocrExportFormat = ExportFormatEnum.MicrosoftWord;
                        break;
                    case 'MSExcel':
                        ocrExportFormat = ExportFormatEnum.MicrosoftExcel;
                        break;
                    case 'MSPowerPoint':
                        ocrExportFormat = ExportFormatEnum.MicrosoftPowerPoint;
                        break;
                }
                jobSpec += cmdOcrExport(ocrExportFormat);
                jobSpec += cmdJobTicketFooter();

                data.append('file', new Blob([jobSpec], { type: 'application/json' }), 'jobspec.json');
                data.append('file', new Blob([appState.docProcess.inputFile], { type: appState.docProcess.inputMimeType }), appState.docProcess.inputFilename);
                const reader = new window.FileReader();
                reader.onloadend = () => {
                    if (appState.globals) {
                        axios.post(url, data, {
                            responseType: 'blob',
                            headers: {
                                'Authorization': 'Bearer ' + appState.globals.authToken,
                                'Accept': 'application/vnd.openxmlformats-officedocument.wordprocessinml.document, application/vnd.openxmlformats-officedocument.presentationml.presentation, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
                            }
                        }).then((response) => {
                            let respFilename = response.headers["content-disposition"].split("filename=")[1].split(";")[0];
                            respFilename = respFilename.replace(/^"+|"+$/g, '');
                            let respMimeType = response.headers["content-type"];
                            const url = (window.URL || window.webkitURL).createObjectURL(new Blob([response.data], { type: respMimeType }));
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


};

// REDUCER

const unloadedState: DocumentProcessState = {
    mode: 'convert',
    inputFilename: '',
    inputMimeType: '',
    inputFile: null,
    outputFormat: OutputFormat.PDFA1B,
    doOcr: false,
    outputFilename: '',
    downloadUrl: '',
    pixSize: 100,
    pagePreviews: null,
    removeBlackBorders: true,
    removeBlankPages: true,
    autoOrientation: true,
    deskew: true,
    enhanceText: false,
    documentSeparationType: 'None' as DocumentSeparationType,
    exportFormat: ExportFormat.MSWord,
    isProcessing: false,
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
                ...state,
                mode: action.mode,
                outputFilename: '',
                downloadUrl: '',
                pagePreviews: null,
                message: ''
            };
        case 'FILE_SELECTED':
            return {
                ...state,
                inputFilename: action.filename,
                inputMimeType: action.mimeType,
                inputFile: action.file,
                outputFilename: '',
                downloadUrl: '',
                pagePreviews: null,
                message: ''
            };
        case 'OUTPUT_FORMAT_SELECTED':
            return {
                ...state,
                outputFormat: action.format,
                outputFilename: '',
                downloadUrl: '',
                message: ''
            };
        case 'CONVERT_DOCUMENT':
            return {
                ...state,
                outputFilename: '',
                downloadUrl: '',
                pagePreviews: null,
                isProcessing: true,
                message: 'Processing document, please wait...'
            };
        case 'DOCUMENT_READY':
            return {
                ...state,
                outputFilename: action.filename,
                downloadUrl: action.downloadUrl,
                isProcessing: false,
                message: 'Document processed successfully:-)'
            };
        case 'PIXSIZE_SELECTED':
            return {
                ...state,
                pixSize: action.pixSize,
                pagePreviews: null,
                message: ''
            };
        case 'PREVIEW_DOCUMENT':
            return {
                ...state,
                outputFilename: '',
                downloadUrl: '',
                pagePreviews: null,
                isProcessing: true,
                message: 'Processing document, please wait...'
            };
        case 'PREVIEW_READY':
            return {
                ...state,
                pagePreviews: action.pagePreviews,
                isProcessing: false,
                message: ''
            };
        case 'OPERATION_SELECTED':
            return {
                ...state,
                doOcr: action.id === 'doOcr' ? action.selected : state.doOcr,
                removeBlackBorders: action.id === 'removeBlackBorders' ? action.selected : state.removeBlackBorders,
                removeBlankPages: action.id === 'removeBlankPages' ? action.selected : state.removeBlankPages,
                autoOrientation: action.id === 'autoOrientation' ? action.selected : state.autoOrientation,
                deskew: action.id === 'deskew' ? action.selected : state.deskew,
                enhanceText: action.id === 'enhanceText' ? action.selected : state.enhanceText,
                outputFilename: '',
                downloadUrl: '',
                message: ''
            };
        case 'DOCUMENT_SEPARATION_TYPE_SELECTED':
            return {
                ...state,
                documentSeparationType: action.separationType,
                outputFilename: '',
                downloadUrl: '',
                message: ''
            };
        case 'EXPORT_FORMAT_SELECTED':
            return {
                ...state,
                exportFormat: action.format,
                outputFilename: '',
                downloadUrl: '',
                message: ''
            };
        case 'PROCESS_DOCUMENT':
            return {
                ...state,
                outputFilename: '',
                downloadUrl: '',
                pagePreviews: null,
                isProcessing: true,
                message: 'Processing document, please wait...'
            };
        case 'PROCESS_FAILED':
            return {
                ...state,
                outputFilename: '',
                downloadUrl: '',
                pagePreviews: null,
                isProcessing: false,
                message: 'Sorry, an error occurred:-( ' + action.error
            };
        default:
            return state;
    }
};
