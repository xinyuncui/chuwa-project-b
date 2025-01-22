import { createSlice } from "@reduxjs/toolkit";

// Retrieve user and token from localStorage
const StorageUser = JSON.parse(localStorage.getItem("user"));
const StorageToken = localStorage.getItem("authToken");

// Initial state with user, role, and authentication status
const initialState = {
  user: StorageUser || null, // Store user information
  role: StorageUser?.role || null, // Store user role
  isAuthenticated: !!StorageToken, // Check login status
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // Set user details, including role and authentication status
    setUser: (state, action) => {

      console.log("setUser action payload:", action.payload);
      const { user, token } = action.payload;

      state.user = user;
      state.role = user.role;
      state.isAuthenticated = !!token;

      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("authToken", token);

      console.log("Updated Redux state:", state);

    },

    // Update only the authentication status
    setAuthenticated: (state, action) => {
      state.isAuthenticated = action.payload; // Set authentication status
    },

    // Clear user data, role, and authentication status during logout
    logout: (state) => {
      state.user = null; // Reset user information
      state.role = null; // Clear role
      state.isAuthenticated = false; // Set authentication status to false

      // Remove user and token from localStorage
      localStorage.removeItem("user");
      localStorage.removeItem("authToken");
    },

    // update profile information
    updateProfile: (state, action) => {
      console.log("updateProfile action payload:", action.payload);
      const { updatedProfile } = action.payload;

      if (state.user) {
        state.user.profile = updatedProfile; // Update user profile if user exists
        console.log("profile", updatedProfile);
      } else {
        console.error("No user found in state to update profile.");
      }

    },
  },
});

export const { setUser, setAuthenticated, logout, updateProfile } =
  authSlice.actions;
export default authSlice.reducer;
