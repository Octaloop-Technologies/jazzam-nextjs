"use client";
import { Dictionary } from "@/lib/i18n/getDictionary";
import { useSimpleTextAnimation } from "@/styles/animations/useSimpleTextAnimation";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { closeModal, selectIsModalOpen } from "@/redux/slices/uiSlice";

const ComingSoonModal = ({ dict }: { dict: Dictionary }) => {
  const dispatch = useDispatch();
  const isModalOpen = useSelector(selectIsModalOpen);

  const { titleRef, paragraphRef, containerRef } = useSimpleTextAnimation({
    titleText: dict?.home?.hero?.commingSoon,
    paragraphText: dict?.home?.hero?.waitingListMessage,
  });

  if (!isModalOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/20 backdrop-blur-[12px]"
        onClick={() => dispatch(closeModal())} // ✅ Close when clicking outside
      ></div>

      {/* Modal Box */}
      <div
        className="relative bg-white rounded-2xl shadow-lg p-8 w-11/12 max-w-sm text-center z-10"
        onClick={(e) => e.stopPropagation()} // ✅ Prevent closing when clicking inside
        ref={containerRef}
      >
        {/* Close Button */}
        <button
          onClick={() => dispatch(closeModal())}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
        >
          ✕
        </button>

        {/* Content */}
        <h2 className="text-2xl font-semibold text-gray-800 mb-2" ref={titleRef}>
          {dict?.home?.hero?.commingSoon}
        </h2>
        <p className="text-gray-600 mb-4" ref={paragraphRef}>
          {dict?.home?.hero?.waitingListMessage}
        </p>
      </div>
    </div>
  );
};

export default ComingSoonModal;
