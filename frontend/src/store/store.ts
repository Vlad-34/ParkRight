import {
  configureStore,
  ThunkAction,
  Action,
  combineReducers,
} from "@reduxjs/toolkit";

import { authReducer } from "../auth";
import { loadState, saveState } from "./sessionStorage";
import { predictReducer } from "../client";
import { chatReducer } from "../chat";
import { statisticsReducer } from "../admin";

const persistedState = loadState();

export const store = configureStore({
  reducer: combineReducers({
    auth: authReducer,
    predict: predictReducer,
    chat: chatReducer,
    statistics: statisticsReducer,
  }),
  preloadedState: persistedState,
});

store.subscribe(() => {
  saveState(store.getState());
});

export type Store = typeof store;
export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
