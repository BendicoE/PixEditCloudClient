﻿const cmdJobTicketHeader = () => `
{
    "$type": "DocProcessProfile",
    "ID": "dc3095cd-0409-4935-9aa9-bd15be3b417b",
    "Name": "Job Ticket",
    "Description": null,
    "commands": [
`;

const cmdRemoveBlackBorders = () => `
        {
            "$type": "RemoveBlackBorders",
            "CmdName": "Remove Black Borders",
            "Crop": true,
            "MaxDeskewAngle": 4
        },
`;

const cmdRemovePunchHoles = () => `
        {
            "$type": "RemovePunchHoles",
            "CmdName": "Remove Punch Holes"
        },
`;

const cmdRemoveBlankPages = () => `
        {
            "$type": "RemoveBlankPages",
            "CmdName": "Remove Blank Pages",
            "Graphics": 0.06,
            "LeftTopMargins": "5, 5",
            "RightBottomMargins": "5, 5"
        },
`;
    
const cmdAutoOrientation = () => `
        {
            "$type": "AutoOrientation",
            "CmdName": "Auto Orientation"
        },
`;

const cmdDeskew = () => `
        {
            "$type": "Deskew",
            "CmdName": "Deskew",
            "MaxDeskewAngle": 4,
            "DetectBackgroundColor": false
        },
`;

// Color images only
const cmdAutoReduceColors = () => `
        {
            "$type": "AutoReduceColors",
            "CmdName": "Auto Reduce Colors",
            "GraySensitivity": 2.0,
            "MonoSensitivity": 2.0,
            "IgnoreColorCast": true,
            "DetectSmallColorAreas": false,
            "Use16Grays": false,
            "FixedThreshold": -1
        },
`;

const cmdEraseBorders = () => `
        {
            "$type": "EraseBorders",
            "CmdName": "Erase Borders",
            "LeftBorder": 3.0,
            "TopBorder": 3.0,
            "RightBorder": 3.0,
            "BottomBorder": 3.0
        },
`;

const cmdTurn = () => `
        {
            "$type": "Turn",
            "CmdName": "Turn Document",
            "TType": 0
        },
`;

const cmdEnhanceContrast = () => `
        {
            "$type": "EnhanceContrast",
            "CmdName": "Enhance Contrast",
            "ClipPercent": 0.01
        },
`;

const cmdSplitBooklet = () => `
        {
            "$type": "SplitBooklet",
            "CmdName": "Split Booklet",
            "SplitDirection": 1
        },
`;

const cmdOcr = () => `
        {
            "$type": "OCR",
            "CmdName": "Text Recognition(Ocr)",
            "LargeObjectsFilter": 30,
            "ExportOcrTextFile": false,
            "ExportRemoveLinefeed": false,
            "ExportPageSeparator": "- Page {0} -",
            "ExportOnly": false,
            "OCRTimeout": 0
        },
`;

const cmdSplitPages = () => `
        {
            "$type": "SplitPages",
            "CmdName": "Split Document Pages",
            "PageSplitType": 1,
            "SplitPosition": 0.0,
            "SplitDirection": 0
        },
`;

const cmdSeparationGenericBarcodes = () => `
        {
            "$type": "SeparationGenericBarcodes",
            "CmdName": "Document Separation Generic Barcodes",
            "BarcodeType": 1,
            "IncludeBarcodePage": false,
            "NumberOfBarcodes": 1,
            "BarcodeSeparator": "_",
            "Threshold": 170,
            "ThrowErrorWhenNoSeparationSheet": true,
            "RequiredCharacters": "",
            "RemoveCharacters": true,
            "ReplaceChars": {
                "$type": "ReplaceCharInBarcode",
                "ReplaceCharOriginal": "",
                "ReplaceCharWith": ""
            }
        },
`;

