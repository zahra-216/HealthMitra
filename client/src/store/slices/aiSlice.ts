// client/src/store/slices/aiSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

// ------------------------
// Types
// ------------------------
export interface InsightType {
  _id: string;
  title: string;
  type:
    | "health_risk"
    | "trend_analysis"
    | "medication_alert"
    | "general_advice";
  severity: "low" | "medium" | "high" | "critical";
  isRead: boolean;
  confidence: number;
  message: string;
  recommendations: string[];
  dataUsed: { dataType: string; value: string }[];
}

interface AIState {
  insights: InsightType[];
  isLoading: boolean;
  unreadCount: number;
  error?: string;
}

// ------------------------
// Initial State
// ------------------------
const initialState: AIState = {
  insights: [],
  isLoading: false,
  unreadCount: 0,
  error: undefined,
};

// ------------------------
// Async Thunks
// ------------------------

// Fetch AI insights
export const fetchInsights = createAsyncThunk<
  InsightType[],
  { severity?: string; isRead?: boolean },
  { rejectValue: string }
>("ai/fetchInsights", async (params, { rejectWithValue }) => {
  try {
    const res = await axios.get("/api/ai/insights", { params });
    return res.data;
  } catch (err: any) {
    return rejectWithValue(
      err.response?.data?.message || "Failed to fetch insights"
    );
  }
});

// Mark an insight as read
export const markInsightAsRead = createAsyncThunk<
  InsightType,
  string,
  { rejectValue: string }
>("ai/markInsightAsRead", async (id, { rejectWithValue }) => {
  try {
    const res = await axios.post(`/api/ai/insights/${id}/read`);
    return res.data; // backend returns updated insight
  } catch (err: any) {
    return rejectWithValue(
      err.response?.data?.message || "Failed to mark insight as read"
    );
  }
});

// ------------------------
// Slice
// ------------------------
const aiSlice = createSlice({
  name: "ai",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch insights
      .addCase(fetchInsights.pending, (state) => {
        state.isLoading = true;
        state.error = undefined;
      })
      .addCase(
        fetchInsights.fulfilled,
        (state, action: PayloadAction<InsightType[]>) => {
          state.isLoading = false;
          state.insights = action.payload;
          state.unreadCount = action.payload.filter((i) => !i.isRead).length;
        }
      )
      .addCase(fetchInsights.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Mark insight as read
      .addCase(
        markInsightAsRead.fulfilled,
        (state, action: PayloadAction<InsightType>) => {
          const index = state.insights.findIndex(
            (i) => i._id === action.payload._id
          );
          if (index !== -1) state.insights[index] = action.payload;
          state.unreadCount = state.insights.filter((i) => !i.isRead).length;
        }
      )
      .addCase(markInsightAsRead.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export default aiSlice.reducer;
