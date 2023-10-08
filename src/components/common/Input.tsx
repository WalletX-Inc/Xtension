import { ChangeEvent } from "react";

type Props = {
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  name?: string;
  value?: string;
  className?: string;
  type?: string;
  id?: string;
  label?: string;
  otherProps?: any;
};
function Input({
  onChange,
  name,
  placeholder,
  value,
  className,
  type,
  id,
  label,
  otherProps,
}: Props) {
  return (
    <div className="my-2">
      {label && (
        <label className="block text-sm font-medium text-gray-900 dark:text-white">
          {label}
        </label>
      )}
      <input
        className={`block w-full p-2 placeholder:text-sm placeholder:italic placeholder:text-slate-400 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 sm:text-xs focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 ${className}`}
        onChange={onChange}
        name={name}
        placeholder={placeholder}
        value={value}
        type={type}
        id={id}
        {...otherProps}
      />
    </div>
  );
}

export default Input;
