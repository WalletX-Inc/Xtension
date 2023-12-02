import React, { FC, ChangeEvent, useState, useEffect } from "react";
import { Check, ChevronDown } from "react-feather";

interface Option {
  label: string;
  value: string;
}

interface SelectProps {
  options: Option[];
  onChange: (selectedValue: string) => void;
  [key: string]: any;
}

const Select: FC<SelectProps> = ({ options, onChange, ...rest }) => {
  const [selectedValue, setSelectedValue] = useState<string>("");
  const handleSelectChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const selectedVal = event.target.value;
    setSelectedValue(selectedVal);
    onChange(selectedVal);
  };

  useEffect(() => {
    // Set the initial selected value to an empty string
    setSelectedValue("");
  }, []);

  return (
    <div className="relative inline-block min-w-[280px] ">
      {/* Render additional props dynamically */}

      <select
        onChange={handleSelectChange}
        value={selectedValue}
        className={`block cursor-pointer text-center min-h-[40px] placeholder:text-xl text-xl appearance-none w-full bg-gray-900 border border-gray-300 hover:border-gray-500 
        px-4 py-2 pr-8 rounded leading-tight focus:outline-none focus:shadow-outline overflow-hidden max-w-[300px] ${rest.className}`}
      >
        <option value="" disabled>
          {rest?.label ? rest.label : "Select an option"}
        </option>

        {options.length &&
          options.map((option, index) => (
            <option key={index} value={option.value} className="cursor-pointer">
              {option.label.length > 20
                ? `${option.label.slice(0.2)}...`
                : option.label}
            </option>
          ))}
      </select>

      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-white">
        {/* Customize the dropdown icon */}
        <ChevronDown className="ml-2" />
      </div>
    </div>
  );
};

export default Select;
