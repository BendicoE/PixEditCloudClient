import { Action, Reducer } from 'redux';
import { AppThunkAction } from './';
import axios from 'axios';
import packageJson from '../../package.json';

export const appVersion = packageJson.version;

//export const apiBaseUrl: string = 'https://api.pixeditcloud.com';
export const apiBaseUrl: string = 'https://pdfconvertmicroservice2.azurewebsites.net/convertpdf';


export interface GlobalState {
    authToken: string;
    signInError: any;
}

// ACTIONS

interface SignedInAction {
    type: 'SIGNED_IN';
    authToken: string;
}

interface SignInFailedAction {
    type: 'SIGN_IN_FAILED';
    error: any;
}

interface SignedOutAction {
    type: 'SIGNED_OUT';
}

export type KnownAction = SignedInAction | SignInFailedAction | SignedOutAction;

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
            }).catch ((error) => {
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
    authToken: '',
    signInError: undefined
};

export const reducer: Reducer<GlobalState> = (state: GlobalState | undefined, incomingAction: Action): GlobalState => {
    if (state === undefined) {
        return unloadedState;
    }

    const action = incomingAction as KnownAction;
    switch (action.type) {
        case 'SIGNED_IN':
            return {
                authToken: action.authToken,
                signInError: undefined
            };
        case 'SIGN_IN_FAILED':
            return {
                authToken: '',
                signInError: action.error
            };
        case 'SIGNED_OUT':
            return {
                authToken: '',
                signInError: undefined 
            };
        default:
            return state;
    }
};
