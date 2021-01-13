import * as Globals from './Globals';
import * as ApiInfo from './ApiInfo';
import * as DocumentProcess from './DocumentProcess';



// The top-level state object
export interface ApplicationState {
    globals: Globals.GlobalState | undefined;
    apiInfo: ApiInfo.ApiInfoState | undefined;
    docProcess: DocumentProcess.DocumentProcessState | undefined;
}

// Whenever an action is dispatched, Redux will update each top-level application state property using
// the reducer with the matching name. It's important that the names match exactly, and that the reducer
// acts on the corresponding ApplicationState property type.
export const reducers = {
    globals: Globals.reducer,
    apiInfo: ApiInfo.reducer,
    docProcess: DocumentProcess.reducer
};

// This type can be used as a hint on action creators so that its 'dispatch' and 'getState' params are
// correctly typed to match your store.
export interface AppThunkAction<TAction> {
    (dispatch: (action: TAction) => void, getState: () => ApplicationState): void;
}
