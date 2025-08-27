"use client";

import CloseIcon from "@/components/svgs/closeIcon";
import FullScreenImage from "./FullScreenImage";
import { useRouter } from "next/navigation";
import React, { useRef, useState, useEffect } from "react";
import gsap from "gsap";
import { formatTimeAgo } from "@/helpers/formatTimeAgo";
import OptimizedImage from "../image/OptimizedImage";
import { randomBackgroundColor } from "@/helpers/randomBackgroundColor";
import Link from "next/link";

interface SourceArticle {
  id: string;
  title: string;
  imageUrl: string;
  sourceName: string;
  link: string;
  authorName: string;
  publishedDate: string;
  sourceBias: string;
  sourceFactuality: string;
  description: string;
  sourceImageUrl: string;
}

const ArticleModal: React.FC<{
  article: SourceArticle;
  onClose: () => void;
  articles: SourceArticle[];
  title?: string;
}> = ({ article, onClose, articles, title }) => {
  const router = useRouter();
  const modalRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const [selected, setSelected] = useState<SourceArticle>(article);
  const [showFullScreenImage, setShowFullScreenImage] = useState(false);

  // ==================| Effect to animate modal |=================
  useEffect(() => {
    // Set body style immediately to prevent scrolling
    document.body.style.overflow = "hidden";

    // Create animation timeline
    const tl = gsap.timeline();

    if (overlayRef.current) {
      tl.fromTo(overlayRef.current, { opacity: 0 }, { opacity: 1, duration: 0.2 });
    }

    if (modalRef.current) {
      tl.fromTo(
        modalRef.current,
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.25, clearProps: "all" },
        "-=0.1" // Slight overlap with overlay animation
      );
    }

    // Add escape key handler
    const handleEscapeKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleClose();
      }
    };

    document.addEventListener("keydown", handleEscapeKey);

    return () => {
      document.removeEventListener("keydown", handleEscapeKey);
      document.body.style.overflow = "auto";
    };
  }, []);

  // ==================| Effect to set selected article |=================
  useEffect(() => {
    setSelected(article);
  }, [article]);

  const handleClose = () => {
    // Create close animation timeline
    const tl = gsap.timeline({
      onComplete: () => {
        onClose();
      },
    });

    if (modalRef.current) {
      tl.to(modalRef.current, { opacity: 0, y: 10, duration: 0.2 });
    }

    if (overlayRef.current) {
      tl.to(overlayRef.current, { opacity: 0, duration: 0.2 }, "-=0.1");
    }
  };

  const handleSelectArticle = (relatedArticle: SourceArticle) => {
    // Don't do anything if clicking the already selected article
    if (relatedArticle.id === selected.id) return;

    // Set the selected article immediately without animation
    setSelected(relatedArticle);
  };

  // ==================| Handle Analysis Click |=================
  const handleAnalysisClick = () => {
    handleClose();
    // Use setTimeout to ensure the modal is closed before navigation
    setTimeout(() => {
      router.push(`/details/${selected.id}`);
    }, 300);
  };

  // ==================| Handle Modal Backdrop Click |=================
  const handleModalBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  return (
    <>
      {/* Overlay: covers everything except sidebar, closes modal on click */}
      <div
        ref={overlayRef}
        className="fixed inset-0 bg-black/70 z-40"
        onClick={handleModalBackdropClick}
      />

      {/* Container: Row by default, column on small screens */}
      <div
        ref={modalRef}
        className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none 
          max-[965px]:flex-col max-[965px]:px-6 max-[965px]:gap-1 
          max-mobile:h-[calc(100dvh-var(--bottom-tabbar-height))]"
      >
        {/* Article Card: Left-aligned on desktop, top on mobile */}
        <div
          ref={cardRef}
          className="bg-[#232323] relative rounded-xl shadow-xl w-full min-w-[320px] max-w-[605px] flex flex-col mb-4 border border-[#232323] pointer-events-auto
            max-[965px]:max-w-none max-[965px]:rounded-none min-[965px]:w-[calc(100%-22rem)] max-[965px]:mb-2 min-[965px]:ml-[5vw]
            md:mb-0 min-xl:ml-[20vw] min-lg:ml-[10vw] md:mx-4 mx-0 max-xs:min-w-full"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Modal Title - Above the modal */}
          {title && (
            <div className="z-60 pointer-events-none w-full flex-center relative max-[965px]:mb-2">
              <div className="bg-[#232323] w-fit rounded-lg px-4 py-2 shadow-lg pointer-events-auto max-[965px]:pb-1">
                <h1 className="text-white font-semibold text-base uppercase tracking-wide text-center max-[965px]:text-sm">
                  {title}
                </h1>
              </div>
            </div>
          )}

          {/* Mobile close button */}
          <div className="absolute top-1 right-1 z-[100] max-[965px]:block hidden">
            <button
              onClick={handleClose}
              className="p-1 rounded-full bg-[#232323] border border-[#3a3a3a] hover:bg-[#2a2a2a] active:bg-[#2a2a2a] transition-all duration-200 group"
            >
              <CloseIcon className="size-4 text-gray-200 group-hover:text-white group-active:text-white transition-all duration-200" />
            </button>
          </div>

          <div
            className="relative w-full h-40 sm:h-56 cursor-pointer group overflow-hidden"
            onClick={() => setShowFullScreenImage(true)}
          >
            <OptimizedImage
              src={selected.imageUrl}
              alt={selected.title}
              fill
              className="object-cover"
            />
            <div className="absolute z-60 inset-0 bg-black/0 group-hover:bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="size-8 opacity-80"
              >
                <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"></path>
              </svg>
            </div>
          </div>

          <div className="flex-1 flex flex-col gap-2 px-5 py-4">
            <div className="h-12 overflow-hidden max-[965px]:h-6">
              <h2 className="text-lg sm:text-xl font-bold text-white mb-1 leading-tight line-clamp-2 max-[965px]:line-clamp-1">
                {selected.title}
              </h2>
            </div>
            <div className="h-12 overflow-hidden max-[965px]:h-6">
              <p className="text-gray-300 text-xs sm:text-sm mb-2 line-clamp-2 max-[965px]:line-clamp-1">
                {selected.description}
              </p>
            </div>
            <div className="flex items-center text-xs text-gray-400 mb-2">
              {formatTimeAgo(selected.publishedDate)}
            </div>
            <div className="flex items-center gap-2 mt-auto">
              {selected.sourceImageUrl ? (
                <div
                  className={`w-6 h-6 rounded overflow-hidden flex-center ${randomBackgroundColor(
                    selected.id
                  )}`}
                >
                  <OptimizedImage
                    src={selected.sourceImageUrl}
                    alt={selected.sourceName}
                    fill
                    className="object-cover"
                  />
                </div>
              ) : selected.sourceName ? (
                <div className="w-6 h-6 rounded-full bg-[#232323] border border-gray-700 text-white font-bold flex-center">
                  {selected.sourceName.charAt(0)}
                </div>
              ) : null}
              <span className="text-xs text-gray-300 font-medium mr-2 text-ellipsis line-clamp-1">
                {selected.sourceName === "civl.com" ? "CiVL" : selected.sourceName}
              </span>
              <Link href={selected.link} target="_blank" className="ml-auto" prefetch={false}>
                <button
                  className="py-1.5 px-2 rounded hover:bg-white/20 bg-white/10 text-gray-400 hover:text-white"
                  aria-label="Share link"
                >
                  <svg
                    className="size-[16px]"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </Link>
              <button
                onClick={handleAnalysisClick}
                className="ml-1 px-2 py-1.5 rounded bg-white/10 hover:bg-white/20 text-gray-200 text-xs font-semibold flex items-center gap-1"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  className="size-[16px] text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                </svg>
                <span className="max-xs:hidden">CiVL Analysis</span>
              </button>
            </div>
          </div>
        </div>

        {/* Vertical Source Slider: Fixed width, always on right in desktop */}
        <div
          className="w-full bg-[#18191b] md:rounded-l-xl rounded-none shadow-xl overflow-y-auto flex flex-col gap-2 p-2 md:border-t-0 border-t md:border-l border-l-0 border-[#232323] min-[965px]:h-full max-[965px]:h-[30vh] pointer-events-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {articles.map((relatedArticle, idx) => {
            const thumb = relatedArticle.imageUrl || relatedArticle.sourceImageUrl;
            const isSelected = relatedArticle.id === selected.id;
            const baseBg = isSelected
              ? "bg-gradient-to-r from-sec/20 to-sec/10 border-sec"
              : idx % 2 === 0
              ? "bg-gradient-to-r from-white/5 to-white/3"
              : "bg-gradient-to-r from-pri/10 to-pri/5";
            return (
              <button
                key={relatedArticle.id}
                onClick={() => handleSelectArticle(relatedArticle)}
                className={`flex items-center w-full px-2 py-1 border rounded transform-gpus transition-all duration-100 text-left gap-2
                    ${baseBg} ${
                  !isSelected ? "hover:from-sec/15 hover:to-sec/5 border-transparent" : ""
                }`}
                style={{ minWidth: "0" }}
              >
                {thumb ? (
                  <div className="w-12 h-12 rounded overflow-hidden flex items-center justify-center bg-[#232323]">
                    <OptimizedImage
                      src={thumb}
                      alt={relatedArticle.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-12 h-12 rounded overflow-hidden flex items-center justify-center bg-[#232323]">
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <rect width="24" height="24" rx="12" fill="#232323" />
                      <path
                        d="M7 17l5-5 5 5"
                        stroke="#444"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                )}
                <div className="flex-1 min-w-0 flex flex-col justify-center">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-gray-100 truncate line-clamp-1">
                      {relatedArticle.sourceName === "civl.com"
                        ? "CiVL"
                        : relatedArticle.sourceName}
                    </span>
                    <span className="text-[11px] text-gray-500 ml-2 whitespace-nowrap">
                      {formatTimeAgo(relatedArticle.publishedDate)}
                    </span>
                  </div>
                  <div className="text-xs text-gray-300 line-clamp-2 text-ellipsis">
                    {relatedArticle.title}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Full Screen Image */}
      {showFullScreenImage && (
        <FullScreenImage
          src={selected.imageUrl}
          alt={selected.title}
          onClose={() => setShowFullScreenImage(false)}
        />
      )}
    </>
  );
};

export default ArticleModal;
