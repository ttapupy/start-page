import * as React from "react";

interface AddFeedFormProps {
  feedUrl: string;
  isOpen: boolean;
  onToggle: () => void;
  onChange: (value: string) => void;
  onSubmit: () => void;
}

export default function AddFeedForm({
  feedUrl,
  isOpen,
  onToggle,
  onChange,
  onSubmit,
}: AddFeedFormProps) {
  return (
    <div className="relative">
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
          onSubmit={(event) => {
            event.preventDefault();
            onSubmit();
          }}
          className="absolute left-0 top-[3.2em] z-50 flex items-center gap-2 rounded bg-neutral-100 p-3 text-sm shadow-xl dark:bg-gray-900"
        >
          <input
            type="url"
            value={feedUrl}
            onChange={(event) => onChange(event.target.value)}
            placeholder="https://example.com/rss.xml"
            className="w-64 rounded border border-gray-300 bg-white px-2 py-1 text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
            aria-label="Feed URL"
            required
          />
          <button
            type="submit"
            className="inline-flex items-center justify-center rounded bg-retro_blue px-3 py-1 text-sm font-normal text-white hover:bg-sky-700 hover:bg-opacity-90 disabled:bg-gray-500"
          >
            {"Save"}
          </button>
        </form>
      )}
    </div>
  );
}
