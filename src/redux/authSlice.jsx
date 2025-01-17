import { createSlice } from "@reduxjs/toolkit";

const StorageUser = JSON.parse(localStorage.getItem("user"));
const StorageToken = localStorage.getItem("authToken");

const initialState = {
  user: StorageUser || null, // Holds user data
  isAuthenticated: !!StorageToken, // Tracks login status
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
    setAuthenticated: (state, action) => {
      state.isAuthenticated = action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
    },
  },
});

export const { setUser, setAuthenticated, logout } = authSlice.actions;
export default authSlice.reducer;
