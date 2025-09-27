// client/src/store/slices/notificationSlice.js
const { createSlice, createAsyncThunk } = require("@reduxjs/toolkit");
const { notificationService } = require("@/services");
const { toast } = require("react-hot-toast");

// ------------------------
// Initial State
// ------------------------
const initialState = {
  reminders: [],
  preferences: null,
  isLoading: false,
  pagination: {
    current: 1,
    pages: 1,
    total: 0,
    limit: 10,
  },
};

// ------------------------
// Async Thunks
// ------------------------
const fetchReminders = createAsyncThunk(
  "notifications/fetchReminders",
  async (params, { rejectWithValue }) => {
    try {
      return await notificationService.getReminders(params);
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch reminders"
      );
    }
  }
);

const createReminder = createAsyncThunk(
  "notifications/createReminder",
  async (data, { rejectWithValue }) => {
    try {
      const res = await notificationService.createReminder(data);
      toast.success("Reminder created successfully!");
      return res.reminder;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to create reminder"
      );
    }
  }
);

const updateReminder = createAsyncThunk(
  "notifications/updateReminder",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const res = await notificationService.updateReminder(id, data);
      toast.success("Reminder updated successfully!");
      return res.reminder;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to update reminder"
      );
    }
  }
);

const deleteReminder = createAsyncThunk(
  "notifications/deleteReminder",
  async (id, { rejectWithValue }) => {
    try {
      await notificationService.deleteReminder(id);
      toast.success("Reminder deleted successfully!");
      return id;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to delete reminder"
      );
    }
  }
);

// ------------------------
// Slice
// ------------------------
const notificationSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch Reminders
      .addCase(fetchReminders.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchReminders.fulfilled, (state, action) => {
        state.isLoading = false;
        state.reminders = action.payload.items;
        state.pagination = {
          current: action.payload.page,
          pages: action.payload.totalPages,
          total: action.payload.total,
          limit: action.payload.limit,
        };
      })
      .addCase(fetchReminders.rejected, (state, action) => {
        state.isLoading = false;
        toast.error(action.payload);
      })

      // Create Reminder
      .addCase(createReminder.fulfilled, (state, action) => {
        state.reminders.unshift(action.payload);
      })

      // Update Reminder
      .addCase(updateReminder.fulfilled, (state, action) => {
        const index = state.reminders.findIndex(
          (r) => r._id === action.payload._id
        );
        if (index !== -1) state.reminders[index] = action.payload;
      })

      // Delete Reminder
      .addCase(deleteReminder.fulfilled, (state, action) => {
        state.reminders = state.reminders.filter(
          (r) => r._id !== action.payload
        );
      });
  },
});

// ------------------------
// Exports
// ------------------------
module.exports = {
  reducer: notificationSlice.reducer,
  fetchReminders,
  createReminder,
  updateReminder,
  deleteReminder,
};
