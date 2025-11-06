"use client";

import { ChevronUpIcon } from "@/assets/icons";
import { cn } from "@/lib/utils";
import { useId, useState } from "react";

type PropsType = {
  label: string;
  items: { value: string; label: string }[];
  prefixIcon?: React.ReactNode;
  className?: string;
  name?: string;
  placeholder?: string;
  defaultValue?: string;
  required?: boolean;
  error?: string; // 🔹 Added
};

export function Select({
  items,
  label,
  defaultValue,
  placeholder,
  prefixIcon,
  className,
  name,
  required,
  error,
}: PropsType) {
  const id = useId();
  const [isOptionSelected, setIsOptionSelected] = useState(
    !!defaultValue && defaultValue !== ""
  );

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setIsOptionSelected(e.target.value !== "");
  };

  return (
    <div className={cn("space-y-3", className)}>
      <label htmlFor={id} className="block text-body-sm font-medium text-white">
        {label}
        {required && <span className="ml-1 select-none text-red-500">*</span>}
      </label>

      <div className="relative">
        {prefixIcon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2">
            {prefixIcon}
          </div>
        )}

        <select
          id={id}
          name={name}
          defaultValue={defaultValue || ""}
          onChange={handleChange}
          className={cn(
            "w-full appearance-none rounded-lg border px-5.5 py-3 outline-none transition",
            "bg-black text-white",
            prefixIcon && "pl-11.5",
            error
              ? "border-red-500 focus:border-red-500"
              : isOptionSelected
              ? "border-purple-500"
              : "border-gray-700 focus:border-purple-500"
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
}