const cmdSeparationSIBarcodes = () => `
        {
            "$type": "SeparationSIBarcodes",
            "CmdName": "Document Separation Tieto Barcodes",
            "AttachmentKeyWord": "00000",
            "RequiredCharacters": "",
            "RemoveCharacters": false,
            "BarcodeType": 1,
            "IncludeBarcodePage": false,
            "NumberOfBarcodes": 3,
            "BarcodeSeparator": "_",
            "Threshold": 170,
            "ThrowErrorWhenNoSeparationSheet": true,
            "ReplaceChars": {
                "$type": "ReplaceCharInBarcode",
                "ReplaceCharOriginal": "",
                "ReplaceCharWith": ""
            }
        },
`;

const cmdSeparationTechSoftSepSheets = () => `
        {
            "$type": "SeparationTechSoftSepSheets",
            "CmdName": "Document Separation PixEdit Barcodes",
            "Threshold": 170,
            "AddIncrementingNumber": false,
            "ThrowErrorWhenNoSeparationSheet": true
        },
`;

const cmdSeparationEphorteSepSheets = () => `
        {
            "$type": "SeparationEphorteSepSheets",
            "CmdName": "Document Separation Elements Barcodes",
            "Threshold": 170,
            "RemoveBlankPage": true,
            "SearchInAllDirections": false,
            "SepWithQr": false,
            "IncludeQRPage": false,
            "AddUniqueSeparationCode": 0,
            "AddUniqueSeparationCodeInt": 0,
            "ThrowErrorWhenNoSeparationSheet": true,
            "SeparateMainDocument": "sephoveddok",
            "SeparateSubDocument": "sepvedlegg"
        },
`;

const cmdSeparationAcosSepSheets = () => `
        {
            "$type": "SeparationAcosSepSheets",
            "CmdName": "Document Separation Acos Barcodes",
            "Threshold": 170,
            "RemoveBlankPage": true,
            "SearchInAllDirections": false,
            "SepWithQr": false,
            "IncludeQRPage": false,
            "AddUniqueSeparationCode": 0,
            "AddUniqueSeparationCodeInt": 0,
            "ThrowErrorWhenNoSeparationSheet": true,
            "SeparateMainDocument": "ACOSH",
            "SeparateSubDocument": "ACOSV"
        },
`;

const cmdSeparationUDI = () => `
        {
            "$type": "SeparationUDI",
            "CmdName": "Immigration authorities separation sheets",
            "Threshold": 170,
            "SearchInAllDirections": false,
            "ThrowErrorWhenNoSeparationSheet": true
        },
`;

const cmdSeparationBlankSheets = () => `
        {
            "$type": "SeparationBlankSheets",
            "CmdName": "Document Separation blank sheets",
            "ExcludeBorder": 5.0,
            "DoubleBlank": true
        },
`;

const cmdSeparationFixedPageCount = () => `
        {
            "$type": "SeparationFixedPageCount",
            "CmdName": "Document Separation fixed page count",
            "PageCount": 1
        },
`;

const cmdSeparationQRCodes = () => `
        {
            "$type": "SeparationQRCodes",
            "CmdName": "Document Separation QR-Codes",
            "Threshold": 128,
            "IncludeQRCodePage": false,
            "OriginalFilename": false,
            "RequiredCharacters": "",
            "RemoveCharacters": true
        },
`;

const cmdCombineDocObject = () => `
        {
            "$type": "CombineDocObject",
            "CombinedDocList": [],
            "CmdName": "Merge Documents",
            "Title": null,
            "PageNumbering": false
        },
`;

// Color images only
const cmdBrightnessAndContrast = () => `
        {
            "$type": "BrightnessAndContrast",
            "CmdName": "Brightness And Contrast",
            "Brightness": 0.0,
            "Contrast": 0.0
        },
`;

const cmdAutoCrop = () => `
        {
            "$type": "AutoCrop",
            "CmdName": "Automatic Crop",
            "LeftTopMargins": "0, 0",
            "RightBottomMargins": "0, 0",
            "WhiteColorTolerance": 25.0
        },
`;

const cmdCropHalfPageSize = () => `
        {
            "$type": "CropHalfPageSize",
            "CmdName": "Crop Half Page Size"
        },
`;

