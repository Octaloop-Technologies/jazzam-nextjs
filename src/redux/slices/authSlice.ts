import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "@/redux/store";
import { getCurrentUser } from "@/lib/api/auth";
import TokenStorage from "@/lib/utils/tokenStorage";

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
  joinedCompanies: string;
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
  joinedCompanyStatus: boolean;
  userFirstLogin: boolean;
  userType: string;
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
      // Clear tokens from localStorage
      TokenStorage.clearTokens();
    },
    updateUserSettings: (state, action) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
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
    setTokens: (state, action) => {
      const { accessToken, refreshToken } = action.payload;
      console.log("Setting tokens in Redux:", { hasAccessToken: !!accessToken, hasRefreshToken: !!refreshToken });
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchCurrentUser.pending, (state) => {
        if (!state.isLoading) {
          console.log("Fetching current user...");
          state.isLoading = true;
          state.error = null;
        }
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        console.log("Current user fetched successfully:", action.payload);
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(fetchCurrentUser.rejected, (state, action) => {
        console.log("Failed to fetch current user:", action.payload);
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.error = action.payload as string;
        
        // Only clear tokens on definitive auth errors, not network errors
        const errorMessage = action.payload as string;
        const isAuthError = errorMessage && (
          errorMessage.includes('401') || 
          errorMessage.includes('403') || 
          errorMessage.includes('Invalid') || 
          errorMessage.includes('expired') ||
          errorMessage.includes('unauthorized')
        );
        
        if (isAuthError) {
          console.log("Clearing invalid tokens due to auth error");
          // TokenStorage.clearTokens();
        } else {
          console.log("Network error, keeping tokens for retry");
        }
      });
  },
});

// Export actions
export const { logout, updateUserSettings, updateUserSubscription, setTokens } = authSlice.actions;

// Export selectors
export const selectUser = (state: RootState) => state.auth.user;
export const selectCompany = (state: RootState) => state.auth.user; // Alias for clarity
export const selectIsAuthenticated = (state: RootState) => state.auth.isAuthenticated;
export const selectIsLoading = (state: RootState) => state.auth.isLoading;
export const selectAuthError = (state: RootState) => state.auth.error;

export default authSlice.reducer;