import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import applicationReducer from "./applicationStatusSlice";
// import historyReducer from "./registrationHistorySlice";

const store = configureStore({
  reducer: {
    auth: authReducer, // Add the auth slice
    applicationStatus: applicationReducer, // onboarding: onboardingReducer,
    // registrationHistory: historyReducer, // registrationHistorySlice
    // visaStatus: visaStatusReducer,
    // hrManagement: hrManagementReducer,
  },
});

export default store;
