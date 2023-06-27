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
    OpenDoc = 4,
    MicrosoftWord = 5,
    MicrosoftExcel = 6,
    EPUB = 7,
    MicrosoftPowerPoint = 8
};

export enum ExportLayout {
    ExportNoLayout = 'No Layout',
    ExportFlowing = 'Flowing',
    ExportEditable = 'Editable',
    ExportExact = 'Exact'
}

export enum ExportLayoutEnum {
    NoLayout = 0,
    Flowing = 1,
    Editable = 2,
    Exact = 3
};

export interface SearchScore {
    text: string;
    category: string;
    startIndex: number;
    endIndex: number;
}

export interface PageTextSearchResult {
    pageIndex: number;
    rawText: string;
    scores: SearchScore[];
}

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
    previewAllPages: boolean;
    pagePreviews: PagePreview[] | null;
    searchResults: PageTextSearchResult[] | null;
    removeBlackBorders: boolean,
    removePunchHoles: boolean,
    removeBlankPages: boolean,
    autoOrientation: boolean,
    deskew: boolean,
    enhanceText: boolean,
    documentSeparationType: DocumentSeparationType,
    exportFormat: ExportFormat,
    exportLayout: ExportLayout,
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

interface PreviewAllPagesSelectedAction {
    type: 'PREVIEWALLPAGES_SELECTED';
    previewAllPages: boolean;
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

interface ExportFormatSelectedAction {
    type: 'EXPORT_FORMAT_SELECTED';
    format: ExportFormat;
}

interface ExportLayoutSelectedAction {
    type: 'EXPORT_LAYOUT_SELECTED';
    layout: ExportLayout;
}

interface ProcessDocumentAction {
    type: 'PROCESS_DOCUMENT';
}

interface ProcessFailedAction {
    type: 'PROCESS_FAILED';
    error: string;
}

interface SearchTextCategoriesAction {
    type: 'SEARCH_TEXT_CATEGORIES';
}

interface SearchReadyAction {
    type: 'SEARCH_READY';
    searchResults: PageTextSearchResult[];
}


type KnownAction =
    ModeSelectedAction |
    FileSelectedAction |
    OutputFormatSelectedAction |
    ConvertDocumentAction |
    DocumentReadyAction |
    PixSizeSelectedAction |
    PreviewAllPagesSelectedAction |
    PreviewDocumentAction |
    PreviewReadyAction |
    OperationSelectedAction |
    DocumentSeparationTypeSelectedAction |
    ExportFormatSelectedAction |
    ExportLayoutSelectedAction |
    ProcessDocumentAction |
    SearchTextCategoriesAction |
    SearchReadyAction |
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
            if (filename.toLowerCase().endsWith('.heic') && mimeType == '')
                mimeType = 'image/heic';
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
                case 'removePunchHoles':
                case 'removeBlankPages':
                case 'autoOrientation':
                case 'deskew':
                case 'enhanceText':
                    dispatch({ type: 'OPERATION_SELECTED', id: id, selected: selected });
                    break;
                case 'previewAllPages':
                    dispatch({ type: 'PREVIEWALLPAGES_SELECTED', previewAllPages: selected });
                    break;
            }
        }
    },

    convertDocument: (): AppThunkAction<KnownAction | Globals.KnownAction> => (dispatch, getState) => {
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
                                'Accept': 'application/pdf, application/json, text/plain'
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
                        }).catch(async (error) => {
                                if (error.response && error.response.status === 401) {
                                    dispatch({ type: 'PROCESS_FAILED', error: '' });
                                    dispatch({ type: 'SIGNED_OUT' });
                                }
                                else {
                                    dispatch({ type: 'PROCESS_FAILED', error: error.response.data && error.response.data.text ? await error.response.data.text() : '' });
                                }
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

    previewDocument: (): AppThunkAction<KnownAction | Globals.KnownAction> => (dispatch, getState) => {
        const appState = getState();
        if (appState && appState.docProcess) {
            dispatch({ type: 'PREVIEW_DOCUMENT' });
            const url = Globals.apiBaseUrl + '/Preview';
            const data = new FormData();
            if (appState.docProcess.inputFile != null) {
                var blob = new Blob([appState.docProcess.inputFile], { type: appState.docProcess.inputMimeType });
                data.append('file', blob, appState.docProcess.inputFilename);
                const reader = new window.FileReader();
                reader.onloadend = () => {
                    if (appState.globals) {
                        axios.post(url, data, {
                            headers: {
                                'Authorization': 'Bearer ' + appState.globals.authToken,
                                'Accept': 'application/json'
                            },
                            params: {
                                'PixSize': appState.docProcess ? appState.docProcess.pixSize * 2 : 200,
                                'MaxPages': appState.docProcess ? (appState.docProcess.previewAllPages ? -1 : 1) : 1
                            }
                        }).then((response) => {
                            dispatch({ type: 'PREVIEW_READY', pagePreviews: response.data });
                        }).catch(async (error) => {
                                if (error.response && error.response.status === 401) {
                                    dispatch({ type: 'PROCESS_FAILED', error: '' });
                                    dispatch({ type: 'SIGNED_OUT' });
                                }
                                else {
                                    dispatch({ type: 'PROCESS_FAILED', error: error.response.data ? await error.response.data : '' });
                                }
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

    processDocument: (): AppThunkAction<KnownAction | Globals.KnownAction> => (dispatch, getState) => {
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
                if (appState.docProcess.removePunchHoles)
                    jobSpec += cmdRemovePunchHoles();
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
                        }).catch(async (error) => {
                                if (error.response && error.response.status === 401) {
                                    dispatch({ type: 'PROCESS_FAILED', error: '' });
                                    dispatch({ type: 'SIGNED_OUT' });
                                }
                                else {
                                    dispatch({ type: 'PROCESS_FAILED', error: error.response.data && error.response.data.text ? await error.response.data.text() : '' });
                                }
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

    selectExportLayout: (layout: ExportLayout): AppThunkAction<KnownAction> => (dispatch, getState) => {
        const appState = getState();
        if (appState && appState.docProcess) {
            dispatch({ type: 'EXPORT_LAYOUT_SELECTED', layout: layout });
        }
    },

    exportDocument: (): AppThunkAction<KnownAction | Globals.KnownAction> => (dispatch, getState) => {
        const appState = getState();
        if (appState && appState.docProcess) {
            dispatch({ type: 'PROCESS_DOCUMENT' });
            const url = Globals.apiBaseUrl + '/Process';
            const data = new FormData();
            if (appState.docProcess.inputFile != null) {
                let jobSpec = cmdJobTicketHeader();
                jobSpec += cmdConvertProperties();
                jobSpec += cmdRemoveBlackBorders();
                jobSpec += cmdRemovePunchHoles();
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

                var ocrExportLayout;
                switch (appState.docProcess.exportLayout as string) {
                    default:
                    case 'ExportNoLayout':
                        ocrExportLayout = ExportLayoutEnum.NoLayout;
                        break;
                    case 'ExportFlowing':
                        ocrExportLayout = ExportLayoutEnum.Flowing;
                        break;
                    case 'ExportEditable':
                        ocrExportLayout = ExportLayoutEnum.Editable;
                        break;
                    case 'ExportExact':
                        ocrExportLayout = ExportLayoutEnum.Exact;
                        break;
                }


                jobSpec += cmdOcrExport(ocrExportFormat, ocrExportLayout);
                jobSpec += cmdJobTicketFooter();

                data.append('file', new Blob([jobSpec], { type: 'application/json' }), 'jobspec.json');
                data.append('file', new Blob([appState.docProcess.inputFile], { type: appState.docProcess.inputMimeType }), appState.docProcess.inputFilename);
                const reader = new window.FileReader();
                reader.onloadend = () => {
                    if (appState.globals) {
                        axios.post(url, data, {
                            responseType: 'blob',
                            headers: {
                                'Authorization': 'Bearer ' + appState.globals.authToken
                            }
                        }).then((response) => {
                            let respFilename = response.headers["content-disposition"].split("filename=")[1].split(";")[0];
                            respFilename = respFilename.replace(/^"+|"+$/g, '');
                            let respMimeType = response.headers["content-type"];
                            const url = (window.URL || window.webkitURL).createObjectURL(new Blob([response.data], { type: respMimeType }));
                            dispatch({ type: 'DOCUMENT_READY', filename: respFilename, downloadUrl: url });
                        }).catch(async (error) => {
                                if (error.response && error.response.status === 401) {
                                    dispatch({ type: 'PROCESS_FAILED', error: '' });
                                    dispatch({ type: 'SIGNED_OUT' });
                                }
                                else {
                                    dispatch({ type: 'PROCESS_FAILED', error: error.response.data && error.response.data.text ? await error.response.data.text() : '' });
                                }
                        });
                    }
                };
                reader.readAsDataURL(appState.docProcess.inputFile);
            }
        }
    },

    searchTextCategories: (): AppThunkAction<KnownAction | Globals.KnownAction> => (dispatch, getState) => {
        const appState = getState();
        if (appState && appState.docProcess) {
            dispatch({ type: 'SEARCH_TEXT_CATEGORIES' });
            const url = Globals.apiBaseUrl + '/SearchTextCategories';
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
                            }
                        }).then((response) => {
                            dispatch({ type: 'SEARCH_READY', searchResults: response.data });
                        }).catch(async (error) => {
                            if (error.response && error.response.status === 401) {
                                dispatch({ type: 'PROCESS_FAILED', error: '' });
                                dispatch({ type: 'SIGNED_OUT' });
                            }
                            else {
                                dispatch({ type: 'PROCESS_FAILED', error: error.response.data ? await error.response.data : '' });
                            }
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
    previewAllPages: true,
    pagePreviews: null,
    removeBlackBorders: true,
    removePunchHoles: true,
    removeBlankPages: true,
    autoOrientation: true,
    deskew: true,
    enhanceText: false,
    documentSeparationType: 'None' as DocumentSeparationType,
    exportFormat: ExportFormat.MSWord,
    exportLayout: ExportLayout.ExportFlowing,
    searchResults: null,
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
                searchResults: null,
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
        case 'PREVIEWALLPAGES_SELECTED':
            return {
                ...state,
                previewAllPages: action.previewAllPages,
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
                removePunchHoles: action.id === 'removePunchHoles' ? action.selected : state.removePunchHoles,
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
        case 'EXPORT_LAYOUT_SELECTED':
            return {
                ...state,
                exportLayout: action.layout,
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
        case 'SEARCH_TEXT_CATEGORIES':
            return {
                ...state,
                outputFilename: '',
                downloadUrl: '',
                pagePreviews: null,
                isProcessing: true,
                message: 'Processing document, please wait...'
            };
        case 'SEARCH_READY':
            return {
                ...state,
                searchResults: action.searchResults,
                isProcessing: false,
                message: ''
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
