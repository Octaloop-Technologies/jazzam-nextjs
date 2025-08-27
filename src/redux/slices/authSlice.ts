import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "@/redux/store";
import {
  getLocalStorageItem,
  setLocalStorageItem,
  removeLocalStorageItem,
  getObjectFromLocalStorage,
  setObjectInLocalStorage,
} from "@/lib/utils/localStorage";

// Cookie management functions
const setCookie = (name: string, value: string, days = 7) => {
  const expires = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toUTCString();
  document.cookie = `${name}=${value}; expires=${expires}; path=/`;
};

const removeCookie = (name: string) => {
  document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT`;
};

// ======== ASYNC THUNKS ========

// Login
// export const loginUser = createAsyncThunk(
//   "auth/login",
//   async ({ credentials }: { credentials: LoginCredentials }, { rejectWithValue }) => {
//     try {
//       const url = `${API_URLS.BASE_URL}/login`;
//       // Temporarily disable credentials to work with wildcard CORS
//       const response = await fetch(url, fetchOptions("POST", credentials, false));

//       if (response.status === 404) {
//         return rejectWithValue("Authentication service endpoint not found.");
//       }

//       const data = await response.json();

//       if (!response.ok) {
//         return rejectWithValue(data.message || "Login failed");
//       }

//       return data;
//     } catch (error) {
//       return rejectWithValue(apiError(error, "Login failed due to network issue"));
//     }
//   }
// );

// Register
// export const registerUser = createAsyncThunk(
//   "auth/register",
//   async ({ credentials }: { credentials: RegisterCredentials }, { rejectWithValue }) => {
//     try {
//       const url = `${API_URLS.BASE_URL}/create`;
//       // Temporarily disable credentials to work with wildcard CORS
//       const response = await fetch(url, fetchOptions("POST", credentials, false));

//       if (response.status === 404) {
//         return rejectWithValue("Authentication service endpoint not found.");
//       }

//       const data = await response.json();

//       if (!response.ok) {
//         return rejectWithValue(data.message || "Registration failed");
//       }

//       return data;
//     } catch (error) {
//       return rejectWithValue(apiError(error, "Registration failed due to network issue"));
//     }
//   }
// );

// Logout
// export const logoutUser = createAsyncThunk("auth/logout", async (_, { rejectWithValue }) => {
//   try {
//     // Remove user and token from local storage
//     removeLocalStorageItem("user");
//     removeLocalStorageItem("token");

//     return {
//       success: true,
//       message: "Logged out successfully",
//     };
//   } catch (error) {
//     return rejectWithValue(apiError(error, "Logout failed due to network issue"));
//   }
// });

// ======== SLICE DEFINITION ========

// Initial state with security defaults
const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

// Initialize state from localStorage if available (client-side only)
if (typeof window !== "undefined") {
  const user = getObjectFromLocalStorage<User | null>("user", null);
  const token = getLocalStorageItem("token");

  if (user && token) {
    initialState.user = user;
    initialState.token = token;
    initialState.isAuthenticated = true;
  }
}

// Common state reducers for pending, fulfilled, and rejected cases
const setPending = (state: AuthState) => {
  state.loading = true;
  state.error = null;
};

// Fix the type for rejected actions
const setRejected = (state: AuthState, action: PayloadAction<unknown>) => {
  state.loading = false;
  state.error = action.payload as string;
};

// Logout handler with proper typing
const handleLogoutRejected = (state: AuthState, action: PayloadAction<unknown>) => {
  // Even if API logout fails, we clear the auth state
  resetAuthState(state);
  state.error = action.payload as string;
};

// Helper to reset auth state
const resetAuthState = (state: AuthState) => {
  state.user = null;
  state.token = null;
  state.isAuthenticated = false;
  state.loading = false;
  state.error = null;

  // Clear both localStorage and cookies
  if (typeof window !== "undefined") {
    // Clear localStorage
    removeLocalStorageItem("user");
    removeLocalStorageItem("token");

    // Clear cookies
    removeCookie("user");
    removeCookie("token");
  }
};

// Create the auth slice
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // Synchronous reducers
    setCredentials: (state, action: PayloadAction<{ user: User; token: string }>) => {
      const { user, token } = action.payload;
      state.user = user;
      state.token = token;
      state.isAuthenticated = true;
      state.error = null;

      if (typeof window !== "undefined") {
        // Store in localStorage
        setObjectInLocalStorage("user", user);
        setLocalStorageItem("token", token);

        // Store in cookies
        setCookie("token", token);
        setCookie("user", JSON.stringify(user));
      }
    },
    clearCredentials: (state) => {
      resetAuthState(state);
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Login cases
    builder
      .addCase(loginUser.pending, setPending)
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.error = null;

        if (typeof window !== "undefined") {
          // Store in localStorage
          setObjectInLocalStorage("user", action.payload.user);
          setLocalStorageItem("token", action.payload.token);

          // Store in cookies
          setCookie("token", action.payload.token);
          setCookie("user", JSON.stringify(action.payload.user));
        }
      })
      .addCase(loginUser.rejected, setRejected);

    // Register cases
    builder
      .addCase(registerUser.pending, setPending)
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        if (action.payload.user && action.payload.token) {
          state.user = action.payload.user;
          state.token = action.payload.token;
          state.isAuthenticated = true;

          if (typeof window !== "undefined") {
            // Store in localStorage
            setObjectInLocalStorage("user", action.payload.user);
            setLocalStorageItem("token", action.payload.token);

            // Store in cookies
            setCookie("token", action.payload.token);
            setCookie("user", JSON.stringify(action.payload.user));
          }
        }
      })
      .addCase(registerUser.rejected, setRejected);

    // Logout cases
    builder
      .addCase(logoutUser.pending, setPending)
      .addCase(logoutUser.fulfilled, resetAuthState)
      .addCase(logoutUser.rejected, handleLogoutRejected);
  },
});

// ======== EXPORTS ========

// Export synchronous actions
export const { setCredentials, clearCredentials, clearError } = authSlice.actions;

// Export selectors
export const selectCurrentUser = (state: RootState) => state.auth.user;
export const selectIsAuthenticated = (state: RootState) => state.auth.isAuthenticated;
export const selectAuthLoading = (state: RootState) => state.auth.loading;
export const selectAuthError = (state: RootState) => state.auth.error;

// Export the reducer
export default authSlice.reducer;
