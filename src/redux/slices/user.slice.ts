import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

type User = {
  _id: string;
  fullname: string;
  email: string;
  role: string;
  mobile: string;
  createdAt: string;
};

type Location = {
  city: string;
};

type UserState = {
  user: User | null;
  location: Location | null;
};

const initialState: UserState = {
  user: null,
  location: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
    },
    clearUser: (state) => {
      state.user = null;
    },
    updateUser: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },
    setLocation: (state, action: PayloadAction<Location>) => {
      state.location = action.payload;
    },
  },
});

export const { setUser, clearUser, updateUser, setLocation } =
  userSlice.actions;
export default userSlice.reducer;
