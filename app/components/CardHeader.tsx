"use client";

interface ICardHeaderProps {
  date: Date | null;
  handleClose: () => any;
}

const CardHeader = ({ date, handleClose }: ICardHeaderProps) => {
  return (
    <div className="mb-2 flex flex-row-reverse justify-between">
      <button
        className="hover:text-red-500"
        title={"Hide article"}
        onClick={() => handleClose()}
      >
        <svg
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          className="h-4 w-4"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
      {!!date && (
        <small className="text-left font-mono text-slate-600 dark:text-slate-300">
          {date.toISOString().substring(0, 10)}
        </small>
      )}
    </div>
  );
};
export default CardHeader;
