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
  isContain?: boolean;
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

  /**
   * Initialize values from provided fields
   */
  useEffect(() => {
    const initialData: Record<string, any> = {};
    fields.forEach((field) => {
      if (field.value !== undefined) {
        initialData[field.name] = field.value;
      }
    });
    setData(initialData);
  }, [fields]);

  /**
   * Validation
   */
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

  /**
   * Common input change handler
   */
  const handleChange = (e: any) => {
    const { name, value } = e.target;

    setData((prev) => ({ ...prev, [name]: value }));

    if (errors[name] && value.trim() !== "") {
      setErrors((prev) => {
        const updated = { ...prev };
        delete updated[name];
        return updated;
      });
    }
  };

  /**
   * Submit
   */
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateForm(data)) return;
    await onSubmit?.(data);
  };

  /**
   * File preview setter
   */
  const setPreview = useCallback((fieldName: string, url: string) => {
    setFilePreviews((prev) => {
      if (prev[fieldName] === url) return prev;
      return { ...prev, [fieldName]: url || "" };
    });
  }, []);

  /**
   * Reset Form
   */
  const handleCancel = () => {
    const resetData: Record<string, any> = {};
    fields.forEach((field) => {
      resetData[field.name] = field.value ?? "";
    });
    setData(resetData);
    setErrors({});
    setFilePreviews({});
  };

  return (
    <ShowcaseSection
      title={title}
      className="p-6.5 bg-[#222327] text-[#F0F0F0] shadow-lg"
    >
      <form onSubmit={handleSubmit} noValidate>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {fields.map((field) => {
            const error = errors[field.name];

            /**
             * Remove key from spread props → fix React warning
             */
            const commonProps = {
              label: field.label,
              placeholder: field.placeholder ?? "",
              className: `text-white ${field.className ?? ""}`,
              name: field.name,
              required: field.required,
              error,
            };

            /**
             * SELECT FIELD
             */
            if (field.type === "select") {
              const items =
                (field.options ?? []).map((opt) => ({
                  label: opt.label,
                  value: opt.value || "invalid_value", // prevent empty string error
                })) || [];

              return (
                <Select
                  key={field.name}
                  {...commonProps}
                  items={items}
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

            /**
             * FILE UPLOAD
             */
            if (field.type === "file") {
              return (
                <FileUploadField
                  key={field.name}
                  field={field}
                  value={data[field.name]}
                  isContain={field.isContain || false}
                  setData={(name, value) =>
                    setData((prev) => ({ ...prev, [name]: value }))
                  }
                  preview={filePreviews[field.name]}
                  setPreview={(url) => setPreview(field.name, url ?? "")}
                />
              );
            }

            /**
             * TEXTAREA FIELD
             */
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

            /**
             * DEFAULT INPUT FIELD
             */
            return (
              <InputGroup
                key={field.name}
                type={field.type}
                {...commonProps}
                value={data[field.name] ?? ""}
                handleChange={handleChange}
              />
            );
          })}
        </div>

        {/* Submit + Cancel */}
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
