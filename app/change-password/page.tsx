"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ButtonColorful } from "@/components/ui/button-colorful";
import { cn } from "@/lib/utils";
import MainLayout from "@/layout/MainLayout";
import { toast } from "sonner";
import { useAuthStore } from "@/lib/auth-store";
import { useRouter } from "next/navigation";

const ChangePasswordPage = () => {
    const router = useRouter();
  const { changePassword, loadingChangePass, error } = useAuthStore();

  const [formData, setFormData] = useState({
    current_password: "",
    new_password: "",
    confirm_password: "",
  });

  const [errors, setErrors] = useState({
    current_password: "",
    new_password: "",
    confirm_password: "",
  });

  const validate = () => {
    let newErrors = { current_password: "", new_password: "", confirm_password: "" };
    let valid = true;

    if (!formData.current_password) {
      newErrors.current_password = "Current password is required";
      valid = false;
    }
    if (!formData.new_password) {
      newErrors.new_password = "New password is required";
      valid = false;
    }
    if (formData.new_password && formData.new_password.length < 6) {
      newErrors.new_password = "Password must be at least 6 characters";
      valid = false;
    }
    if (formData.new_password !== formData.confirm_password) {
      newErrors.confirm_password = "Passwords do not match";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const success = await changePassword(formData);

    if (success) {
      toast.success("Password changed successfully!");
      router.push("/");
      setFormData({ current_password: "", new_password: "", confirm_password: "" });
    } else {
      toast.error(error || "Failed to change password.");
    }
  };

  const handleChange = (key: string, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <MainLayout>
      <div className="max-w-md w-full mx-auto rounded-none md:rounded-2xl p-4 md:p-8 md:pt-[100px] shadow-input bg-black min-h-screen">
        <BackButton />

        <div className="flex gap-1 items-center mb-3">
          <h2 className="font-bold text-xl text-neutral-200">Change</h2>
          <span className="font-bold text-xl text-neutral-200">
            <span className="bg-clip-text text-transparent bg-[linear-gradient(to_right,#9333ea_70%,#2563eb_100%)]">
              Password
            </span>
          </span>
        </div>

        <p className="text-sm max-w-sm mb-6 text-neutral-400">
          Update your account password securely below.
        </p>

        <form className="space-y-6" onSubmit={handleSubmit}>
          {/* Current Password */}
          <LabelInputContainer>
            <Label htmlFor="current_password">Current Password</Label>
            <Input
              id="current_password"
              type="password"
              placeholder="••••••••"
              value={formData.current_password}
              onChange={(e) => handleChange("current_password", e.target.value)}
            />
            {errors.current_password && <ErrorText text={errors.current_password} />}
          </LabelInputContainer>

          {/* New Password */}
          <LabelInputContainer>
            <Label htmlFor="new_password">New Password</Label>
            <Input
              id="new_password"
              type="password"
              placeholder="••••••••"
              value={formData.new_password}
              onChange={(e) => handleChange("new_password", e.target.value)}
            />
            {errors.new_password && <ErrorText text={errors.new_password} />}
          </LabelInputContainer>

          {/* Confirm Password */}
          <LabelInputContainer>
            <Label htmlFor="confirm_password">Confirm Password</Label>
            <Input
              id="confirm_password"
              type="password"
              placeholder="••••••••"
              value={formData.confirm_password}
              onChange={(e) => handleChange("confirm_password", e.target.value)}
            />
            {errors.confirm_password && <ErrorText text={errors.confirm_password} />}
          </LabelInputContainer>

          <div className="pt-4">
            <ButtonColorful
              isIcon={false}
              label="Change Password"
              className="w-full"
              loading={loadingChangePass}
            />
          </div>
        </form>
      </div>
    </MainLayout>
  );
};

// 🔹 Reusable Components
const ErrorText = ({ text }: { text: string }) => (
  <p className="text-red-400 text-xs mt-1">{text}</p>
);

const Label = ({ htmlFor, children }: { htmlFor: string; children: React.ReactNode }) => (
  <label htmlFor={htmlFor} className="text-sm font-medium leading-none text-neutral-200">
    {children}
  </label>
);

const LabelInputContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => <div className={cn("flex flex-col space-y-2 w-full", className)}>{children}</div>;

const BackButton: React.FC = () => (
  <Link href="/profile" className="inline-block mb-6">
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="flex items-center text-sm font-medium text-zinc-400 hover:text-blue-400 transition-colors"
    >
      <ChevronLeft size={16} className="mr-1" />
      Back to Profile
    </motion.div>
  </Link>
);

export default ChangePasswordPage;
