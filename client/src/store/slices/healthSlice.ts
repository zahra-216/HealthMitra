// client/src/store/slices/healthSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "@/config/axios";
import { HealthRecord, CreateHealthRecordData } from "@/types";

// ------------------------
// Types
// ------------------------
interface HealthState {
  records: HealthRecord[];
  currentRecord: HealthRecord | null;
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
  currentRecord: null,
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
>("health/fetchHealthRecords", async (params = {}, { rejectWithValue }) => {
  try {
    const { page = 1, limit = 10, search } = params;
    const query = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(search ? { search } : {}),
    });
    const res = await axios.get(`/health-records?${query.toString()}`);
    return res.data;
  } catch (err: any) {
    return rejectWithValue(
      err.response?.data?.message || "Failed to fetch health records"
    );
  }
});

// ------------------------
// Fetch Single Health Record
// ------------------------
export const fetchHealthRecord = createAsyncThunk<
  HealthRecord,
  string,
  { rejectValue: string }
>("health/fetchHealthRecord", async (id, { rejectWithValue }) => {
  try {
    const res = await axios.get(`/health-records/${id}`);
    return res.data;
  } catch (err: any) {
    return rejectWithValue(
      err.response?.data?.message || "Failed to fetch health record"
    );
  }
});

// ------------------------
// Create Health Record
// ------------------------
export const createHealthRecord = createAsyncThunk<
  HealthRecord,
  CreateHealthRecordData,
  { rejectValue: string }
>("health/createHealthRecord", async (data, { rejectWithValue }) => {
  try {
    const res = await axios.post("/health-records", data);
    return res.data;
  } catch (err: any) {
    return rejectWithValue(
      err.response?.data?.message || "Failed to create health record"
    );
  }
});

// ------------------------
// Update Health Record
// ------------------------
export const updateHealthRecord = createAsyncThunk<
  HealthRecord,
  { id: string; data: Partial<CreateHealthRecordData> },
  { rejectValue: string }
>("health/updateHealthRecord", async ({ id, data }, { rejectWithValue }) => {
  try {
    const res = await axios.put(`/health-records/${id}`, data);
    return res.data;
  } catch (err: any) {
    return rejectWithValue(
      err.response?.data?.message || "Failed to update health record"
    );
  }
});

// ------------------------
// Delete Health Record
// ------------------------
export const deleteHealthRecord = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>("health/deleteHealthRecord", async (id, { rejectWithValue }) => {
  try {
    await axios.delete(`/health-records/${id}`);
    return id;
  } catch (err: any) {
    return rejectWithValue(
      err.response?.data?.message || "Failed to delete health record"
    );
  }
});

// ------------------------
// Slice
// ------------------------
const healthSlice = createSlice({
  name: "health",
  initialState,
  reducers: {
    clearCurrentRecord: (state) => {
      state.currentRecord = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
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

      // Fetch Single Health Record
      .addCase(fetchHealthRecord.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        fetchHealthRecord.fulfilled,
        (state, action: PayloadAction<HealthRecord>) => {
          state.isLoading = false;
          state.currentRecord = action.payload;
          // Also update the record in the records array if it exists
          const index = state.records.findIndex(
            (r) => r._id === action.payload._id
          );
          if (index !== -1) {
            state.records[index] = action.payload;
          }
        }
      )
      .addCase(fetchHealthRecord.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Failed to fetch health record";
        state.currentRecord = null;
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
          state.records.unshift(action.payload);
          state.pagination.total += 1;
        }
      )
      .addCase(createHealthRecord.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Failed to create health record";
      })

      // Update Health Record
      .addCase(updateHealthRecord.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        updateHealthRecord.fulfilled,
        (state, action: PayloadAction<HealthRecord>) => {
          state.isLoading = false;
          const index = state.records.findIndex(
            (r) => r._id === action.payload._id
          );
          if (index !== -1) {
            state.records[index] = action.payload;
          }
          if (
            state.currentRecord &&
            state.currentRecord._id === action.payload._id
          ) {
            state.currentRecord = action.payload;
          }
        }
      )
      .addCase(updateHealthRecord.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Failed to update health record";
      })

      // Delete Health Record
      .addCase(deleteHealthRecord.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        deleteHealthRecord.fulfilled,
        (state, action: PayloadAction<string>) => {
          state.isLoading = false;
          state.records = state.records.filter((r) => r._id !== action.payload);
          if (
            state.currentRecord &&
            state.currentRecord._id === action.payload
          ) {
            state.currentRecord = null;
          }
          state.pagination.total = Math.max(0, state.pagination.total - 1);
        }
      )
      .addCase(deleteHealthRecord.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Failed to delete health record";
      });
  },
});

export const { clearCurrentRecord, clearError } = healthSlice.actions;
export default healthSlice.reducer;
