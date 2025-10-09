import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "@/redux/store";
import { getCurrentUser } from "@/app/(auth)/action";

// Company interface matching the backend
export interface Company {
  _id: string;
  companyName: string;
  email: string;
  website?: string;
  industry?: string;
  companySize?: string;
  contactPerson?: {
    name?: string;
    phone?: string;
  };
  subscriptionStatus: string;
  subscriptionPlan: string;
  trialEndDate?: Date;
  subscriptionStartDate?: Date;
  subscriptionEndDate?: Date;
  paymentMethod: string;
  paymentDetails?: {
    stripeCustomerId?: string;
    stripeSubscriptionId?: string;
    payfortReference?: string;
    lastPaymentDate?: Date;
    nextPaymentDate?: Date;
  };
  settings: {
    timezone: string;
    currency: string;
    language: string;
    emailNotifications: boolean;
    leadNotifications: boolean;
    autoBANTQualification: boolean;
  };
  logo?: {
    url: string;
    public_id: string;
  };
  isVerified: boolean;
  googleId?: string;
  zohoId?: string;
  provider: string;
  usageStats: {
    totalLeads: number;
    leadsThisMonth: number;
    formsCreated: number;
    emailsSent: number;
  };
  isActive: boolean;
  lastLoginAt?: Date;
  onboarding?: {
    completed: boolean;
    currentStep: number;
    completedSteps: number[];
    skipped: boolean;
    completedAt?: Date;
  };
  createdAt: Date;
  updatedAt: Date;
}

// Auth state interface
interface AuthState {
  user: Company | null;
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
// Create the auth slice
// ==============================================================
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.isLoading = false;
      state.error = null;
    },
    updateUserSettings: (state, action) => {
      if (state.user) {
        state.user.settings = { ...state.user.settings, ...action.payload };
      }
    },
    updateUserSubscription: (state, action) => {
      if (state.user) {
        state.user.subscriptionStatus =
          action.payload.subscriptionStatus || state.user.subscriptionStatus;
        state.user.subscriptionPlan =
          action.payload.subscriptionPlan || state.user.subscriptionPlan;
        state.user.trialEndDate = action.payload.trialEndDate || state.user.trialEndDate;
        state.user.subscriptionStartDate =
          action.payload.subscriptionStartDate || state.user.subscriptionStartDate;
        state.user.subscriptionEndDate =
          action.payload.subscriptionEndDate || state.user.subscriptionEndDate;
        state.user.paymentMethod = action.payload.paymentMethod || state.user.paymentMethod;
        if (action.payload.paymentDetails) {
          state.user.paymentDetails = {
            ...state.user.paymentDetails,
            ...action.payload.paymentDetails,
          };
        }
      }
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
      });
  },
});

// Export actions
export const { logout, updateUserSettings, updateUserSubscription } = authSlice.actions;

// Export selectors
export const selectUser = (state: RootState) => state.auth.user;
export const selectCompany = (state: RootState) => state.auth.user; // Alias for clarity
export const selectIsAuthenticated = (state: RootState) => state.auth.isAuthenticated;
export const selectIsLoading = (state: RootState) => state.auth.isLoading;
export const selectAuthError = (state: RootState) => state.auth.error;

export default authSlice.reducer;
