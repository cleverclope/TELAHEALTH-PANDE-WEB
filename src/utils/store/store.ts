import {Action, combineReducers, configureStore, ThunkAction,} from '@reduxjs/toolkit';
import {persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER,} from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import {connectRouter} from 'connected-react-router';
import {createBrowserHistory} from "history";

import userSlice from "./slices/userSlice";

const persistedReducer = persistReducer(
    {key: 'root', version: 1, storage,},
    combineReducers({
        router: connectRouter(createBrowserHistory()),
        user: userSlice,
    })
)

export const store = configureStore({
    reducer: persistedReducer,
    devTools: true,
    middleware: (getDefaultMiddleware) => {
        return getDefaultMiddleware({serializableCheck: {ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],},});
    },
});
export const persistedStore = persistStore(store)

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>


export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, Action<string>>;
