"use client";

import React, { useRef, useState } from "react";
import Image from "next/image";

interface OptimizedVideoProps {
  src: string;
  poster?: string;
  className?: string;
  width?: string | number;
  height?: string | number;
  autoPlay?: boolean;
  muted?: boolean;
  loop?: boolean;
  controls?: boolean;
  preload?: "auto" | "metadata" | "none";
  playsInline?: boolean;
  onLoad?: () => void;
  onError?: (error: React.SyntheticEvent<HTMLVideoElement, Event>) => void;
  fallback?: React.ReactNode;
  objectFit?: "contain" | "cover" | "fill" | "none" | "scale-down";
  videoType?: string;
}

const OptimizedVideo: React.FC<OptimizedVideoProps> = ({
  src,
  poster,
  className = "",
  width = "100%",
  height = "auto",
  autoPlay = false,
  muted = false,
  loop = false,
  controls = true,
  preload = "auto",
  playsInline = true,
  onLoad,
  onError,
  fallback,
  objectFit = "cover",
  videoType = "video/mp4",
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hasError, setHasError] = useState(false);

  const handleLoadedData = () => {
    console.log("Video loaded successfully");
    if (onLoad) onLoad();
  };

  const handleError = (error: React.SyntheticEvent<HTMLVideoElement, Event>) => {
    console.error("Video loading error:", error);
    setHasError(true);
    if (onError) onError(error);
  };

  if (hasError && fallback) {
    return (
      fallback || (
        <div className="w-full h-full bg-black">
          {poster && (
            <Image
              src={poster}
              alt="Video poster"
              className="w-full h-full object-cover"
              fill
              priority
            />
          )}
        </div>
      )
    );
  }

  return (
    <div
      className={`video-container ${className}`}
      style={{ position: "relative", overflow: "hidden" }}
    >
      <video
        ref={videoRef}
        style={{ width, height, objectFit }}
        poster={poster}
        autoPlay={autoPlay}
        muted={muted}
        loop={loop}
        controls={controls}
        preload={preload}
        playsInline={playsInline}
        onLoadedData={handleLoadedData}
        onError={handleError}
      >
        <source src={src} type={videoType} />
        Your browser does not support the video tag.
      </video>
    </div>
  );
};

export default OptimizedVideo;
