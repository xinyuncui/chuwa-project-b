import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";

const store = configureStore({
  reducer: {
    auth: authReducer, // Add the auth slice
    // onboarding: onboardingReducer, 
    // visaStatus: visaStatusReducer, 
    // hrManagement: hrManagementReducer,
  },
});

export default store;
