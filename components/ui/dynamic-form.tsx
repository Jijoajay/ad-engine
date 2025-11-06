"use client";

import React, { useState } from "react";
import InputGroup from "@/components/FormElements/InputGroup";
import { TextAreaGroup } from "@/components/FormElements/InputGroup/text-area";
import { Select } from "@/components/FormElements/select";
import { ShowcaseSection } from "./showcase-section";
import { ButtonColorful } from "./button-colorful";

type FieldType =
  | "text"
  | "email"
  | "number"
  | "date"
  | "select"
  | "textarea"
  | string;

interface FormField {
  label: string;
  name: string;
  type: FieldType;
  placeholder?: string;
  required?: boolean;
  className?: string;
  options?: { label: string; value: string }[];
}

interface DynamicFormProps {
  title?: string;
  fields: FormField[];
  loading?: boolean;
  onSubmit?: (formData: Record<string, any>) => Promise<void> | void;
}

export function DynamicForm({
  title = "Dynamic Form",
  fields,
  loading=false,
  onSubmit,
}: DynamicFormProps) {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (formData: Record<string, any>) => {
    const newErrors: Record<string, string> = {};
    fields.forEach((field) => {
      if (field.required && !formData[field.name]?.trim()) {
        newErrors[field.name] = `${field.label} is required`;
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    if (errors[name] && value.trim() !== "") {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const data: Record<string, any> = {};
    formData.forEach((value, key) => (data[key] = value));

    if (!validateForm(data)) return;
    await onSubmit?.(data);
  };

  return (
    <ShowcaseSection
      title={title}
      className="p-6.5 rounded-xl bg-black text-white shadow-lg"
    >
      <form onSubmit={handleSubmit} noValidate>
        {fields.map((field) => {
          const error = errors[field.name];
          const commonProps = {
            key: field.name,
            label: field.label,
            placeholder: field.placeholder ?? "",
            className: `mb-4.5 text-white ${field.className ?? ""}`,
            name: field.name,
            required: field.required,
            error,
            handleChange,
          };

          if (field.type === "select") {
            return <Select {...commonProps} items={field.options ?? []} />;
          }

          if (field.type === "textarea") {
            return <TextAreaGroup {...commonProps} />;
          }

          return <InputGroup type={field.type} {...commonProps} />;
        })}

        <ButtonColorful
          type="submit"
          isIcon={false}
          label="Submit"
          loading={loading} 
        />
      </form>
    </ShowcaseSection>
  );
}
