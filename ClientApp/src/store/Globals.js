"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reducer = exports.actionCreators = exports.apiBaseUrl = void 0;
var axios_1 = require("axios");
exports.apiBaseUrl = 'https://pixeditservercloud.azure-api.net';
// ACTION CREATORS
exports.actionCreators = {
    signIn: function (username, password, serialNo) { return function (dispatch, getState) {
        var appState = getState();
        if (appState && appState.globals) {
            var url = exports.apiBaseUrl + '/Authenticate';
            axios_1.default.get(url, {
                headers: {
                    'Authorization': 'Basic ' + btoa(username + '+' + serialNo + ':' + password)
                }
            }).then(function (response) {
                dispatch({ type: 'SIGNED_IN', authToken: response.data });
            }, function (error) {
                dispatch({ type: 'SIGN_IN_FAILED', error: error });
            });
        }
    }; },
    signOut: function () { return function (dispatch, getState) {
        var appState = getState();
        if (appState && appState.globals) {
            dispatch({ type: 'SIGNED_OUT' });
        }
    }; }
};
// REDUCER
var unloadedState = {
    authToken: ''
};
exports.reducer = function (state, incomingAction) {
    if (state === undefined) {
        return unloadedState;
    }
    var action = incomingAction;
    switch (action.type) {
        case 'SIGNED_IN':
            return {
                authToken: action.authToken
            };
        case 'SIGN_IN_FAILED':
            return {
                authToken: ''
            };
        case 'SIGNED_OUT':
            return {
                authToken: ''
            };
        default:
            return state;
    }
};
//# sourceMappingURL=Globals.js.map