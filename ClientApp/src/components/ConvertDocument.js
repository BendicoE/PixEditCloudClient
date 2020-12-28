"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var react_redux_1 = require("react-redux");
var redux_form_1 = require("redux-form");
var DocumentProcessStore = require("../store/DocumentProcess");
// COMPONENT
var ConvertDocument = /** @class */ (function (_super) {
    __extends(ConvertDocument, _super);
    function ConvertDocument() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.renderInputFile = function (_a) {
            var input = _a.input, type = _a.type;
            return (React.createElement("div", null,
                React.createElement("input", { id: 'inputFile', name: input.name, type: type, accept: 'application/pdf, application/zip, image/tiff, image/jpeg, image/png, application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document, \\\r\n                            application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-powerpoint, application/vnd.openxmlformats-officedocument.presentationml.presentation \\\r\n                            application/vnd.oasis.opendocument.text, application/vnd.ms-project, message/rfc822, application/vnd.ms-outlook ', onChange: function (event) { return _this.handleInputFileChange(event); } })));
        };
        _this.handleInputFileChange = function (event) {
            event.preventDefault();
            if (event.target && event.target.files) {
                var selectedFile = event.target.files[0];
                if (selectedFile) {
                    _this.props.selectFile(selectedFile.name, selectedFile.type, selectedFile);
                }
            }
        };
        _this.renderSelectOutputFormat = function (_a) {
            var input = _a.input;
            return (React.createElement("select", { id: 'selectOutputFormat', name: input.name, className: 'custom-select', onChange: function (event) { return _this.handleOutputFormatChange(event); } },
                React.createElement("option", { value: 'pdfa1b' }, "PDF/A-1b"),
                React.createElement("option", { value: 'pdfa2b' }, "PDF/A-2b"),
                React.createElement("option", { value: 'pdfa3b' }, "PDF/A-3b"),
                React.createElement("option", { value: 'pdf' }, "PDF")));
        };
        _this.handleOutputFormatChange = function (event) {
            if (event.target && event.target.value) {
                _this.props.selectOutputFormat(event.target.value);
            }
        };
        _this.renderCheckDoOcr = function (_a) {
            var input = _a.input, type = _a.type;
            return (React.createElement("div", null,
                React.createElement("input", { id: 'checkDoOcr', name: input.name, type: type, className: 'custom-control-input', onChange: function (event) { return _this.handleDoOcrChange(event); } }),
                React.createElement("label", { className: 'custom-control-label', htmlFor: 'checkDoOcr' }, "Recognize Text")));
        };
        _this.handleDoOcrChange = function (event) {
            if (event.target) {
                _this.props.selectDoOcr(event.target.checked);
            }
        };
        _this.onFormSubmit = function () {
            _this.props.processDocument();
        };
        return _this;
    }
    ConvertDocument.prototype.render = function () {
        var handleSubmit = this.props.handleSubmit;
        return (React.createElement(React.Fragment, null,
            React.createElement("h1", null, "Convert Document"),
            React.createElement("hr", null),
            React.createElement("div", null,
                React.createElement("form", { onSubmit: handleSubmit(this.onFormSubmit) },
                    React.createElement("div", { className: 'row' },
                        React.createElement("div", { className: 'input-group mb-3 col-sm-6' },
                            React.createElement("div", { className: 'custom-file' },
                                React.createElement(redux_form_1.Field, { name: 'file', type: 'file', component: this.renderInputFile }),
                                React.createElement("label", { className: 'custom-file-label', htmlFor: 'inputFile' }, this.props.inputFilename || 'Choose file')),
                            React.createElement("div", { className: 'input-group-append' },
                                React.createElement("button", { type: 'submit', className: 'btn btn-outline-primary' }, "Convert"))),
                        React.createElement("div", { className: 'input-group mb-3 col-sm-3' },
                            React.createElement(redux_form_1.Field, { name: 'outputFormat', component: this.renderSelectOutputFormat })),
                        React.createElement("div", { className: 'input-group mb-3 col-sm-3' },
                            React.createElement("div", { className: 'custom-control custom-checkbox' },
                                React.createElement(redux_form_1.Field, { name: 'doOcr', component: this.renderCheckDoOcr, type: 'checkbox', className: 'custom-control-input' })))))),
            React.createElement("div", null,
                React.createElement("p", null, this.props.message)),
            React.createElement("div", null,
                React.createElement("h2", null,
                    React.createElement("a", { href: this.props.downloadUrl || '', target: '_blank' }, this.props.outputFilename || '')))));
    };
    return ConvertDocument;
}(React.PureComponent));
function mapStateToProps(state) {
    return {
        inputFilename: state.docProcess ? state.docProcess.inputFilename : '',
        inputMimeType: state.docProcess ? state.docProcess.inputMimeType : '',
        inputFile: state.docProcess ? state.docProcess.inputFile : null,
        outputFormat: state.docProcess ? state.docProcess.outputFormat : '',
        doOcr: state.docProcess ? state.docProcess.doOcr : false,
        outputFilename: state.docProcess ? state.docProcess.outputFilename : '',
        downloadUrl: state.docProcess ? state.docProcess.downloadUrl : '',
        message: state.docProcess ? state.docProcess.message : '',
        initialvalues: state.docProcess
    };
}
exports.default = redux_form_1.reduxForm({
    form: 'upload-file-form'
})(react_redux_1.connect(mapStateToProps, DocumentProcessStore.actionCreators)(ConvertDocument));
//# sourceMappingURL=ConvertDocument.js.map