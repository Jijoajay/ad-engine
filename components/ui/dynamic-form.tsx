"use client";

import React, { useState, useEffect } from "react";
import InputGroup from "@/components/FormElements/InputGroup";
import { TextAreaGroup } from "@/components/FormElements/InputGroup/text-area";
import { ShowcaseSection } from "./showcase-section";
import { ButtonColorful } from "./button-colorful";
import { FileUploadField } from "../FormElements/FileUploadField";
import Select from "../FormElements/select";

type FieldType =
  | "text"
  | "email"
  | "number"
  | "date"
  | "select"
  | "textarea"
  | "file"
  | string;

interface FormField {
  label: string;
  name: string;
  type: FieldType;
  placeholder?: string;
  required?: boolean;
  className?: string;
  options?: { label: string; value: string }[];
  value?: any; 
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
  loading = false,
  onSubmit,
}: DynamicFormProps) {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [data, setData] = useState<Record<string, any>>({});
  const [filePreviews, setFilePreviews] = useState<Record<string, string>>({});

  // ✅ Sync field values whenever they change (e.g., after fetch)
  useEffect(() => {
    const initialData: Record<string, any> = {};
    fields.forEach((field) => {
      if (field.value !== undefined) {
        initialData[field.name] = field.value;
      }
    });
    setData(initialData);
  }, [fields]);

  // ✅ Basic Validation
  const validateForm = (formData: Record<string, any>) => {
    const newErrors: Record<string, string> = {};
    fields.forEach((field) => {
      const value = formData[field.name];
      if (field.required && (!value || value.toString().trim() === "")) {
        newErrors[field.name] = `${field.label} is required`;
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ✅ Change handler for text/textarea/select
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));

    if (errors[name] && value.trim() !== "") {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  // ✅ Submit
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

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

          // Select Input
          if (field.type === "select") {
            return (
              <Select
                {...commonProps}
                items={field.options ?? []}
                value={data[field.name] ?? ""}
                handleChange={(e) => {
                  handleChange(e);
                  setData((prev) => ({
                    ...prev,
                    [field.name]: e.target.value,
                  }));
                }}
              />
            );
          }

          // File Upload
          if (field.type === "file") {
            return (
              <FileUploadField
                key={field.name}
                field={field}
                value={data[field.name]}
                setData={(name, value) =>
                  setData((prev) => ({ ...prev, [name]: value }))
                }
                preview={filePreviews[field.name]}
                setPreview={(url) =>
                  setFilePreviews((prev) => ({
                    ...prev,
                    [field.name]: url || "",
                  }))
                }
              />
            );
          }

          // Textarea
          if (field.type === "textarea") {
            return (
              <TextAreaGroup
                {...commonProps}
                value={data[field.name] ?? ""}
                handleChange={handleChange}
              />
            );
          }

          // Input fields (text, number, date, etc.)
          return (
            <InputGroup
              type={field.type}
              {...commonProps}
              value={data[field.name] ?? ""}
            />
          );
        })}

        <div className="pt-4">
          <ButtonColorful
            type="submit"
            isIcon={false}
            label={loading ? "Submitting..." : "Submit"}
            loading={loading}
          />
        </div>
      </form>
    </ShowcaseSection>
  );
}
