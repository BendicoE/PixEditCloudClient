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
var GlobalsStore = require("../store/Globals");
// COMPONENT
var SignIn = /** @class */ (function (_super) {
    __extends(SignIn, _super);
    function SignIn() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.onFormSubmit = function () {
            _this.signOut();
        };
        return _this;
    }
    SignIn.prototype.render = function () {
        var handleSubmit = this.props.handleSubmit;
        return (React.createElement(React.Fragment, null,
            React.createElement("h1", null, "Sign Out'"),
            React.createElement("hr", null),
            React.createElement("div", null,
                React.createElement("form", { onSubmit: handleSubmit(this.onFormSubmit) },
                    React.createElement("div", { className: 'row' },
                        React.createElement("div", { className: 'input-group mb-3 col-sm-4' },
                            React.createElement("button", { type: 'submit', className: 'btn btn-outline-primary' }, "Sign Out")))))));
    };
    SignIn.prototype.signOut = function () {
        this.props.signOut();
    };
    return SignIn;
}(React.PureComponent));
exports.default = redux_form_1.reduxForm({
    form: 'sign-out-form'
})(react_redux_1.connect(function (state) { return state.globals; }, GlobalsStore.actionCreators)(SignIn));
//# sourceMappingURL=SignOut.js.map