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
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var react_redux_1 = require("react-redux");
var redux_1 = require("redux");
var redux_form_1 = require("redux-form");
var GlobalsStore = require("../store/Globals");
// COMPONENT
var required = function (value) { return (value ? undefined : '*Required'); };
var SignIn = /** @class */ (function (_super) {
    __extends(SignIn, _super);
    function SignIn() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.renderField = function (_a) {
            var input = _a.input, label = _a.label, type = _a.type, colClass = _a.colClass, _b = _a.meta, touched = _b.touched, error = _b.error, warning = _b.warning;
            return (React.createElement("div", { className: colClass },
                React.createElement("div", { className: 'w-100' },
                    React.createElement("input", __assign({}, input, { placeholder: label, type: type, className: 'form-control' }))),
                React.createElement("div", null, touched &&
                    ((error && React.createElement("span", { className: 'text-danger' }, error)) ||
                        (warning && React.createElement("span", { className: 'text-warning' }, warning))))));
        };
        _this.onFormSubmit = function (formValues) {
            _this.signIn(formValues.username, formValues.password, formValues.serialNo);
        };
        return _this;
    }
    SignIn.prototype.render = function () {
        var handleSubmit = this.props.handleSubmit;
        return (React.createElement(React.Fragment, null,
            React.createElement("h1", null, "Sign In"),
            React.createElement("hr", null),
            React.createElement("div", null,
                React.createElement("form", { onSubmit: handleSubmit(this.onFormSubmit), autoComplete: 'on' },
                    React.createElement("div", { className: 'row' },
                        React.createElement(redux_form_1.Field, { name: 'username', component: this.renderField, type: 'text', colClass: 'input-group mb-3 col-sm-4', label: 'Username', validate: required }),
                        React.createElement(redux_form_1.Field, { name: 'password', component: this.renderField, type: 'password', colClass: 'input-group mb-3 col-sm-4', label: 'Password', validate: required }),
                        React.createElement(redux_form_1.Field, { name: 'serialNo', component: this.renderField, type: 'text', colClass: 'input-group mb-3 col-sm-4', label: 'Serial Number', validate: required })),
                    React.createElement("div", { className: 'row' },
                        React.createElement("div", { className: 'input-group mb-3 col-sm-4' },
                            React.createElement("button", { type: 'submit', className: 'btn btn-outline-primary' }, "Sign In"))))),
            React.createElement("div", null,
                React.createElement("p", null, this.props.signInError && this.props.signInError.response &&
                    (this.props.signInError.response.status == 401 ?
                        React.createElement("span", { className: 'text-danger' }, "Invalid user name, password and serial number combination :-(") :
                        React.createElement("span", { className: 'text-danger' },
                            "Sign in failed: ",
                            this.props.signInError.response.message))))));
    };
    SignIn.prototype.signIn = function (username, password, serialNo) {
        this.props.signIn(username, password, serialNo);
    };
    return SignIn;
}(React.PureComponent));
exports.default = redux_1.compose(react_redux_1.connect(function (state) { return state.globals; }, GlobalsStore.actionCreators), redux_form_1.reduxForm({
    form: 'sign-in-form'
}))(SignIn);
//# sourceMappingURL=SignIn.js.map