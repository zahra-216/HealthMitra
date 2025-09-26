// client/src/store/slices/notificationSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import {
  Reminder,
  CreateReminderData,
  NotificationPreferences,
  PaginatedResponse,
} from "@/types";
import { notificationService } from "@/services";
import { toast } from "react-hot-toast";

interface NotificationState {
  reminders: Reminder[];
  preferences: NotificationPreferences | null;
  isLoading: boolean;
  pagination: {
    current: number;
    pages: number;
    total: number;
    limit: number;
  };
}

const initialState: NotificationState = {
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

// ---------------------
// Async Thunks
// ---------------------

export const fetchReminders = createAsyncThunk<
  PaginatedResponse<Reminder>,
  | { page?: number; limit?: number; type?: string; isActive?: boolean }
  | undefined,
  { rejectValue: string }
>("notifications/fetchReminders", async (params, { rejectWithValue }) => {
  try {
    return await notificationService.getReminders(params);
  } catch (err: any) {
    return rejectWithValue(
      err.response?.data?.message || "Failed to fetch reminders"
    );
  }
});

export const createReminder = createAsyncThunk<
  Reminder,
  CreateReminderData,
  { rejectValue: string }
>("notifications/createReminder", async (data, { rejectWithValue }) => {
  try {
    const res = await notificationService.createReminder(data);
    toast.success("Reminder created successfully!");
    return res.reminder;
  } catch (err: any) {
    return rejectWithValue(
      err.response?.data?.message || "Failed to create reminder"
    );
  }
});

export const updateReminder = createAsyncThunk<
  Reminder,
  { id: string; data: Partial<Reminder> },
  { rejectValue: string }
>("notifications/updateReminder", async ({ id, data }, { rejectWithValue }) => {
  try {
    const res = await notificationService.updateReminder(id, data);
    toast.success("Reminder updated successfully!");
    return res.reminder;
  } catch (err: any) {
    return rejectWithValue(
      err.response?.data?.message || "Failed to update reminder"
    );
  }
});

export const deleteReminder = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>("notifications/deleteReminder", async (id, { rejectWithValue }) => {
  try {
    await notificationService.deleteReminder(id);
    toast.success("Reminder deleted successfully!");
    return id;
  } catch (err: any) {
    return rejectWithValue(
      err.response?.data?.message || "Failed to delete reminder"
    );
  }
});

// ---------------------
// Slice
// ---------------------

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
      .addCase(
        fetchReminders.fulfilled,
        (state, action: PayloadAction<PaginatedResponse<Reminder>>) => {
          state.isLoading = false;
          state.reminders = action.payload.items;
          state.pagination = {
            current: action.payload.page,
            pages: action.payload.totalPages,
            total: action.payload.total,
            limit: action.payload.limit,
          };
        }
      )
      .addCase(fetchReminders.rejected, (state, action) => {
        state.isLoading = false;
        toast.error(action.payload as string);
      })

      // Create Reminder
      .addCase(
        createReminder.fulfilled,
        (state, action: PayloadAction<Reminder>) => {
          state.reminders.unshift(action.payload);
        }
      )

      // Update Reminder
      .addCase(
        updateReminder.fulfilled,
        (state, action: PayloadAction<Reminder>) => {
          const index = state.reminders.findIndex(
            (r) => r._id === action.payload._id
          );
          if (index !== -1) state.reminders[index] = action.payload;
        }
      )

      // Delete Reminder
      .addCase(
        deleteReminder.fulfilled,
        (state, action: PayloadAction<string>) => {
          state.reminders = state.reminders.filter(
            (r) => r._id !== action.payload
          );
        }
      );
  },
});

export default notificationSlice.reducer;
