// client/src/store/slices/aiSlice.js
const { createSlice, createAsyncThunk } = require("@reduxjs/toolkit");
const { apiService } = require("@/services/api"); // CommonJS import

// ------------------------
// Async Thunks
// ------------------------

// Fetch AI insights
const fetchInsights = createAsyncThunk(
  "ai/fetchInsights",
  async (params, { rejectWithValue }) => {
    try {
      const res = await apiService.get("/ai/insights", params);
      return res;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch insights"
      );
    }
  }
);

// Mark an insight as read
const markInsightAsRead = createAsyncThunk(
  "ai/markInsightAsRead",
  async (id, { rejectWithValue }) => {
    try {
      const res = await apiService.post(`/ai/insights/${id}/read`);
      return res; // backend returns updated insight
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to mark insight as read"
      );
    }
  }
);

// ------------------------
// Initial State
// ------------------------
const initialState = {
  insights: [],
  isLoading: false,
  unreadCount: 0,
  error: undefined,
};

// ------------------------
// Slice
// ------------------------
const aiSlice = createSlice({
  name: "ai",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchInsights.pending, (state) => {
        state.isLoading = true;
        state.error = undefined;
      })
      .addCase(fetchInsights.fulfilled, (state, action) => {
        state.isLoading = false;
        state.insights = action.payload;
        state.unreadCount = action.payload.filter((i) => !i.isRead).length;
      })
      .addCase(fetchInsights.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(markInsightAsRead.fulfilled, (state, action) => {
        const index = state.insights.findIndex(
          (i) => i._id === action.payload._id
        );
        if (index !== -1) state.insights[index] = action.payload;
        state.unreadCount = state.insights.filter((i) => !i.isRead).length;
      })
      .addCase(markInsightAsRead.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

// ------------------------
// Exports
// ------------------------
module.exports = {
  reducer: aiSlice.reducer,
  fetchInsights,
  markInsightAsRead,
};
