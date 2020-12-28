import { Action, Reducer } from 'redux';
import { AppThunkAction } from './';
import axios from 'axios';

export const apiBaseUrl: string = 'https://pixeditservercloud.azure-api.net';
//export const apiBaseUrl: string = 'https://localhost:44321/convertpdf';

export interface GlobalState {
    authToken: string;
}

export interface Credentials {
    username: string;
    password: string;
    serialNo: string;
}

// ACTIONS

interface SignedInAction {
    type: 'SIGNED_IN';
    authToken: string;
}

interface SignInFailedAction {
    type: 'SIGN_IN_FAILED';
    error: string;
}

interface SignedOutAction {
    type: 'SIGNED_OUT';
}

type KnownAction = SignedInAction | SignInFailedAction | SignedOutAction;

// ACTION CREATORS

export const actionCreators = {
    signIn: (username: string, password: string, serialNo: string): AppThunkAction<KnownAction> => (dispatch, getState) => {
        const appState = getState();
        if (appState && appState.globals) {
            const url = apiBaseUrl + '/Authenticate';
            axios.get(url, {
                headers: {
                    'Authorization': 'Basic ' + btoa(username + '+' + serialNo + ':' + password)
                }
            }).then((response) => {
                dispatch({ type: 'SIGNED_IN', authToken: response.data });
            }, (error) => {
                dispatch({ type: 'SIGN_IN_FAILED', error: error });
            });
        }
    },
    signOut: (): AppThunkAction<KnownAction> => (dispatch, getState) => {
        const appState = getState();
        if (appState && appState.globals) {
            dispatch({ type: 'SIGNED_OUT' });
        }
    }
};

// REDUCER

const unloadedState: GlobalState = {
    authToken: ''
};

export const reducer: Reducer<GlobalState> = (state: GlobalState | undefined, incomingAction: Action): GlobalState => {
    if (state === undefined) {
        return unloadedState;
    }

    const action = incomingAction as KnownAction;
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
