"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";

interface UnfollowConfirmationPopupProps {
  onConfirm: () => void;
  onCancel: () => void;
}

const UnfollowConfirmationPopup: React.FC<UnfollowConfirmationPopupProps> = ({
  onConfirm,
  onCancel,
}) => {
  const popupRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (popupRef.current) {
      gsap.fromTo(
        popupRef.current,
        { opacity: 0, scale: 0.8 },
        { opacity: 1, scale: 1, duration: 0.3, ease: "power2.out" }
      );
    }
  }, []);

  return (
    <div className="fixed inset-0 flex items-center justify-center backdrop-blur-md bg-opacity-50 z-50">
      <div ref={popupRef} className="bg-lighter p-6 rounded-lg shadow-lg">
        <h2 className="text-lg font-bold mb-4">Unfollow?</h2>
        <p className="mb-4">Are you sure you want to unfollow this category?</p>
        <div className="flex justify-end">
          <button
            onClick={onCancel}
            className="mr-2 px-4 py-2 bg-cancel rounded hover:bg-cancel-hover"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-unfollow rounded hover:bg-unfollow-hover"
          >
            Unfollow
          </button>
        </div>
      </div>
    </div>
  );
};

export default UnfollowConfirmationPopup;
