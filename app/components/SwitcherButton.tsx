import React, {FC} from 'react';

export interface ISwitcherButtonProps {
  setTheme: () => void;
  pathD: string;
  className: string;

}

const SwitcherButton: FC<ISwitcherButtonProps> = ({setTheme, pathD, className}) => {

  return (
    <>
      <button onClick={() => setTheme()}>
      <svg
          xmlns="http://www.w3.org/2000/svg"
          className={className}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d={pathD}
          />
        </svg>
      </button>
    </>
  );
}

export default SwitcherButton;