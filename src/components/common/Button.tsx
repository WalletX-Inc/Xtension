import React, { MouseEventHandler, ReactNode } from "react";

type ButtonType = {
  onClick?: MouseEventHandler<HTMLButtonElement>;
  children: ReactNode;
  disabled?: boolean;
  className?: string;
  props?: any;
};

function Button({
  children,
  className = "text-indigo-800 py-2 hover:bg-gray-300 mx-auto md:mx-0 md:flex md:mt-0 items-center justify-center font-medium bg-gray-100 px-1 p-2 rounded-lg mt-4 w-24",
  disabled = false,
  onClick,
  ...props
}: ButtonType) {
  return (
    <button
      className={`px-4 ${className}`}
      disabled={disabled}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
}

export default Button;
