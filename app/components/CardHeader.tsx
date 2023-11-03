'use client'

interface ICardHeaderProps {
  date: Date | null;
  handleClose: () => any;
}

const CardHeader = ({ date, handleClose }: ICardHeaderProps) => {

  return (
    <div className="flex flex-row-reverse justify-between mb-2">
      <button className="hover:text-red-500" title={"Hide article"} onClick={() => handleClose()}>
        <svg fill="none" viewBox="0 0 24 24" strokeWidth="1.5"
          stroke="currentColor" className="w-4 h-4">
          <path strokeLinecap="round" strokeLinejoin="round"
            d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
      {!!date &&
        <small className='font-mono text-left text-slate-600 dark:text-slate-300'>
          {date.toISOString().substring(0, 10)}
        </small>
      }
    </div>
  )
}
export default CardHeader;