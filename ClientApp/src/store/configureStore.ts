import { applyMiddleware, combineReducers, compose, createStore } from 'redux';
import thunk from 'redux-thunk';
import { connectRouter, routerMiddleware } from 'connected-react-router';
import { History } from 'history';
import { ApplicationState, reducers } from './';
import { reducer as formReducer } from 'redux-form';
import { persistStore, persistReducer } from 'redux-persist';
import { createBlacklistFilter } from 'redux-persist-transform-filter';
import storage from 'redux-persist/lib/storage';



export default function configureStore(history: History, initialState?: ApplicationState) {
    const middleware = [
        thunk,
        routerMiddleware(history)
    ];

    const blacklistFilter = createBlacklistFilter(
        'docProcess',
        ['inputFilename', 'outputFilename', 'inputFile', 'downloadUrl', 'pagePreviews', 'isProcessing', 'message']
    );

    const blacklistFilter2 = createBlacklistFilter(
        'globals',
        ['authToken']
    );

     const persistConfig = {
         key: 'root',
         storage: storage,
         whitelist: ['globals', 'docProcess'],
         transforms: [blacklistFilter, blacklistFilter2]
     }

    const rootReducer = combineReducers({
        ...reducers,
        form: formReducer,
        router: connectRouter(history)
    });
 
    const persistedReducer = persistReducer(persistConfig, rootReducer); // create a persisted reducer

    const enhancers = [];
    const windowIfDefined = typeof window === 'undefined' ? null : window as any;
    if (windowIfDefined && windowIfDefined.__REDUX_DEVTOOLS_EXTENSION__) {
        enhancers.push(windowIfDefined.__REDUX_DEVTOOLS_EXTENSION__());
    }

    const store = createStore(
        persistedReducer,
        initialState,
        compose(applyMiddleware(...middleware), ...enhancers)
    );

    const persistor = persistStore(store);

    return { store, persistor };
}
