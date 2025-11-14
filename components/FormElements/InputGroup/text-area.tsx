import React from "react";
import { cn } from "@/lib/utils";

interface TextAreaGroupProps {
  className?: string;
  label: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  name?: string;
  handleChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  value?: string;
  defaultValue?: string;
  error?: string;
}

export const TextAreaGroup: React.FC<TextAreaGroupProps> = ({
  className,
  label,
  placeholder,
  required,
  disabled,
  handleChange,
  name,
  value,
  defaultValue,
  error,
}) => {
  return (
    <div className={className}>
      <label className="text-body-sm font-medium text-white">
        {label}
        {required && <span className="ml-1 text-red-500">*</span>}
      </label>

      <textarea
        name={name}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        onChange={handleChange} // ✅ ADD THIS LINE
        value={value}
        defaultValue={defaultValue}
        className={cn(
          "mt-3 w-full rounded-lg bg-[#1A1B1E] border-[1.5px]  text-white outline-none transition placeholder:text-gray-400",
          error
            ? "border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500"
            : "border-gray-700 focus:border-purple-500",
          "disabled:cursor-not-allowed disabled:bg-gray-800 p-3"
        )}
      ></textarea>

      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
};
