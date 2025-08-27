"use client";

import { useDispatch, useSelector } from "react-redux";
import {
  loginUser,
  logoutUser,
  clearCredentials,
  clearError,
  selectAuthLoading,
  selectAuthError,
  selectIsAuthenticated,
  selectCurrentUser,
} from "@/redux/slices/authSlice";
import { AppDispatch } from "@/redux/store";
import { useCallback } from "react";
import { LoginCredentials, UseAuthReturn } from "../../types/auth";
import { useToast } from "@/contexts/ToastContext";
import { useRouter } from "next/navigation";

// ==============| All auth-related Redux functionality |=============

export const useAuth = (): UseAuthReturn => {
  const dispatch = useDispatch<AppDispatch>();
  const { addToast } = useToast();
  const router = useRouter();

  // Memoize selectors to prevent unnecessary re-renders
  const isLoading = useSelector(selectAuthLoading);
  const error = useSelector(selectAuthError);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const user = useSelector(selectCurrentUser);

  // Login action
  const login = useCallback(
    async (credentials: LoginCredentials) => {
      try {
        await dispatch(loginUser({ credentials })).unwrap();
      } catch (error) {
        // Let the component handle the error using our error state
        throw error;
      }
    },
    [dispatch]
  );

  // Logout action
  const logout = useCallback(async () => {
    try {
      await dispatch(logoutUser()).unwrap();
      router.push("/");
      addToast({
        message: "Logged out successfully",
        type: "success",
      });
    } catch (error) {
      // Even if API logout fails, we clear the local state
      dispatch(clearCredentials());
      throw error;
    }
  }, [dispatch]);

  // Clear error action
  const clearAuthError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  return {
    isLoading,
    error,
    isAuthenticated,
    user,
    login,
    logout,
    clearAuthError,
  };
};
