import { FC } from "react";

interface stepProps {
  completedSteps: Array<number>;
}
export const StepHeader: FC<stepProps> = ({ completedSteps }): JSX.Element => {
  return (
    <ol
      className="flex items-center w-full
     p-3 my-2 flex-row justify-center space-x-2 font-medium text-center text-gray-500
      "
    >
      <li
        className={`flex items-center ${
          completedSteps.includes(1) ? "text-blue-600" : ""
        }`}
      >
        <span
          className={`flex items-center justify-center w-5 h-5 me-2 text-xs border rounded-full shrink-0
           ${completedSteps.includes(1) ? "border-blue-600" : ""} `}
        >
          1
        </span>
        Connect
        {/* <span className="hidden sm:inline-flex sm:ms-2">Info</span> */}
        <svg
          className="w-3 h-3 ms-2 sm:ms-4 rtl:rotate-180"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 12 10"
        >
          <path
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="m7 9 4-4-4-4M1 9l4-4-4-4"
          />
        </svg>
      </li>
      <li
        className={`flex items-center  ${
          completedSteps.includes(2) ? "text-blue-600" : ""
        }`}
      >
        <span
          className={`flex items-center justify-center w-5 h-5 me-2 text-xs border border-gray-500 rounded-full shrink-0 dark:border-gray-400  ${
            completedSteps.includes(2) ? "border-blue-600" : ""
          }`}
        >
          2
        </span>
        Verify
        {/* <span className="hidden sm:inline-flex sm:ms-2">Info</span> */}
        <svg
          className="w-3 h-3 ms-2 sm:ms-4 rtl:rotate-180"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 12 10"
        >
          <path
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="m7 9 4-4-4-4M1 9l4-4-4-4"
          />
        </svg>
      </li>
      <li
        className={`flex items-center  ${
          completedSteps.includes(3) ? "text-blue-600" : ""
        }`}
      >
        <span
          className={`flex items-center justify-center w-5 h-5 me-2 text-xs border border-gray-500 rounded-full shrink-0 dark:border-gray-400 
         ${completedSteps.includes(3) ? "border-blue-600" : ""}`}
        >
          3
        </span>
        Complete
      </li>
    </ol>
  );
};

export default StepHeader;
