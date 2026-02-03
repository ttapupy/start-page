import * as React from "react";
import { useForm } from "react-hook-form";
import { SourceType } from "@/common";

interface AddFeedFormData {
  feedUrl: string;
}

interface AddFeedFormProps {
  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
  onSubmit: (url: string) => Promise<
    | { ok: true; feedKey: string; source: SourceType }
    | { ok: false; error: string }
  >;
  onSuccess: (feedKey: string) => void;
}

const HTTPS_URL_PATTERN = /^https:\/\/(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}(?::\d{1,5})?(?:\/\S*)?$/;

export default function AddFeedForm({
  isOpen,
  onToggle,
  onClose,
  onSubmit,
  onSuccess,
}: AddFeedFormProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<AddFeedFormData>();

  const handleFormSubmit = async (data: AddFeedFormData) => {
    try {
      const result = await onSubmit(data.feedUrl);
      if (!result.ok) {
        setError("feedUrl", { type: "server", message: result.error });
        return;
      }
      reset();
      onSuccess(result.feedKey);
    } catch {
      setError("feedUrl", { type: "server", message: "Something went wrong. Please try again." });
    }
  };

  const handleClose = React.useCallback(() => {
    reset();
    onClose();
  }, [reset, onClose]);

  React.useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        handleClose();
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        handleClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, handleClose]);

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        onClick={onToggle}
        className="cursor-pointer p-4 hover:text-green-300"
        title="Add feed"
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
          <path d="M12 5v14M5 12h14" />
        </svg>
      </button>
      {isOpen && (
        <form
          onSubmit={handleSubmit(handleFormSubmit)}
          noValidate
          className="absolute left-0 top-[3.2em] z-50 flex flex-col gap-2 rounded bg-neutral-100 p-3 text-sm shadow-xl dark:bg-gray-900"
        >
          <div className="flex items-center gap-2">
            <input
              type="url"
              placeholder="https://example.com/rss.xml"
              className="w-64 rounded border border-gray-300 bg-white px-2 py-1 text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
              aria-label="Feed URL"
              disabled={isSubmitting}
              {...register("feedUrl", {
                required: "Please enter a feed URL.",
                pattern: {
                  value: HTTPS_URL_PATTERN,
                  message: "Please enter a valid https URL.",
                },
              })}
            />
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center justify-center rounded bg-retro_blue px-3 py-1 text-sm font-normal text-white hover:bg-sky-700 hover:bg-opacity-90 disabled:bg-gray-500"
            >
              {isSubmitting ? "Saving..." : "Save"}
            </button>
          </div>
          {errors.feedUrl && (
            <span className="text-xs text-red-500">{errors.feedUrl.message}</span>
          )}
        </form>
      )}
    </div>
  );
}
