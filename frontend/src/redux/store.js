import { configureStore } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage"; // Local Storage use karne ke liye
import { persistReducer, persistStore } from "redux-persist";
import { combineReducers } from "redux";
import authReducer from "./authSlice";
import cartReducer from "./cartSlice";
import menuReducer from "./menuSlice";
import orderReducer from "./orderSlice";

// ✅ Combine Reducers for Persisting
const rootReducer = combineReducers({
  auth: authReducer,
  cart: cartReducer,
  menu: menuReducer,
  order: orderReducer,
});

// ✅ Redux Persist Configuration
const persistConfig = {
  key: "root",
  storage, // Local storage use ho raha hai
  whitelist: ["cart"], // Sirf cart persist hoga
};

// ✅ Persisted Reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// ✅ Store Configuration
const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Redux Persist ke liye zaroori
    }),
});

// ✅ Persistor (for PersistGate)
export const persistor = persistStore(store);
export default store;
