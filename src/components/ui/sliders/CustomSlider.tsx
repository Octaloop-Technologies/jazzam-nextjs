"use client";

import React, { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import { Draggable } from "gsap/Draggable";
import OptimizedImage from "@/components/ui/image/OptimizedImage";
import { ArrowRightIcon } from "@/components/svgs/ArrowIcon";

gsap.registerPlugin(Draggable);

interface SliderItem {
  id: string | number;
  title?: string;
  description?: string;
  imageUrl: string;
}

interface CustomSliderProps {
  items: SliderItem[];
  slidesPerView?: number;
  spaceBetween?: number;
  sectionTitle?: string;
}

const CustomSlider: React.FC<CustomSliderProps> = ({
  items,
  slidesPerView: initialSlidesPerView = 3,
  spaceBetween = 16,
  sectionTitle,
}) => {
  const sliderRef = useRef<HTMLDivElement>(null);
  const itemsContainerRef = useRef<HTMLDivElement>(null);
  const [itemWidth, setItemWidth] = useState(0);
  const [slidesPerView, setSlidesPerView] = useState(initialSlidesPerView);
  const [currentX, setCurrentX] = useState(0);
  const [bounds, setBounds] = useState({ minX: 0, maxX: 0 });

  const totalItems = items.length;

  useEffect(() => {
    const updateSlidesPerView = () => {
      if (window.innerWidth < 768) {
        setSlidesPerView(1.3);
      } else if (window.innerWidth < 1024) {
        setSlidesPerView(2.1);
      } else if (window.innerWidth < 1280) {
        setSlidesPerView(Math.min(initialSlidesPerView, 3));
      } else {
        setSlidesPerView(Math.min(initialSlidesPerView, 5));
      }
    };

    updateSlidesPerView();
    window.addEventListener("resize", updateSlidesPerView);
    return () => window.removeEventListener("resize", updateSlidesPerView);
  }, [initialSlidesPerView]);

  useEffect(() => {
    if (itemsContainerRef.current && sliderRef.current) {
      const containerWidth = sliderRef.current.offsetWidth;
      const totalSpace = spaceBetween * (slidesPerView - 1);
      const newWidth = (containerWidth - totalSpace) / slidesPerView;
      setItemWidth(newWidth);
    }
  }, [slidesPerView, spaceBetween, sliderRef.current?.offsetWidth]);

  useEffect(() => {
    if (
      !itemsContainerRef.current ||
      !sliderRef.current ||
      !itemWidth ||
      totalItems <= slidesPerView
    )
      return;

    const containerWidth = itemsContainerRef.current.offsetWidth;
    const sliderWidth = sliderRef.current.offsetWidth;
    const newBounds = {
      minX: Math.min(0, sliderWidth - containerWidth),
      maxX: 0,
    };
    setBounds(newBounds);

    const draggableInstance = Draggable.create(itemsContainerRef.current, {
      type: "x",
      edgeResistance: 0.65,
      bounds: newBounds,
      inertia: true,
      cursor: "grab",
      activeCursor: "grabbing",
      onDragEnd: function () {
        setCurrentX(this.x);
      },
      onThrowUpdate: function () {
        setCurrentX(this.x);
      },
    });

    return () => {
      draggableInstance[0].kill();
    };
  }, [itemWidth, totalItems, spaceBetween, slidesPerView]);

  const handleNext = () => {
    if (!sliderRef.current || !itemsContainerRef.current) return;
    const newX = Math.max(currentX - sliderRef.current.offsetWidth, bounds.minX);
    setCurrentX(newX);
    gsap.to(itemsContainerRef.current, { x: newX, duration: 0.5, ease: "power2.inOut" });
  };

  const handlePrev = () => {
    if (!itemsContainerRef.current || !sliderRef.current) return;
    const newX = Math.min(currentX + sliderRef.current.offsetWidth, bounds.maxX);
    setCurrentX(newX);
    gsap.to(itemsContainerRef.current, { x: newX, duration: 0.5, ease: "power2.inOut" });
  };

  if (!items || items.length === 0) {
    return <div className="text-center py-4 text-gray-500">No items to display.</div>;
  }

  return (
    <div className="relative bg-white/5 rounded-lg p-4">
      {sectionTitle && <h2 className="text-2xl font-semibold mb-4 text-white">{sectionTitle}</h2>}
      <div className="relative lg:mx-12" ref={sliderRef}>
        <div className="overflow-hidden relative rounded-lg">
          <div
            ref={itemsContainerRef}
            className="flex"
            style={{
              width: `${totalItems * itemWidth + (totalItems - 1) * spaceBetween}px`,
            }}
          >
            {items.map((item, index) => (
              <div
                key={item.id}
                className="flex-shrink-0"
                style={{
                  width: `${itemWidth}px`,
                  marginRight: index === totalItems - 1 ? 0 : `${spaceBetween}px`,
                }}
              >
                {/* Simplified Card Content */}
                <div className="bg-neutral-800 rounded-lg overflow-hidden h-full flex flex-col">
                  <div className="relative w-full aspect-[16/9]">
                    <OptimizedImage
                      src={item.imageUrl}
                      alt={item.title || "Image"}
                      fill
                      className="object-cover"
                    />
                  </div>
                  {(item.title || item.description) && (
                    <div className="p-3">
                      <h3 className="text-sm font-semibold text-white mb-1 line-clamp-2">
                        {item.title}
                      </h3>
                      {item.description && (
                        <p className="text-xs text-gray-400 line-clamp-2">{item.description}</p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
        {totalItems > slidesPerView && (
          <>
            <button
              onClick={handlePrev}
              disabled={currentX >= bounds.maxX}
              className="absolute top-1/2 left-[-54px] z-10 -translate-y-1/2 bg-neutral-800/80 backdrop-blur-sm rounded-full p-3 text-white hidden lg:flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:bg-neutral-700 transition-all"
            >
              <ArrowRightIcon className="size-6 rotate-180" />
            </button>
            <button
              onClick={handleNext}
              disabled={currentX <= bounds.minX}
              className="absolute top-1/2 right-[-54px] z-10 -translate-y-1/2 bg-neutral-800/80 backdrop-blur-sm rounded-full p-3 text-white hidden lg:flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:bg-neutral-700 transition-all"
            >
              <ArrowRightIcon className="size-6" />
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default CustomSlider;
