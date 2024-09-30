

import { configureStore, combineReducers } from "@reduxjs/toolkit";
import userSlice from "./userSlice";
import messageSlice from "./messageSlice";
import commentSlice from "./commentSlice";
import {
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import chatSelectUserSlice from "./chatSelectUserSlice";
import socketSlice from "./socketSlice";
import chattingSlice from "./chattingSlice";
import RtNotificSlice from "./RtNotificSlice";

const persistConfig = {
  key: 'root',
  version: 2,
  storage,
}

const rootReducer = combineReducers({
  user: userSlice,
  message: messageSlice,
  comments: commentSlice,
  chatSelectedUser: chatSelectUserSlice,
  socketio: socketSlice,
  chat: chattingSlice,
  realTimeNotification: RtNotificSlice,
});

const persistedReducer = persistReducer(persistConfig, rootReducer)

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});
export default store;