const cmdScaleDownPages = () => `
        {
            "$type": "ScaleDownPages",
            "CmdName": "Scale Down Pages",
            "DPI": 96
        },
`;

const cmdResizeToStandardPageSize = () => `
        {
            "$type": "ResizeToStandardPageSize",
            "CmdName": "Resize to standard page sizes",
            "MaximumDeviation": 5.0,
            "ResizeImage": false
        },
`;

// Black & white images only
const cmdRemovePixelNoise = () => `
        {
            "$type": "RemovePixelNoise",
            "CmdName": "Remove Pixel Noise",
            "FilterType": 1,
            "NoiseMinSize": 0,
            "NoiseMaxSize": 4
        },
`;

// Black & white images only
const cmdDespeckle = () => `
        {
            "$type": "Despeckle",
            "CmdName": "Despeckle",
            "DespeckleType": 1,
            "Density": 1.0,
            "Distance": 8
        },
`;

// Color images only
const cmdMedianFilter = () => `
        {
            "$type": "MedianFilter",
            "CmdName": "Median Filter"
        },
`;

// Color images only
const cmdImageToning = (
    dodgeLevel: number = 20,
    dodgePct: number = 100,
    darkestBkGnd: number = 100,
    dodgeToBkGnd: boolean = true,
    burnLevel: number = 20,
    burnPct: number = 100,
    lightestForeGnd: number = 100,
    burnToForeGnd: boolean = true) => `
        {
            "$type": "ImageToning",
            "CmdName": "Image Toning",
            "DodgeLevel": ${dodgeLevel},
            "DodgePct": ${dodgePct},
            "DarkestBkGnd": ${darkestBkGnd},
            "DodgeToBkGnd": ${dodgeToBkGnd},
            "BurnLevel": ${burnLevel},
            "BurnPct": ${burnPct},
            "LightestForeGnd": ${lightestForeGnd},
            "BurnToForeGnd": ${burnToForeGnd}
        },
`;

// Color images only

const cmdColorDropout = () => `
        {
            "$type": "ColorDropout",
            "CmdName": "Color Dropout",
            "Color": "Red",
            "ColorTolerance": 10.0
        },
`;

const cmdDocStamp = () => `
        {
            "$type": "DocStamp",
            "CmdName": "Document stamp",
            "StampText": "",
            "FontSize": 11,
            "TextColor": "Black",
            "TextColorString": "#FF000000",
            "StampPosition": 4,
            "DateFormat": 0,
            "FirstPageOnly": false,
            "Transparency": 0.0,
            "FontBold": false,
            "FontItalic": false
        },
`;

const cmdSaveProperties = () => `
        {
            "$type": "SaveProperties",
            "CmdName": "Save to Output Directory",
            "FileFormat": 0,
            "ImageQuality": 85.0,
            "AlternativeSavePath": "",
            "DocnameFormat": 0,
            "AddOriginalFileExtention": false,
            "Prefix": "",
            "Suffix": "",
            "IncrementStartNumber": 0,
            "Digits": 4,
            "Recompress": false,
            "CheckBlankDoc": false,
            "MovePdfAVerifiedFiles": true
        },
`;

const cmdConvertProperties = () => `
        {
            "$type": "ConvertProperties",
            "CmdName": "Open/Convert Document",
            "TrackWordchanges": 2,
            "Showmarkup": 0,
            "UnlinkFillinFields": false,
            "WordResourceFolder": "",
            "WordOpenConvertDelay": 0,
            "ExcelPageorientation": 1,
            "SaveOutlookAttachments": true,
            "ReplaceLinksWithText": false,
            "AutomaticMsOffTimeout": true,
            "OfficeAppTimeout": 120,
            "ThrowOutlookAttachmentError": true,
            "ProgUsedHtmlconversion": 0,
            "ThrowZipDocumentError": true,
            "AutoCADuninitLayout": 0,
            "UseAcadCustomSettings": false,
            "CustomAcadsettings": {
                "$type": "CustomAcadSettings",
                "Papersize": 3,
                "Orientation": 0,
                "PlotArea": 0,
                "Scale": 0,
                "FitToPaper": true,
                "ScaleLineWeights": false,
                "CenterPlot": true,
                "PlotLineWeights": true,
                "PaperspaceLast": true
            },
            "PDFRenderingDpi": 300,
            "PDFRetainDpi": true,
            "PDFSmoothText": false,
            "PDFTimeoutSeconds": 1200,
            "PDFIgnoreCollection": true,
            "VerifyPDFA1b": false,
            "VerifyPDFA2b": false,
            "VerifyPDFA3b": false,
            "ZipArchiveMergeContent": true,
            "XPSDigitalRender": true,
            "CustomFileTypes": " "
        },
`;

