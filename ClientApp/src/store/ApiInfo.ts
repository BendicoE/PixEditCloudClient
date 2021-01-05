import { Action, Reducer } from 'redux';
import { AppThunkAction } from './';
import axios from 'axios';
import * as Globals from './Globals';

// STATE

export interface ApiInfoState {
    apiInfo: ApiInfo;
}

export interface ApiInfo {
    appName: string;
    appVersion: string;
    publishedDate: string;
    unavailable: boolean;
}

// ACTIONS

interface ReceiveApiInfoAction {
    type: 'RECEIVE_API_INFO';
    apiInfo: ApiInfo;
}

type KnownAction = ReceiveApiInfoAction;

// ACTION CREATORS

export const actionCreators = {
    requestApiInfo: (): AppThunkAction<KnownAction> => (dispatch, getState) => {
        const appState = getState();
        if (appState && appState.apiInfo) {
            const url = Globals.apiBaseUrl + '/';
            axios.get(url)
                .then((response) => {
                    dispatch({ type: 'RECEIVE_API_INFO', apiInfo: { appName: response.data.appName, appVersion: response.data.appVersion, publishedDate: response.data.publishedDate, unavailable: false } });
                }, (error) => {
                    dispatch({ type: 'RECEIVE_API_INFO', apiInfo: { appName: '-', appVersion: '-', publishedDate: '-', unavailable: true } });    
                });
        }
    }
};

// REDUCER

const unloadedState: ApiInfoState = {
    apiInfo: { appName: '', appVersion: '', publishedDate: '', unavailable: false }
};

export const reducer: Reducer<ApiInfoState> = (state: ApiInfoState | undefined, incomingAction: Action): ApiInfoState => {
    if (state === undefined) {
        return unloadedState;
    }

    const action = incomingAction as KnownAction;
    switch (action.type) {
        case 'RECEIVE_API_INFO':
            return {
                apiInfo: action.apiInfo
            };
        default:
            return state;
    }
};
