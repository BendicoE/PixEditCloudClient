"use strict";
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
var react_router_1 = require("react-router");
var react_router_dom_1 = require("react-router-dom");
var AuthRoute = function (props) {
    var authToken = props.authToken;
    var curPath = react_router_dom_1.useLocation().pathname;
    if (authToken && curPath == '/sign-in')
        return React.createElement(react_router_1.Redirect, { to: '/convert-document' });
    else if (!authToken && curPath == '/convert-document')
        return React.createElement(react_router_1.Redirect, { to: '/sign-in' });
    else if (!authToken && curPath == '/sign-out')
        return React.createElement(react_router_1.Redirect, { to: '/' });
    return React.createElement(react_router_1.Route, __assign({}, props));
};
exports.default = react_redux_1.connect(function (state) { return state.globals; })(AuthRoute);
//# sourceMappingURL=AuthRoute.js.map