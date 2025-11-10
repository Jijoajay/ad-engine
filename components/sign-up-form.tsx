"use client"

import React, { useEffect } from "react"
import { cn } from "@/lib/utils"
import { ChevronLeft, Mail } from "lucide-react"
import Link from "next/link"
import { Input } from "./ui/input"
import { ButtonColorful } from "./ui/button-colorful"
import { useSignupStore } from "@/store/use-sign-up-store"
import { useAuthStore } from "@/lib/auth-store"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { useProjectStore } from "@/store/use-project-store"

export function SignupForm() {
  const router = useRouter();
  const { register, registerError, loading } = useAuthStore();
  const { formData, errors, setField, validate, reset } = useSignupStore();
  const { projectList, fetchProjectList } = useProjectStore();

  useEffect(() => {
    fetchProjectList();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const isValid = validate();
    if (!isValid) return;

    const success = await register(formData);
    if (success) {
      console.log("Registration successful!");
      reset();
      router.push("/login");
    } else {
      console.error("Registration failed");
    }
  };

  return (
    <div className="max-w-md w-full mx-auto rounded-none md:rounded-2xl p-4 md:p-8 shadow-input bg-black">
      <BackButton />
      <div className="flex gap-1">
        <h2 className="font-bold text-xl text-neutral-200">Welcome to </h2>
        <Link href="/" className="flex items-center">
          <span className="font-bold text-xl text-neutral-200">
            Ad
            <span className="bg-clip-text text-transparent bg-[linear-gradient(to_right,#9333ea_70%,#2563eb_100%)]">
              Engine
            </span>
          </span>
        </Link>
      </div>

      <p className="text-sm max-w-sm mt-2 text-neutral-300">
        Create your account to access exclusive features and stay updated with our latest events
      </p>

      <form className="my-8" onSubmit={handleSubmit}>
        {/* Name */}
        <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 mb-4">
          <LabelInputContainer>
            <Label htmlFor="firstname">First name</Label>
            <Input
              id="firstname"
              value={formData.firstname}
              placeholder="Super"
              onChange={(e) => setField("firstname", e.target.value)}
            />
            {errors.firstname && <ErrorText text={errors.firstname} />}
          </LabelInputContainer>

          <LabelInputContainer>
            <Label htmlFor="lastname">Last name</Label>
            <Input
              id="lastname"
              value={formData.lastname}
              placeholder="Admin"
              onChange={(e) => setField("lastname", e.target.value)}
            />
            {errors.lastname && <ErrorText text={errors.lastname} />}
          </LabelInputContainer>
        </div>

        {/* Mobile */}
        <LabelInputContainer className="mb-4">
          <Label htmlFor="mobile_no">Mobile Number</Label>
          <Input
            id="mobile_no"
            type="tel"
            placeholder="e.g. 9876543210 or +11234567890"
            value={formData.mobile_no}
            onChange={(e) => setField("mobile_no", e.target.value)}
          />
          {errors.mobile_no && <ErrorText text={errors.mobile_no} />}
        </LabelInputContainer>

        {/* Email */}
        <LabelInputContainer className="mb-4">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="admin@gmail.com"
            value={formData.email}
            onChange={(e) => setField("email", e.target.value)}
          />
          {errors.email && <ErrorText text={errors.email} />}
        </LabelInputContainer>

        {/* Password */}
        <LabelInputContainer className="mb-4">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            value={formData.password}
            onChange={(e) => setField("password", e.target.value)}
          />
          {errors.password && <ErrorText text={errors.password} />}
        </LabelInputContainer>

        {/* Confirm Password */}
        <LabelInputContainer className="mb-8">
          <Label htmlFor="c_password">Confirm Password</Label>
          <Input
            id="c_password"
            type="password"
            placeholder="••••••••"
            value={formData.c_password}
            onChange={(e) => setField("c_password", e.target.value)}
          />
          {errors.c_password && <ErrorText text={errors.c_password} />}
        </LabelInputContainer>

        {/* ✅ Project Selection Dropdown */}
        <LabelInputContainer className="mb-8">
          <Label htmlFor="user_proj_id">Select Project</Label>
          <div className="relative">
            <select
              id="user_proj_id"
              className={cn(
                "w-full appearance-none bg-zinc-900 text-neutral-200 border border-neutral-800 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              )}
              value={formData.user_proj_id || ""}
              onChange={(e) => setField("user_proj_id", e.target.value)}
            >
              <option value="">Select a project</option>
              {projectList.map((proj: any) => (
                <option key={proj.proj_id} value={proj.proj_id}>
                  {proj.proj_name}
                </option>
              ))}
            </select>

            {/* Custom dropdown arrow */}
            <svg
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-400 pointer-events-none"
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
          {errors.user_proj_id && <ErrorText text={errors.user_proj_id} />}
        </LabelInputContainer>

        {/* Sign Up Button */}
        {registerError && <p className="text-center mb-3 text-sm text-red-500">{registerError}</p>}

        <div className="flex items-center justify-center">
          <ButtonColorful isIcon={false} label="Sign Up" className="w-full" loading={loading} />
        </div>

        <div className="bg-linear-to-r from-transparent via-neutral-700 to-transparent my-8 h-px w-full" />

        {/* Google Signup */}
        <div className="flex flex-col space-y-4">
          <button
            type="button"
            className="relative group/btn flex space-x-2 items-center justify-center px-4 w-full text-black rounded-md h-10 font-medium shadow-input bg-zinc-900 shadow-[0px_0px_1px_1px_var(--neutral-800)]"
          >
            <Mail className="h-4 w-4 text-neutral-300 mr-2" />
            <span className="text-neutral-300 text-sm">Sign up with Google</span>
            <BottomGradient />
          </button>
        </div>

        <div className="text-center mt-6">
          <p className="text-sm text-neutral-300">
            Already have an account?{" "}
            <Link href="/login" className="text-blue-400 hover:underline">
              Log in
            </Link>
          </p>
        </div>
      </form>
    </div>
  )
}

// 🔹 Subcomponents
const ErrorText = ({ text }: { text: string }) => (
  <p className="text-red-400 text-xs mt-1">{text}</p>
);

const BottomGradient = () => (
  <>
    <span className="group-hover/btn:opacity-100 block transition duration-500 opacity-0 absolute h-px w-full -bottom-px inset-x-0 bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
    <span className="group-hover/btn:opacity-100 blur-sm block transition duration-500 opacity-0 absolute h-px w-1/2 mx-auto -bottom-px inset-x-10 bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />
  </>
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
  <Link href="/login" className="inline-block mb-6">
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="flex items-center text-sm font-medium text-zinc-400 hover:text-blue-400 transition-colors"
    >
      <ChevronLeft size={16} className="mr-1" />
      Back to login
    </motion.div>
  </Link>
);
