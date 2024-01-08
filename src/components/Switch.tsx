import React from "react";

type switchParam = {
  value: boolean;
  onChange: () => void;
};

const Switch = ({ value, onChange }: switchParam) => {
  const toggleClass = "transform translate-x-6";
  return (
    <>
      <div
        onClick={onChange}
        className={` w-[52px] h-6 flex items-center ${
          value === true ? "bg-blue-200" : "bg-gray-300"
        } rounded-full pl-1  cursor-pointer `}
      >
        <div
          className={` ${
            value === true ? "bg-blue-600" : "bg-gray-500"
          }  h-5 w-5 rounded-full shadow-md transition transform  ${
            value ? toggleClass : null
          }`}
        ></div>
      </div>
    </>
  );
};

export default Switch;
