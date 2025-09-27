// client/src/store/store.ts
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import healthReducer from "./slices/healthSlice";
import aiReducer from "./slices/aiSlice";
// import other slices here as needed

export const store = configureStore({
  reducer: {
    auth: authReducer,
    health: healthReducer,
    ai: aiReducer,
    // add other slices here
  },
});

// Type helpers for useSelector/useDispatch
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
