import { combineReducers, compose, createStore } from 'redux';
import { persistReducer, persistStore } from 'redux-persist';
import AsyncStorage from 'redux-persist/lib/storage';

const initialState = {};
const persistConfig = {
    key: '__ROOT__',
    storage: AsyncStorage,
};
const rootReducer = combineReducers({
    myReducer: (state = {}, action) => ({ ...state, action }),
});
const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = createStore(
    persistedReducer,
    initialState,
    compose(),
);

const persistor = persistStore(store);

export { store, persistor };