const cmdOcrExport = (format: number, layout: number) => `
        {
            "$type": "OCRExport",
            "CmdName": "Export Document",
            "ExportFileFormat": ${format},
            "CharacterEncoding": 0,
            "Layout": ${layout},
            "CompressionQuality": 5,
            "OutputImageResolution": 300.0,
            "RecognizeColorMode": 3,
            "PageSizes": [1, 2, 6, 11, 12, 16],
            "BookmarksEnabled": false,
            "SpreadsheetLayout": 0,
            "PresentationLayout": 0,
            "MetadataTitle": "PixEdit Cloud OCR Export",
            "MetadataAuthor": "",
            "MetadataSubject": "",
            "MetadataKeywords": "",
            "MetadataCompany": "",
            "MetadataManager": "",
            "MetadataCategory": "",
            "MetadataComment": "",
            "MetadataDescription": "",
            "PdfVersion": 0,
            "PdfType": 0,
            "PdfEmbedFonts": true,
            "PdfUseHeaderFooter": false,
            "PdfBookmarksHeaderFooterFilePath": "",
            "PdfUseLinearization": false,
            "PdfProtectOpen": false,
            "PdfDocumentOpenPassword": "",
            "PdfProtectEdit": false,
            "PdfPrintingAllowed": 2,
            "PdfChangesAllowed": 0,
            "PdfBitonalFormat": 5,
            "PdfColorFormat":  2,
            "PdfEnableCopying": true,
            "PdfEnableTextAccess": true,
            "PdfChangePermissionPassword": "",
            "PdfEncrypt": false,
            "PdfIssuerData": "",
            "PdfSerialNumberData": "",
            "PdfPageDisplay": 0
       },
`;

const cmdRedactDocument = (
    redactionType: number,
    searchType: number,
    phrases: string[],
    regularExpressions: string[],
    piiEntityCategories: number[],
    entityCategories: number[],
    regexEntities: number[],
    aiQueries: string[]) => `
    {
      "$type": "RedactDocument",
      "CmdName": "Redact Document",
      "SearchType": ${searchType},
      "RedactionType": ${redactionType},
      "RegularExpressions": [
          ${regularExpressions}
      ],
      "Phrases": [
          ${phrases}
      ],
      "PiiEntityCategories": [
          ${piiEntityCategories}
      ],
      "EntityCategories": [
          ${entityCategories}
      ],
      "RegexEntities": [
          ${regexEntities}
      ],
      "AiQueries": [
          ${aiQueries}
      ]
    },
`;

const cmdtypRegularExpression = (name: string, expression: string, flags: string) =>
`
    {
        "$type": "SearchExpression",
        "Name": "${name}",
        "Expression": "${expression}",
        "Flags": "${flags}"
    },
`;

const cmdtypPhrase = (phrase: string, ignoreCase: boolean) =>
`
    {
        "$type": "SearchPhrase",
        "Phrase": "${phrase}",
        "IgnoreCase": ${ignoreCase}
    },
`;

const cmdtypAiQuery = (name: string, query: string) =>
`
    {
        "$type": "AiQuery",
        "Name": "${name}",
        "Query": "${query}"
    },
`;


const cmdJobTicketFooter = () => `
    ]
}
`;


export {
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
    cmdRedactDocument,
    cmdtypPhrase,
    cmdtypRegularExpression,
    cmdtypAiQuery,
    cmdJobTicketFooter
}