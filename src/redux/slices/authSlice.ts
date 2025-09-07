import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "@/redux/store";
import { getCurrentUser } from "@/app/(auth)/action";

// User interface matching the backend
export interface User {
  _id: string;
  name: string;
  email: string;
  fullName: string;
  avatar?: {
    url: string;
    public_id: string;
  };
  provider?: string;
  isVerified: boolean;
}

// Auth state interface
interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
}

// ==============================================================
// Initial state
// ==============================================================
const initialState: AuthState = {
  user: null,
  isLoading: false,
  isAuthenticated: false,
  error: null,
};

// ==============================================================
// Async thunks for authentication : fetchCurrentUser, logoutUserAsync
// ==============================================================
export const fetchCurrentUser = createAsyncThunk(
  "auth/fetchCurrentUser",
  async (_, { rejectWithValue }) => {
    try {
      const result = await getCurrentUser();
      if (result.success && result.user) {
        return result.user;
      } else {
        return rejectWithValue("Failed to fetch user");
      }
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : "Unknown error");
    }
  }
);

// ==============================================================
// Client-side logout - Direct API call from browser with cookies
// ==============================================================
export const logoutUser = createAsyncThunk(
  "auth/logoutUserClient",
  async (_, { rejectWithValue }) => {
    try {
      // Get base URL with fallback
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

      const response = await fetch(`${baseUrl}/users/auth/logout`, {
        method: "POST",
        credentials: "include", // Include cookies
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        return "Successfully logged out";
      } else {
        return rejectWithValue("Logout failed. Please try again.");
      }
    } catch (error) {
      console.error("Logout error:", error);
      return rejectWithValue(error instanceof Error ? error.message : "Network error occurred");
    }
  }
);

// ==============================================================
// Create the auth slice
// ==============================================================
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User | null>) => {
      state.user = action.payload;
      state.isAuthenticated = !!action.payload;
      state.error = null;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.error = null;
      state.isLoading = false;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCurrentUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(fetchCurrentUser.rejected, (state, action) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.error = action.payload as string;
      })
      // Client-side logout reducers
      .addCase(logoutUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(logoutUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.error = null;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.error = action.payload as string;
      });
  },
});

// Export actions
export const { setUser, setLoading, setError, logout, clearError } = authSlice.actions;

// Export selectors
export const selectUser = (state: RootState) => state.auth.user;
export const selectIsAuthenticated = (state: RootState) => state.auth.isAuthenticated;
export const selectIsLoading = (state: RootState) => state.auth.isLoading;
export const selectAuthError = (state: RootState) => state.auth.error;

export default authSlice.reducer;
