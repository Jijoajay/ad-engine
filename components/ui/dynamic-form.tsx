"use client";

import React, { useState, useEffect, useCallback } from "react";
import InputGroup from "@/components/FormElements/InputGroup";
import { TextAreaGroup } from "@/components/FormElements/InputGroup/text-area";
import { ShowcaseSection } from "./showcase-section";
import { ButtonColorful } from "./button-colorful";
import { FileUploadField } from "../FormElements/FileUploadField";
import Select from "../FormElements/select";
import { useParams } from "next/navigation";

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
  isContain?: boolean
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
  const { slug_id } = useParams<{ slug_id: string }>();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [data, setData] = useState<Record<string, any>>({});
  const [filePreviews, setFilePreviews] = useState<Record<string, string>>({});

  useEffect(() => {
    const initialData: Record<string, any> = {};
    fields.forEach((field) => {
      if (field.value !== undefined) {
        initialData[field.name] = field.value;
      }
    });
    setData(initialData);
  }, [fields]);

  // Basic Validation
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

  // Change handler
  const handleChange = (
    e: any
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


  // Submit
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateForm(data)) return;
    await onSubmit?.(data);
  };

  const setPreview = useCallback((fieldName: string, url: any) => {
    setFilePreviews((prev) => {
      if (prev[fieldName] === url) return prev;
      return { ...prev, [fieldName]: url || "" };
    });
  }, []);

  const handleCancel = () => {
    // Reset all form data to initial values (or empty strings)
    const resetData: Record<string, any> = {};
    fields.forEach((field) => {
      resetData[field.name] = field.value ?? ""; // fallback to empty string
    });
    setData(resetData);

    // Clear errors
    setErrors({});

    // Clear file previews
    setFilePreviews({});
  };


  return (
    <ShowcaseSection
      title={title}
      className="p-6.5 bg-[#222327] text-[#F0F0F0] shadow-lg"
    >
      <form onSubmit={handleSubmit} noValidate>
        {/* Responsive Grid Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {fields.map((field) => {
            const error = errors[field.name];
            const commonProps = {
              key: field.name,
              label: field.label,
              placeholder: field.placeholder ?? "",
              className: `text-white ${field.className ?? ""}`,
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
                  handleChange={(value: string) => {
                    setData((prev) => ({
                      ...prev,
                      [field.name]: value,
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
                  isContain={field?.isContain || false}
                  setData={(name, value) =>
                    setData((prev) => ({ ...prev, [name]: value }))
                  }
                  preview={filePreviews[field.name]}
                  setPreview={(url) => setPreview(field.name, url)}
                />
              );
            }


            // Textarea
            if (field.type === "textarea") {
              return (
                <div className="col-span-2" key={field.name}>
                  <TextAreaGroup
                    {...commonProps}
                    value={data[field.name] ?? ""}
                    handleChange={handleChange}
                  />
                </div>
              );
            }

            // Input fields
            return (
              <InputGroup
                type={field.type}
                {...commonProps}
                value={data[field.name] ?? ""}
              />
            );
          })}
        </div>

        {/* Submit Button */}
        <div className="pt-6 flex justify-end gap-5 items-end w-full">
          <button
            type="button"
            onClick={handleCancel}
            className="px-10 py-2 h-10 cursor-pointer rounded-lg bg-linear-to-r from-gray-600 to-black-600 text-white hover:from-gray-700 hover:to-black-700"
          >
            Cancel
          </button>
          <ButtonColorful
            type="submit"
            isIcon={false}
            label={loading ? "Submitting..." : "Submit"}
            loading={loading}
            className="w-28"
          />
        </div>
      </form>
    </ShowcaseSection>
  );
}
