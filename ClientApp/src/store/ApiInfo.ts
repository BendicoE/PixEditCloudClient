import { Action, Reducer } from 'redux';
import { AppThunkAction } from './';
import axios from 'axios';

// STATE

export interface ApiInfoState {
    isLoading: boolean;
    apiInfo: ApiInfo;
}

export interface ApiInfo {
    appName: string;
    appVersion: string;
    publishedDate: string;
    unavailable: boolean;
}

// ACTIONS

interface RequestApiInfoAction {
    type: 'REQUEST_API_INFO';
}

interface ReceiveApiInfoAction {
    type: 'RECEIVE_API_INFO';
    apiInfo: ApiInfo;
}

type KnownAction = RequestApiInfoAction | ReceiveApiInfoAction;

// ACTION CREATORS

export const actionCreators = {
    requestApiInfo: (): AppThunkAction<KnownAction> => (dispatch, getState) => {
        const appState = getState();
        if (appState && appState.apiInfo) {
            const url = appState.globals.apiBaseUrl + '/';
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
    apiInfo: { appName: '-', appVersion: '-', publishedDate: '-', unavailable: false },
    isLoading: false
};

export const reducer: Reducer<ApiInfoState> = (state: ApiInfoState | undefined, incomingAction: Action): ApiInfoState => {
    if (state === undefined) {
        return unloadedState;
    }

    const action = incomingAction as KnownAction;
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
