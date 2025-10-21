
import React from 'react';

const SparklesIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
  >
    <path
      fillRule="evenodd"
      d="M9.315 7.584C12.195 3.883 16.695 1.5 21.75 1.5a.75.75 0 01.75.75c0 5.056-2.383 9.555-6.084 12.436A6.75 6.75 0 019.75 22.5a.75.75 0 01-.75-.75v-7.184c0-1.681.673-3.352 1.88-4.524.96-1.121 2.24-2.203 3.553-3.136A8.25 8.25 0 009.315 7.584zM15 15.75a.75.75 0 01.75-.75a6 6 0 006-6 .75.75 0 011.5 0a7.5 7.5 0 01-7.5 7.5.75.75 0 01-.75-.75z"
      clipRule="evenodd"
    />
    <path
      d="M3 8.625a.75.75 0 01.75-.75h.008v.008a.75.75 0 01-.75.75h-.008V8.625z"
    />
    <path
      d="M6.75 5.25a.75.75 0 01.75-.75H7.5v.008a.75.75 0 01-.75.75H6.75V5.25z"
    />
     <path
      d="M6 12.75a.75.75 0 01.75-.75h.008v.008a.75.75 0 01-.75.75H6v-.008z"
    />
  </svg>
);

export default SparklesIcon;
