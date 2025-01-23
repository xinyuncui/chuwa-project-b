import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { baseUrl } from "../utils/service";

const initState = {
  all: [],
  pending: [],
  rejected: [],
  approved: [],
  loading: false,
  error: null,
};

export const fetchApplications = createAsyncThunk(
  "application/fetchApplications",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${baseUrl}/applications`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });
      console.log("fetch application status api successfully", response.data);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch data"
      );
    }
  }
);

const applicationSlice = createSlice({
  name: "application",
  initialState: initState,
  reducers: {
    resetError: (state) => {
      state.error = null; // Clears error messages
    },
    approveApplication: (state, action) => {
      const appId = action.payload;
      // find the approved application from pending list
      const approvedApp = state.pending.find((p) => p._id === appId);
      // remove the approved application from pending list and add it to approved list
      state.pending = state.pending.filter((p) => p._id !== appId);
      if (approvedApp) {
        state.approved.push(approvedApp);
      }
    },
    rejectApplication: (state, action) => {
      console.log(`Rejecting application ${action.payload}`);
      const appId = action.payload;
      console.log("Before update:", state.pending);
      // find the rejected application from pending list
      const rejectedApp = state.pending.find((p) => p._id === appId);
      // remove the rejected application from pending list and add it to rejected list

      if (rejectedApp) {
        state.pending = state.pending.filter((p) => p._id !== appId);
        console.log("After update:", state.pending);
        state.rejected.push(rejectedApp);
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchApplications.pending, (state, action) => {
        state.loading = true;
        state.error = null; // Clears error messages
      })
      .addCase(fetchApplications.fulfilled, (state, action) => {
        state.loading = false;
        state.all = action.payload.allApplications;
        state.pending = action.payload.pendingApplications;
        state.rejected = action.payload.rejectedApplications;
        state.approved = action.payload.approvedApplications;
        console.log("Redux store after fetching applications:", state.pending);
      })
      .addCase(fetchApplications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetError, approveApplication, rejectApplication } =
  applicationSlice.actions;

export default applicationSlice.reducer;
