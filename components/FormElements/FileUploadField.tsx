"use client";

import { useDropzone } from "react-dropzone";
import {
  FaTrashAlt,
  FaFilePdf,
  FaFileWord,
  FaFileExcel,
  FaFileImage,
  FaFileAlt,
} from "react-icons/fa";
import { useCallback, useId } from "react";

interface FieldOption {
  label: string;
  value: string | number;
}

interface Field {
  name: string;
  label: string;
  type: string;
  placeholder?: string;
  options?: FieldOption[];
  required?: boolean;
  multiple?: boolean;
  accept?: string;
  className?: string;
}

interface FileUploadProps<T extends Record<string, unknown>> {
  field: Field;
  value: string | number | File | null | undefined;
  setData: (name: keyof T, value: T[keyof T]) => void;
  preview?: string;
  setPreview: (url: string | undefined) => void;
  error?: string;
}

export const FileUploadField = <T extends Record<string, unknown>>({
  field,
  value,
  setData,
  preview,
  setPreview,
  error,
}: FileUploadProps<T>) => {
  const id = useId();

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (file) {
        setData(field.name as keyof T, file as T[keyof T]);

        if (file.type.startsWith("image/")) {
          const reader = new FileReader();
          reader.onload = (e) => {
            setPreview(e.target?.result as string);
          };
          reader.readAsDataURL(file);
        } else {
          setPreview(undefined);
        }
      }
    },
    [field.name, setData, setPreview]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: field.multiple || false,
    accept: field.accept ? { [field.accept]: [] } : undefined,
  });

  const getFileIcon = (file: File) => {
    const name = file.name.toLowerCase();
    const type = file.type.toLowerCase();

    if (type.includes("pdf") || name.endsWith(".pdf"))
      return <FaFilePdf className="text-red-500 text-6xl" />;
    if (
      type.includes("word") ||
      name.endsWith(".doc") ||
      name.endsWith(".docx")
    )
      return <FaFileWord className="text-blue-500 text-6xl" />;
    if (
      type.includes("excel") ||
      name.endsWith(".xls") ||
      name.endsWith(".xlsx")
    )
      return <FaFileExcel className="text-green-500 text-6xl" />;
    if (type.startsWith("image/"))
      return <FaFileImage className="text-yellow-400 text-6xl" />;
    return <FaFileAlt className="text-gray-500 text-6xl" />;
  };

  return (
    <div className={`space-y-3 ${field.className || ""}`}>
      {/* Label */}
      <label
        htmlFor={id}
        className="block text-body-sm font-medium text-white"
      >
        {field.label}
        {field.required && (
          <span className="ml-1 select-none text-red-500">*</span>
        )}
      </label>

      {/* Upload Area */}
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-xl p-6 text-center transition-all duration-300 cursor-pointer
          ${
            isDragActive
              ? "border-blue-500 bg-blue-950/20"
              : error
              ? "border-red-500 bg-[#1A1A1A]"
              : "border-gray-700 bg-[#1A1A1A] hover:bg-[#242424]"
          }
        `}
      >
        <input {...getInputProps()} id={id} />

        {value ? (
          <div className="flex flex-col items-center justify-center gap-3">
            {typeof value !== "string" && (preview ? (
              <img
                src={preview}
                alt="preview"
                className="w-24 h-24 object-cover rounded-lg border border-gray-600"
              />
            ) : (
              getFileIcon(value as File)
            ))}

            <p className="mt-2 text-sm text-gray-300 truncate max-w-[180px]">
              {(value as File).name}
            </p>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setData(field.name as keyof T, null as T[keyof T]);
                setPreview(undefined);
              }}
              className="text-red-500 hover:text-red-700 text-sm flex items-center justify-center gap-2 mt-2 transition-colors"
            >
              <FaTrashAlt /> Remove
            </button>
          </div>
        ) : (
          <div className="text-gray-400">
            <p className="text-sm">
              {isDragActive
                ? "Drop the file here..."
                : `Drag & drop or click to upload ${field.label}`}
            </p>
          </div>
        )}
      </div>

      {/* Error message */}
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
};
