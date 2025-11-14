"use client";

import { cn } from "@/lib/utils";
import { useId } from "react";
import {
  Select as ShadSelect,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type SelectProps = {
  className?: string;
  label: string;
  name: string;
  placeholder?: string;
  required?: boolean;
  value: string;
  items: { label: string; value: string }[];
  handleChange: (value: string) => void; // <- changed (shadcn uses onValueChange)
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
      {/* Label */}
      <label htmlFor={id} className="text-body-sm font-medium text-white">
        {label}
        {required && <span className="ml-1 text-red-500">*</span>}
      </label>

      {/* Select Wrapper */}
      <div className="relative">
        {prefixIcon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10">
            {prefixIcon}
          </div>
        )}

        <ShadSelect value={value} onValueChange={handleChange} name={name}>
          <SelectTrigger
            id={id}
            className={cn(
              "w-full h-[50px] rounded-lg mt-2 border bg-[#1A1B1E] text-[#F0F0F0] px-4",
              prefixIcon && "pl-11",
              error
                ? "border-red-500 focus:ring-red-500"
                : "border-gray-700 focus:ring-purple-500"
            )}
          >
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>

          <SelectContent className="bg-black text-white border-gray-700">
            {items.map((item) => (
              <SelectItem
                key={item.value}
                value={item.value}
                className="text-white focus:bg-gray-800"
              >
                {item.label}
              </SelectItem>
            ))}
          </SelectContent>
        </ShadSelect>
      </div>

      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
};

export default Select;
