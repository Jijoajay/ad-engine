"use client";

import React, { useState } from "react";
import MainLayout from "@/layout/MainLayout";
import { Input } from "@/components/ui/input";
import { ButtonColorful } from "@/components/ui/button-colorful";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/lib/auth-store";
import BackButton from "@/components/ui/back-button";

const ChangePasswordPage = () => {
  const { changePassword, loadingChangePass, error } = useAuthStore();

  const [form, setForm] = useState({
    current_password: "",
    new_password: "",
    confirm_password: "",
  });

  const [errors, setErrors] = useState<{
    current_password?: string;
    new_password?: string;
    confirm_password?: string;
  }>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.id]: e.target.value }));
    setErrors((prev) => ({ ...prev, [e.target.id]: undefined }));
  };

  // Validation
  const validate = () => {
    const newErrors: typeof errors = {};

    if (!form.current_password.trim())
      newErrors.current_password = "Current password is required";

    if (!form.new_password.trim())
      newErrors.new_password = "New password is required";

    if (form.new_password && form.new_password.length < 6)
      newErrors.new_password = "Password must be at least 6 characters";

    if (form.new_password !== form.confirm_password)
      newErrors.confirm_password = "Passwords do not match";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    await changePassword(form);
  };

  return (
    <MainLayout>
      <div className="min-h-screen bg-[#0f0c18] text-white px-8 py-10 pt-[100px] flex flex-col items-center justify-center">
        <div className="w-full max-w-7xl">
          <div className="text-white w-full item-start mb-5">
            <h1 className="text-2xl font-semibold">Change Password</h1>
            <p className="text-sm text-gray-400 mt-2">
              Update your password to keep your account secure
            </p>
          </div>
        </div>
        <div className="container flex items-center justify-center bg-[#231F29] border border-[#4C4C4C] rounded-xl w-full max-w-7xl min-h-[700px]">
          <div>
            {/* Form Section */}
            <div className="mt-10">
              <BackButton />
              <form
                className="grid grid-cols-1 gap-6 max-w-4xl"
                onSubmit={handleSubmit}
              >
                {/* Current Password */}
                <LabelInputContainer>
                  <Label htmlFor="current_password">Current Password</Label>
                  <Input
                    id="current_password"
                    type="password"
                    value={form.current_password}
                    onChange={handleChange}
                    placeholder="********"
                    className="bg-[#1b1625] border-none focus:ring-purple-500"
                  />
                  {errors.current_password && (
                    <ErrorText text={errors.current_password} />
                  )}
                </LabelInputContainer>

                {/* New Password */}
                <LabelInputContainer>
                  <Label htmlFor="new_password">New Password</Label>
                  <Input
                    id="new_password"
                    type="password"
                    value={form.new_password}
                    onChange={handleChange}
                    placeholder="********"
                    className="bg-[#1b1625] border-none focus:ring-purple-500"
                  />
                  {errors.new_password && (
                    <ErrorText text={errors.new_password} />
                  )}
                </LabelInputContainer>

                {/* Confirm Password */}
                <LabelInputContainer>
                  <Label htmlFor="confirm_password">Confirm Password</Label>
                  <Input
                    id="confirm_password"
                    type="password"
                    value={form.confirm_password}
                    onChange={handleChange}
                    placeholder="********"
                    className="bg-[#1b1625] border-none focus:ring-purple-500"
                  />
                  {errors.confirm_password && (
                    <ErrorText text={errors.confirm_password} />
                  )}
                </LabelInputContainer>
              </form>

              {/* Save Button */}
              <div className="mt-10 w-full flex justify-end">
                <button type="submit" disabled={loadingChangePass} onClick={handleSubmit} className="w-32 cursor-pointer">
                  <ButtonColorful
                    label={loadingChangePass ? "Saving..." : "Update"}
                    isIcon={false}
                  />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default ChangePasswordPage;

/* Reusable Components */
const Label = ({ htmlFor, children }: { htmlFor: string; children: React.ReactNode }) => (
  <label
    htmlFor={htmlFor}
    className="text-sm font-medium leading-none text-gray-300 w-[350px]"
  >
    {children}
  </label>
);

const LabelInputContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div className={cn("flex flex-col space-y-2 w-full", className)}>
    {children}
  </div>
);

const ErrorText = ({ text }: { text: string }) => (
  <p className="text-red-400 text-xs mt-1">{text}</p>
);
