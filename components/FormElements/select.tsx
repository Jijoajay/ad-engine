"use client";

import { cn } from "@/lib/utils";
import { useId } from "react";
import { ChevronUpIcon } from "@/assets/icons";

type SelectProps = {
  className?: string;
  label: string;
  name: string;
  placeholder?: string;
  required?: boolean;
  value: string;
  items: { label: string; value: string }[];
  handleChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  error?: string;
  prefixIcon?: React.ReactNode;
};

const Select: React.FC<SelectProps> = ({
  className,
  label,
  name,
  placeholder,
  required,
  value,
  items,
  handleChange,
  error,
  prefixIcon,
}) => {
  const id = useId();

  return (
    <div className={cn("space-y-3", className)}>
      <label htmlFor={id} className="text-body-sm font-medium text-white">
        {label}
        {required && <span className="ml-1  select-none text-red-500">*</span>}
      </label>

      <div className="relative">
        {prefixIcon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2">{prefixIcon}</div>
        )}

        <select
          id={id}
          name={name}
          value={value}
          onChange={handleChange}
          className={cn(
            "w-full appearance-none h-[50px] rounded-lg mt-2 border px-5.5 py-3 outline-none transition bg-black text-white",
            prefixIcon && "pl-11.5",
            error
              ? "border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500"
              : "border-gray-700 focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
          )}

        >
          {placeholder && (
            <option value="" disabled hidden>
              {placeholder}
            </option>
          )}
          {items.map((item) => (
            <option key={item.value} value={item.value} className="text-black">
              {item.label}
            </option>
          ))}
        </select>

        <ChevronUpIcon className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 rotate-180 text-white" />
      </div>

      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
};

export default Select;
