"use client";

import { useCallback } from "react";

type ValidationFunction = (value: unknown) => string | null;
type ValidationSchema<T> = Record<keyof T, ValidationFunction[]>;

interface UseValidationResult<T> {
  validateField: (fieldName: keyof T, value: unknown) => string | null;
  validateForm: (values: T) => Partial<Record<keyof T, string>>;
}

/**
 * Custom hook for form validation
 * @param validationSchema Object with field names and array of validation functions
 * @returns Object with validation utilities
 */
export function useValidation<T extends Record<string, unknown>>(
  validationSchema: ValidationSchema<T>
): UseValidationResult<T> {
  // Validate a single field
  const validateField = useCallback(
    (fieldName: keyof T, value: unknown): string | null => {
      const fieldValidators = validationSchema[fieldName];

      if (!fieldValidators || !Array.isArray(fieldValidators) || fieldValidators.length === 0) {
        return null; // No validators for this field
      }

      // Run through each validator until one fails
      for (const validator of fieldValidators) {
        const errorMessage = validator(value);
        if (errorMessage) {
          return errorMessage;
        }
      }

      return null; // All validators passed
    },
    [validationSchema]
  );

  // Validate the entire form
  const validateForm = useCallback(
    (values: T): Partial<Record<keyof T, string>> => {
      const errors: Partial<Record<keyof T, string>> = {};

      // Validate each field in the schema
      Object.keys(validationSchema).forEach((key) => {
        const fieldName = key as keyof T;
        const value = values[fieldName];
        const fieldError = validateField(fieldName, value);

        if (fieldError) {
          errors[fieldName] = fieldError;
        }
      });

      return errors;
    },
    [validationSchema, validateField]
  );

  return { validateField, validateForm };
}

// Common validation functions
export const validators = {
  required:
    (message = "This field is required"): ValidationFunction =>
    (value) => {
      if (value === undefined || value === null || value === "") {
        return message;
      }
      // Handle arrays - empty arrays should be considered as not filled
      if (Array.isArray(value) && value.length === 0) {
        return message;
      }
      return null;
    },

  email:
    (message = "Please enter a valid email address"): ValidationFunction =>
    (value) => {
      if (!value) return null; // Skip if empty (use required validator for that)

      const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
      return typeof value === "string" && emailRegex.test(value) ? null : message;
    },

  minLength:
    (length: number, message?: string): ValidationFunction =>
    (value) => {
      if (!value) return null; // Skip if empty

      const defaultMessage = `Must be at least ${length} characters`;
      return typeof value === "string" && value.length >= length ? null : message || defaultMessage;
    },

  maxLength:
    (length: number, message?: string): ValidationFunction =>
    (value) => {
      if (!value) return null; // Skip if empty

      const defaultMessage = `Must be at most ${length} characters`;
      return typeof value === "string" && value.length <= length ? null : message || defaultMessage;
    },

  matches:
    (pattern: RegExp, message: string): ValidationFunction =>
    (value) => {
      if (!value) return null; // Skip if empty

      return typeof value === "string" && pattern.test(value) ? null : message;
    },

  number:
    (message = "Please enter a valid number"): ValidationFunction =>
    (value) => {
      if (!value) return null; // Skip if empty

      return !isNaN(Number(value)) ? null : message;
    },

  min:
    (min: number, message?: string): ValidationFunction =>
    (value) => {
      if (!value) return null; // Skip if empty

      const num = Number(value);
      const defaultMessage = `Must be at least ${min}`;
      return !isNaN(num) && num >= min ? null : message || defaultMessage;
    },

  max:
    (max: number, message?: string): ValidationFunction =>
    (value) => {
      if (!value) return null; // Skip if empty

      const num = Number(value);
      const defaultMessage = `Must be at most ${max}`;
      return !isNaN(num) && num <= max ? null : message || defaultMessage;
    },

  // Custom validator for password strength
  passwordStrength:
    (
      message = "Password must contain at least 8 characters, including uppercase, lowercase, number, and special character"
    ): ValidationFunction =>
    (value) => {
      if (!value) return null; // Skip if empty

      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
      return typeof value === "string" && passwordRegex.test(value) ? null : message;
    },

  // Check if two fields match (useful for password confirmation)
  matches_field:
    (getMatchFieldValue: () => string, message = "Fields do not match"): ValidationFunction =>
    (value) => {
      return typeof value === "string" && value === getMatchFieldValue() ? null : message;
    },
};
