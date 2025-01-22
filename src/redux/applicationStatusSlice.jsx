import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { baseUrl } from "../utils/service";
const initState = {
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
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchApplications.pending, (state, action) => {
        state.loading = true;
        state.error = null; // Clears error messages
      })
      .addCase(fetchApplications.fulfilled, (state, action) => {
        state.loading = false;
        state.pending = action.payload.pendingApplications;
        state.rejected = action.payload.rejectedApplications;
        state.approved = action.payload.approvedApplications;
      })
      .addCase(fetchApplications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetError } = applicationSlice.actions;

export default applicationSlice.reducer;
