// import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
// import axios from "axios";
// import { baseUrl } from "../utils/service";

// const initState = {
//   history: [],
//   fetching: false,
//   error: null,
// };

// export const fetchHistory = createAsyncThunk(
//   "history/fetchHistory",
//   async (_, { rejectWithValue }) => {
//     console.log("start to fetch");
//     try {
//       const response = await axios.get(
//         `${baseUrl}/hr/get-registration-history`,
//         {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem("authToken")}`,
//           },
//         }
//       );
//       return response.data.history;
//     } catch (error) {
//       return rejectWithValue(error.response?.data || error.message);
//     }
//   }
// );

// export const addHistory = createAsyncThunk(
//     "history/addHistory",
//     async (email, { dispatch, rejectWithValue }) => {
//       try {
//         // Send email request to backend
//         await axios.post(`${baseUrl}/hr/send-registration-email`, { email });

//         // Optionally fetch updated history after adding
//         // await dispatch(fetchHistory());

//         // Return the added email to update state immediately (optional)
//         return { email, registrationStatus: "unsubmitted" };
//       } catch (error) {
//         return rejectWithValue(error.response?.data || error.message); // Handle error
//       }
//     }
//   );

// export const historySlice = createSlice({
//   name: "history",
//   initialState: initState,
//   reducers: {
//     resetError: (state) => {
//       state.error = null;
//     },
//   },
//   extraReducers: {
//     [fetchHistory.pending]: (state, action) => {
//       state.fetching = true;
//       state.error = null;
//     },
//     [fetchHistory.fulfilled]: (state, action) => {
//       state.fetching = false;
//       state.history = action.payload;
//     },
//     [fetchHistory.rejected]: (state, action) => {
//       state.fetching = false;
//       state.error = action.payload;
//     },
//   },
// });

// export const { resetError } = historySlice.actions;

// export default historySlice.reducer;
