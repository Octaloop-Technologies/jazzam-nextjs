"use client";

import React, { useRef, useEffect } from "react";
import gsap from "gsap";
import CloseIcon from "@/components/svgs/closeIcon";

interface FullScreenImageProps {
  src: string;
  alt: string;
  onClose: () => void;
}

const FullScreenImage: React.FC<FullScreenImageProps> = ({ src, alt, onClose }) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEscapeKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleClose();
      }
    };

    document.addEventListener("keydown", handleEscapeKey);
    document.body.style.overflow = "hidden";

    // Animate the modal and image in
    if (modalRef.current && imageRef.current) {
      gsap.fromTo(modalRef.current, { opacity: 0 }, { opacity: 1, duration: 0.2 });
      gsap.fromTo(
        imageRef.current,
        { scale: 0.9, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.2, delay: 0.05 }
      );
    }

    return () => {
      document.removeEventListener("keydown", handleEscapeKey);
      document.body.style.overflow = "auto";
    };
  }, []);

  const handleClose = () => {
    if (modalRef.current && imageRef.current) {
      gsap.to(modalRef.current, { opacity: 0, duration: 0.2 });
      gsap.to(imageRef.current, { scale: 0.9, opacity: 0, duration: 0.15 });
      setTimeout(() => {
        onClose();
      }, 200);
    } else {
      onClose();
    }
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  return (
    <div
      ref={modalRef}
      className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center backdrop-blur-sm max-mobile:h-[calc(100dvh-var(--bottom-tabbar-height))]"
      onClick={handleBackdropClick}
    >
      <div className="absolute top-4 right-4 z-[110]">
        <button
          onClick={handleClose}
          className="p-2 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 active:bg-white/20 transition-all duration-200 group"
          aria-label="Close full screen image"
        >
          <CloseIcon className="size-5 text-gray-200 group-hover:text-white group-active:text-white transition-all duration-200" />
        </button>
      </div>

      <div
        ref={imageRef}
        className="relative max-w-[90vw] max-h-[90vh] w-auto h-auto overflow-hidden pointer-events-none"
      >
        <img
          src={src}
          alt={alt}
          className="w-auto h-auto max-w-[90vw] max-h-[90vh] object-contain rounded-lg shadow-2xl"
          onClick={(e) => e.stopPropagation()}
          style={{ pointerEvents: "auto" }}
        />
      </div>
    </div>
  );
};

export default FullScreenImage;
