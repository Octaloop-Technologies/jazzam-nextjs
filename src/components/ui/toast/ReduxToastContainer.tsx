"use client";

import React from "react";
import { useAppSelector, useAppDispatch } from "@/redux/store";
import { selectToasts, removeToast } from "@/redux/slices/toastSlice";
import Toast from "./Toast";

const ReduxToastContainer: React.FC = () => {
  const toasts = useAppSelector(selectToasts);
  const dispatch = useAppDispatch();

  const handleRemoveToast = (id: string) => {
    dispatch(removeToast(id));
  };

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-[9999] flex flex-col items-end max-w-sm w-full">
      {toasts.map((toast) => (
        <Toast key={toast.id} toast={toast} onRemove={handleRemoveToast} />
      ))}
    </div>
  );
};

export default ReduxToastContainer;
