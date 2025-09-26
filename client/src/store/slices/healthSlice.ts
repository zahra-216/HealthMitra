// client/src/store/slices/healthSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { HealthRecord, CreateHealthRecordData } from "@/types";

// ------------------------
// Types
// ------------------------
interface HealthState {
  records: HealthRecord[];
  isLoading: boolean;
  error: string | null;
  pagination: {
    current: number;
    pages: number;
    total: number;
  };
}

// ------------------------
// Initial State
// ------------------------
const initialState: HealthState = {
  records: [],
  isLoading: false,
  error: null,
  pagination: {
    current: 1,
    pages: 1,
    total: 0,
  },
};

// ------------------------
// Async Thunks
// ------------------------
interface FetchRecordsParams {
  page?: number;
  limit?: number;
  search?: string;
}

export const fetchHealthRecords = createAsyncThunk<
  { items: HealthRecord[]; page: number; totalPages: number; total: number },
  FetchRecordsParams,
  { rejectValue: string }
>("health/fetchHealthRecords", async (params, { rejectWithValue }) => {
  try {
    const { page = 1, limit = 10, search } = params;
    const query = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(search ? { search } : {}),
    });
    const res = await axios.get(`/api/health-records?${query.toString()}`);
    return res.data;
  } catch (err: any) {
    return rejectWithValue(
      err.response?.data?.message || "Failed to fetch health records"
    );
  }
});

// ------------------------
// New Async Thunk: Create Health Record
// ------------------------
export const createHealthRecord = createAsyncThunk<
  HealthRecord,
  CreateHealthRecordData,
  { rejectValue: string }
>("health/createHealthRecord", async (data, { rejectWithValue }) => {
  try {
    const res = await axios.post("/api/health-records", data);
    return res.data; // The created HealthRecord
  } catch (err: any) {
    return rejectWithValue(
      err.response?.data?.message || "Failed to create health record"
    );
  }
});

// ------------------------
// Slice
// ------------------------
const healthSlice = createSlice({
  name: "health",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch Health Records
      .addCase(fetchHealthRecords.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        fetchHealthRecords.fulfilled,
        (
          state,
          action: PayloadAction<{
            items: HealthRecord[];
            page: number;
            totalPages: number;
            total: number;
          }>
        ) => {
          state.isLoading = false;
          state.records = action.payload.items;
          state.pagination = {
            current: action.payload.page,
            pages: action.payload.totalPages,
            total: action.payload.total,
          };
        }
      )
      .addCase(fetchHealthRecords.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Failed to fetch health records";
      })

      // Create Health Record
      .addCase(createHealthRecord.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        createHealthRecord.fulfilled,
        (state, action: PayloadAction<HealthRecord>) => {
          state.isLoading = false;
          state.records.unshift(action.payload); // optional: add new record to the list
        }
      )
      .addCase(createHealthRecord.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Failed to create health record";
      });
  },
});

export default healthSlice.reducer;
