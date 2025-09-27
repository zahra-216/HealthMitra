// client/src/store/slices/healthSlice.js
const { createSlice, createAsyncThunk } = require("@reduxjs/toolkit");
const { apiService } = require("@/services/api");

// ------------------------
// Initial State
// ------------------------
const initialState = {
  records: [],
  isLoading: false,
  error: null,
  pagination: { current: 1, pages: 1, total: 0 },
};

// ------------------------
// Async Thunks
// ------------------------
const fetchHealthRecords = createAsyncThunk(
  "health/fetchHealthRecords",
  async (params = {}, { rejectWithValue }) => {
    try {
      const { page = 1, limit = 10, search } = params;

      const res = await apiService.get("/records", {
        params: { page, limit, search },
      });

      return res; // backend returns { items, page, totalPages, total }
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch health records"
      );
    }
  }
);

const createHealthRecord = createAsyncThunk(
  "health/createHealthRecord",
  async (data, { rejectWithValue }) => {
    try {
      const res = await apiService.post("/records", data);
      return res; // backend returns the created record
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to create health record"
      );
    }
  }
);

// ------------------------
// Slice
// ------------------------
const healthSlice = createSlice({
  name: "health",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch Records
      .addCase(fetchHealthRecords.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchHealthRecords.fulfilled, (state, action) => {
        state.isLoading = false;
        state.records = action.payload.items;
        state.pagination = {
          current: action.payload.page,
          pages: action.payload.totalPages,
          total: action.payload.total,
        };
      })
      .addCase(fetchHealthRecords.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Failed to fetch health records";
      })

      // Create Record
      .addCase(createHealthRecord.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createHealthRecord.fulfilled, (state, action) => {
        state.isLoading = false;
        state.records.unshift(action.payload);
      })
      .addCase(createHealthRecord.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Failed to create health record";
      });
  },
});

// ------------------------
// Exports
// ------------------------
module.exports = {
  reducer: healthSlice.reducer,
  fetchHealthRecords,
  createHealthRecord,
};
