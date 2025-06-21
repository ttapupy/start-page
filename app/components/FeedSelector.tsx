"use client";
import * as React from "react";
import { useForm, FieldValues } from "react-hook-form";
import Checkbox from "./Checkbox";
import { SourceType } from "@/common";

export default function FeedSelector({
  onCheck,
  selectedFeeds,
  sourceEntries,
}: {
  onCheck: (feeds: FieldValues) => Promise<void>;
  selectedFeeds: string[];
  sourceEntries: [string, SourceType][];
}) {
  const { handleSubmit, register, reset } = useForm();
  const [isOpen, setIsOpen] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const onSubmit = async (data: FieldValues) => {
    await onCheck(data);
    setIsOpen(false);
  };

  const handleShowMenu = () => {
    if (mounted) {
      setIsOpen(true);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    reset();
  };

  // Close modal when clicking outside
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  // Close modal on escape key
  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!mounted) {
    return (
      <div className="relative ml-2 w-64">
        <button
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
      </div>
    );
  }

  return (
    <div className="relative ml-2 w-64">
      <button
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
        <div
          className="fixed inset-0 z-50"
          onClick={handleBackdropClick}
        >
          <div className="absolute left-0 top-0 ml-4 mt-10 max-w-prose rounded bg-neutral-100 p-4 text-sm shadow-xl dark:bg-neutral-800">
            <section className="mb-2 flex justify-end">
              <button
                className="cursor-pointer p-2 hover:text-red-300"
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
            <form
              key="feed-selector"
              onSubmit={handleSubmit(onSubmit)}
              className="flex flex-col items-center"
            >
              <ul>
                {sourceEntries
                  .sort((a, b) =>
                    a[1].name?.toLowerCase() > b[1].name?.toLowerCase() ? 1 : -1
                  )
                  .map(([key, value], idx) => {
                    const name = value.name;
                    return (
                      <li key={idx} className="checkbox-menu">
                        <Checkbox
                          selectedFeeds={selectedFeeds}
                          name={name}
                          id={key}
                          register={register}
                        />
                      </li>
                    );
                  })}
              </ul>
              <button
                type="submit"
                className="mt-4 inline-flex w-20 items-center justify-center rounded bg-retro_blue px-5 py-2 text-center text-base font-normal text-white hover:bg-sky-700 hover:bg-opacity-90 disabled:bg-gray-500 lg:px-4 xl:px-5"
              >
                {"Save"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
