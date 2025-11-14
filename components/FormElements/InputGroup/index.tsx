import { cn } from "@/lib/utils";
import { type HTMLInputTypeAttribute, useId } from "react";

type InputGroupProps = {
  className?: string;
  label: string;
  placeholder: string;
  type: HTMLInputTypeAttribute;
  fileStyleVariant?: "style1" | "style2";
  required?: boolean;
  disabled?: boolean;
  active?: boolean;
  handleChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  value?: string;
  name?: string;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
  height?: "sm" | "default";
  defaultValue?: string;
  error?: string;
};

const InputGroup: React.FC<InputGroupProps> = ({
  className,
  label,
  type,
  placeholder,
  required,
  disabled,
  active,
  handleChange,
  icon,
  error,
  ...props
}) => {
  const id = useId();

  return (
    <div className={className}>
      <label htmlFor={id} className="text-body-sm font-medium text-white">
        {label}
        {required && <span className="ml-1 select-none text-red-500">*</span>}
      </label>

      <div
        className={cn(
          "relative mt-2 [&_svg]:absolute [&_svg]:top-1/2 [&_svg]:-translate-y-1/2",
          props.iconPosition === "left"
            ? "[&_svg]:left-4.5"
            : "[&_svg]:right-4.5"
        )}
      >
        <input
          id={id}
          type={type}
          name={props.name}
          placeholder={placeholder}
          onChange={handleChange}
          value={props.value}
          defaultValue={props.defaultValue}
          className={cn(
            "w-full rounded-lg h-[39px] border bg-[#1A1B1E] text-[#F0F0F0] placeholder:text-gray-400 outline-none transition",
            error
              ? "border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500"
              : "border-gray-700 focus:border-purple-500 focus:ring-1 focus:ring-purple-500",
            "disabled:cursor-not-allowed disabled:bg-gray-800",
            type === "file"
              ? getFileStyles(props.fileStyleVariant!)
              : "px-4",
            props.iconPosition === "left" && "pl-11",
            props.height === "sm" && "h-[38px] py-2.5"
          )}
          required={required}
          disabled={disabled}
          data-active={active}
        />

        {icon}
      </div>

      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
};

export default InputGroup;

function getFileStyles(variant: "style1" | "style2") {
  switch (variant) {
    case "style1":
      return `file:mr-5 file:border-collapse file:cursor-pointer file:border-0 file:border-r file:border-solid file:border-gray-700 file:bg-gray-800 file:px-6.5 file:py-[13px] file:text-body-sm file:font-medium file:text-gray-300 hover:file:bg-purple-500 hover:file:text-white`;
    default:
      return `file:mr-4 file:rounded file:border-[0.5px] file:border-gray-700 file:bg-gray-800 file:px-2.5 file:py-1 file:text-body-xs file:font-medium file:text-gray-300 hover:file:border-purple-500 hover:file:text-white`;
  }
}
