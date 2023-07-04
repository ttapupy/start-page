interface ICardHeaderProps {
  date: Date | null;
  handleClose: () => any;
}

const CardHeader = ({date, handleClose}: ICardHeaderProps) => {

  return (
      <div className="flex flex-row-reverse justify-between">
        <button className="hover:text-red-500" title={"Hide article"} onClick={() => handleClose()}>
          <svg fill="none" viewBox="0 0 24 24" strokeWidth="1.5"
               stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round"
                  d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
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