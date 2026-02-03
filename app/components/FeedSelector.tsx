"use client";
import * as React from "react";
import { useForm } from "react-hook-form";
import Checkbox from "./Checkbox";
import { SourceType } from "@/common";

interface FeedSelectorProps {
  onCheck: (feeds: Record<string, boolean>) => Promise<void>;
  onRemoveFeed: (feedKey: string, isCustom: boolean) => Promise<void>;
  selectedFeeds: string[];
  customFeedKeys: Set<string>;
  sourceEntries: [string, SourceType][];
  forceOpenWithHighlight?: string | null;
  onHighlightCleared?: () => void;
}

export default function FeedSelector({
  onCheck,
  onRemoveFeed,
  selectedFeeds,
  customFeedKeys,
  sourceEntries,
  forceOpenWithHighlight,
  onHighlightCleared,
}: FeedSelectorProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);
  const [highlightedKey, setHighlightedKey] = React.useState<string | null>(null);
  const listRef = React.useRef<HTMLUListElement>(null);
  const modalRef = React.useRef<HTMLDivElement>(null);
  const buttonRef = React.useRef<HTMLButtonElement>(null);

  const defaultValues = React.useMemo(() => {
    const values: Record<string, boolean> = {};
    sourceEntries.forEach(([key]) => {
      values[key] = selectedFeeds.includes(key);
    });
    return values;
  }, [sourceEntries, selectedFeeds]);

  const { register, setValue, reset, getValues } = useForm<Record<string, boolean>>({
    defaultValues,
  });

  React.useEffect(() => {
    reset(defaultValues);
  }, [defaultValues, reset]);

  const handleCheckboxChange = React.useCallback(() => {
    const values = getValues();
    onCheck(values);
  }, [getValues, onCheck]);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  React.useEffect(() => {
    if (forceOpenWithHighlight && mounted) {
      setIsOpen(true);
      setHighlightedKey(forceOpenWithHighlight);
      setValue(forceOpenWithHighlight, true);
      handleCheckboxChange();

      const timer = setTimeout(() => {
        setHighlightedKey(null);
        onHighlightCleared?.();
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [forceOpenWithHighlight, mounted, setValue, onHighlightCleared, handleCheckboxChange]);

  React.useEffect(() => {
    if (isOpen && highlightedKey && listRef.current) {
      const element = listRef.current.querySelector(`[data-feed-key="${highlightedKey}"]`);
      element?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [isOpen, highlightedKey]);

  const handleShowMenu = () => {
    if (mounted) {
      setIsOpen(!isOpen);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  // Close modal on escape key or click outside
  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleClose();
      }
    };

    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      const isOutsideModal = modalRef.current && !modalRef.current.contains(target);
      const isOnBurgerButton = buttonRef.current && buttonRef.current.contains(target);

      if (isOutsideModal && !isOnBurgerButton) {
        handleClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.addEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.removeEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!mounted) {
    return (
      <div className="relative ml-2 w-64">
        <button className="cursor-pointer p-4 hover:text-green-300" id="burger">
          <svg
            className="h-6 w-6"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M4 6h16M4 12h16M4 18h16"></path>
          </svg>
        </button>
      </div>
    );
  }

  return (
    <div className="relative ml-2 w-64">
      <button
        ref={buttonRef}
        onClick={handleShowMenu}
        className="cursor-pointer p-4 hover:text-green-300"
        id="burger"
      >
        <svg
          className="h-6 w-6"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M4 6h16M4 12h16M4 18h16"></path>
        </svg>
      </button>

      {isOpen && (
        <div className="fixed top-[4em] left-0 right-0 bottom-0 z-50 bg-black/50 backdrop-blur-sm">
          <div
            ref={modalRef}
            className="absolute left-0 top-[-3em] ml-4 mt-10 min-w-[17rem] rounded bg-neutral-100 p-4 text-sm shadow-xl dark:bg-gray-900"
          >
            <section className="mb-2 flex justify-start">
              <button
                className="cursor-pointer p-2 hover:text-red-300 -ml-3"
                onClick={handleClose}
                title="close"
              >
                <svg
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="h-6 w-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </section>
            <form>
              <ul ref={listRef}>
                {sourceEntries
                  .sort((a, b) =>
                    a[1].name?.toLowerCase() > b[1].name?.toLowerCase()
                      ? 1
                      : -1,
                  )
                  .map(([key, value], idx) => {
                    const name = value.name;
                    const isCustom = customFeedKeys.has(key);
                    return (
                      <li
                        key={idx}
                        className="checkbox-menu"
                        data-feed-key={key}
                      >
                        <Checkbox
                          name={name}
                          id={key}
                          register={register}
                          isHighlighted={highlightedKey === key}
                          onChange={handleCheckboxChange}
                        />
                        <button
                          type="button"
                          onClick={() => onRemoveFeed(key, isCustom)}
                          className="ml-2 text-gray-400 hover:text-red-500"
                          title="Remove feed"
                        >
                          <svg
                            className="h-4 w-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </button>
                      </li>
                    );
                  })}
              </ul>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
