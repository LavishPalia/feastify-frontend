import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { User } from "./user.slice";

interface Restaurant {
  _id: string;
  name: string;
  image: string;
  owner: User;
  address: string;
  city: string;
  state: string;
  items: [];
  createdAt: string;
  updatedAt: string;
}

type RestaurantState = {
  restaurant: Restaurant | null;
};

const initialState: RestaurantState = {
  restaurant: null,
};

const restaurantSlice = createSlice({
  name: "restaurant",
  initialState,
  reducers: {
    setRestaurant: (state, action: PayloadAction<Restaurant>) => {
      state.restaurant = action.payload;
    },
    updateRestaurant: (state, action: PayloadAction<Partial<Restaurant>>) => {
      if (state.restaurant) {
        state.restaurant = { ...state.restaurant, ...action.payload };
      }
    },
  },
});

export const { setRestaurant, updateRestaurant } = restaurantSlice.actions;
export default restaurantSlice.reducer;
