import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface User {
  _id: string;
  full_name: string;
  user_name: string;
  email: string;
  user_type: string;
  createdAt: string;
  updatedAt: string;
  profile_url: string | null;
  __v: number;
}

interface AuthState {
  currentUser: User | null;
  token: string;
  profile_url: string | null;
}

const initialState: AuthState = {
  currentUser: null,
  token: "",
  profile_url: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setProfileURL: (state, action: PayloadAction<{ profile_url: string }>) => {
      state.profile_url = action.payload.profile_url;
    },
    login: (state, action: PayloadAction<{ user: User; token: string }>) => {
      state.currentUser = action.payload.user;
      state.token = action.payload.token;
      state.profile_url = action.payload.user.profile_url;
    },
    logout: (state) => {
      state.currentUser = null;
      state.token = "";
      localStorage.removeItem("fcmToken");
      state.profile_url = null;
    },
  },
});

export const { login, logout, setProfileURL } = authSlice.actions;
export default authSlice.reducer;
