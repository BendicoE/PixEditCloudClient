"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reducer = exports.actionCreators = void 0;
var axios_1 = require("axios");
var Globals = require("./Globals");
// ACTION CREATORS
exports.actionCreators = {
    requestApiInfo: function () { return function (dispatch, getState) {
        var appState = getState();
        if (appState && appState.apiInfo) {
            var url = Globals.apiBaseUrl + '/';
            axios_1.default.get(url)
                .then(function (response) {
                dispatch({ type: 'RECEIVE_API_INFO', apiInfo: { appName: response.data.appName, appVersion: response.data.appVersion, publishedDate: response.data.publishedDate, unavailable: false } });
            }, function (error) {
                dispatch({ type: 'RECEIVE_API_INFO', apiInfo: { appName: '-', appVersion: '-', publishedDate: '-', unavailable: true } });
            });
        }
    }; }
};
// REDUCER
var unloadedState = {
    apiInfo: { appName: '-', appVersion: '-', publishedDate: '-', unavailable: false },
    isLoading: false
};
exports.reducer = function (state, incomingAction) {
    if (state === undefined) {
        return unloadedState;
    }
    var action = incomingAction;
    switch (action.type) {
        case 'REQUEST_API_INFO':
            return {
                apiInfo: state.apiInfo,
                isLoading: true
            };
        case 'RECEIVE_API_INFO':
            return {
                apiInfo: action.apiInfo,
                isLoading: false
            };
        default:
            return state;
    }
};
//# sourceMappingURL=ApiInfo.js.map