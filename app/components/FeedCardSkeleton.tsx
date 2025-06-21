"use client";

import React from "react";
import { twMerge } from "tailwind-merge";

const skeletonCardClass = twMerge(
  "bg-papirus_light dark:bg-crt_background rounded-lg border-2 border-gray-300 dark:border-gray-700 shadow-sm max-w-[420px] p-4 flex flex-col justify-between animate-pulse mb-3",
);

export default function FeedCardSkeleton({ count = 5 }: { count?: number }) {
  return (
    <div className="px-auto mr-auto min-w-[320px] max-w-[100%] flex-[0_0_auto] pb-[5em]">
      {/* Header skeleton */}
      <div className="mb-4 flex justify-start">
        <div className="h-6 w-24 rounded bg-gray-300 dark:bg-gray-700" />
      </div>

      {/* Skeleton cards */}
      {Array.from({ length: count }).map((_, idx) => (
        <div key={idx} className={skeletonCardClass}>
          {/* Header (date & close icon placeholder) */}
          <div className="flex justify-between items-center mb-2">
            <div className="h-4 w-1/4 rounded bg-gray-300 dark:bg-gray-700" />
            <div className="h-4 w-4 rounded-full bg-gray-300 dark:bg-gray-700" />
          </div>

          {/* Title */}
          <div className="h-5 w-3/4 rounded bg-gray-300 dark:bg-gray-700 mb-3" />

          {/* Image or text block */}
          <div className="h-36 w-full rounded bg-gray-200 dark:bg-gray-800 mb-3" />
        </div>
      ))}
    </div>
  );
}
