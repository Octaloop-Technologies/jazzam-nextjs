"use client";

import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { useValidation } from "./useValidation";

interface UseFormProps<T> {
  initialValues: T;
  onSubmit: (values: T, isValid: boolean) => void;
  validationSchema?: Record<keyof T, Array<(value: unknown) => string | null>>;
  validateOnChange?: boolean;
  validateOnBlur?: boolean;
  validateOnMount?: boolean;
}

interface UseFormResult<T> {
  values: T;
  errors: Partial<Record<keyof T, string>>;
  touched: Partial<Record<keyof T, boolean>>;
  isValid: boolean;
  isDirty: boolean;
  isSubmitting: boolean;
  handleChange: (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => void;
  handleBlur: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  handleSubmit: (e: FormEvent<HTMLFormElement>) => void;
  setFieldValue: (name: keyof T, value: unknown) => void;
  setFieldTouched: (name: keyof T, isTouched: boolean) => void;
  resetForm: () => void;
}

export function useForm<T extends Record<string, unknown>>({
  initialValues,
  onSubmit,
  validationSchema = {} as Record<keyof T, Array<(value: unknown) => string | null>>,
  validateOnChange = true,
  validateOnBlur = true,
  validateOnMount = false,
}: UseFormProps<T>): UseFormResult<T> {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});
  const [touched, setTouched] = useState<Partial<Record<keyof T, boolean>>>({});
  const [isDirty, setIsDirty] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const { validateField, validateForm } = useValidation<T>(validationSchema);

  // Validate on mount if required
  useEffect(() => {
    if (validateOnMount) {
      const newErrors = validateForm(values);
      setErrors(newErrors);
    }
  }, []);

  // Determine if the form is valid
  const isValid = Object.keys(errors).length === 0;

  // Handle input change
  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    const fieldName = name as keyof T;

    setValues((prev) => ({
      ...prev,
      [fieldName]: value,
    }));

    setIsDirty(true);

    // Validate on change if enabled
    if (validateOnChange) {
      const fieldError = validateField(fieldName, value);
      setErrors((prev) => ({
        ...prev,
        [fieldName]: fieldError,
      }));
    }
  };

  // Handle input blur
  const handleBlur = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name } = e.target;
    const fieldName = name as keyof T;

    setTouched((prev) => ({
      ...prev,
      [fieldName]: true,
    }));

    // Validate on blur if enabled
    if (validateOnBlur) {
      const fieldError = validateField(fieldName, values[fieldName]);
      setErrors((prev) => ({
        ...prev,
        [fieldName]: fieldError,
      }));
    }
  };

  // Handle form submission
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Always validate all fields on submit
    const formErrors = validateForm(values);
    setErrors(formErrors);

    // Mark all fields as touched
    const allTouched: Partial<Record<keyof T, boolean>> = {};
    Object.keys(values).forEach((key) => {
      allTouched[key as keyof T] = true;
    });
    setTouched(allTouched);

    // Determine if form is valid
    const formIsValid = Object.keys(formErrors).length === 0;

    setIsSubmitting(true);

    // Call onSubmit callback with form state
    onSubmit(values, formIsValid);

    setIsSubmitting(false);
  };

  // Set a specific field value programmatically
  const setFieldValue = (name: keyof T, value: unknown) => {
    setValues((prev) => ({
      ...prev,
      [name]: value,
    }));

    setIsDirty(true);

    if (validateOnChange) {
      const fieldError = validateField(name, value);
      setErrors((prev) => ({
        ...prev,
        [name]: fieldError,
      }));
    }
  };

  // Set a specific field's touched state programmatically
  const setFieldTouched = (name: keyof T, isTouched: boolean) => {
    setTouched((prev) => ({
      ...prev,
      [name]: isTouched,
    }));

    if (isTouched && validateOnBlur) {
      const fieldError = validateField(name, values[name]);
      setErrors((prev) => ({
        ...prev,
        [name]: fieldError,
      }));
    }
  };

  // Reset form to initial state
  const resetForm = () => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
    setIsDirty(false);
    setIsSubmitting(false);
  };

  return {
    values,
    errors,
    touched,
    isValid,
    isDirty,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    setFieldValue,
    setFieldTouched,
    resetForm,
  };
}
