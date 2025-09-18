import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slices/user.slice";
import restaurantReducer from "./slices/restaurantSlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    restaurant: restaurantReducer,
  },
  devTools: true,
});

export default store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
