"use client";

import { useState } from "react";

export interface FilterOption {
    label: string;
    value: string;
}

export interface FilterConfig {
    name: string;
    type: "select" | "text";
    placeholder?: string;
    options?: FilterOption[];
}

interface DynamicFilterProps {
    config: FilterConfig[];
    onChange?: (filters: Record<string, any>) => void;
}

export default function DynamicFilter({ config, onChange }: DynamicFilterProps) {
    const [values, setValues] = useState<Record<string, any>>({});

    const update = (name: string, value: any) => {
        const updated = { ...values, [name]: value };
        setValues(updated);

        onChange?.(updated); 
    };

    return (
        <div className="flex gap-4 items-center">
            {config.map((item) => {
                if (item.type === "select") {
                    return (
                        <select
                            key={item.name}
                            value={values[item.name] ?? ""}
                            onChange={(e) => update(item.name, e.target.value)}
                            className="border px-3 py-2 rounded-lg text-[#A0A0A0]"
                        >
                            <option value="">{item.placeholder}</option>
                            {item.options?.map((opt) => (
                                <option key={opt.value} value={opt.value}>
                                    {opt.label}
                                </option>
                            ))}
                        </select>
                    );
                }

                if (item.type === "text") {
                    return (
                        <input
                            key={item.name}
                            type="text"
                            placeholder={item.placeholder}
                            onChange={(e) => update(item.name, e.target.value)}
                            className="border px-3 py-2 rounded-lg text-foreground"
                        />
                    );
                }

                return null;
            })}
        </div>
    );
}
