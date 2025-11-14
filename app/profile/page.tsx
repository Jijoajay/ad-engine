"use client";

import React, { useEffect, useState } from "react";
import MainLayout from "@/layout/MainLayout";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { ButtonColorful } from "@/components/ui/button-colorful";
import { useUserProfileStore } from "@/store/use-profile-store";
import { UserProfileSkeleton } from "@/components/skeleton/user-profie-skeleton";
import { useAuthStore } from "@/lib/auth-store";

const Page = () => {
  const {
    profile,
    loading,
    saving,
    fetchUserProfile,
    setProfileData,
    updateUserProfile,
  } = useUserProfileStore();

  const { user } = useAuthStore();

  const [errors, setErrors] = useState<{
    firstname?: string;
    lastname?: string;
    mobile_no?: string;
    email?: string;
  }>({});

  useEffect(() => {
    fetchUserProfile();
  }, [fetchUserProfile]);

  if (loading || !profile) {
    return (
      <MainLayout>
        <div className="min-h-screen bg-[#0f0c18] text-white px-8 py-10 pt-[100px] flex items-center justify-center">
          <UserProfileSkeleton />
        </div>
      </MainLayout>
    );
  }

  const validate = () => {
    const newErrors: typeof errors = {};

    // ✅ Required fields
    if (!profile.firstname.trim()) newErrors.firstname = "First name is required";
    if (!profile.lastname.trim()) newErrors.lastname = "Last name is required";
    if (!profile.email.trim()) newErrors.email = "Email is required";
    if (!profile.mobile_no.trim()) newErrors.mobile_no = "Mobile number is required";

    // ✅ Email validation
    if (profile.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profile.email)) {
      newErrors.email = "Enter a valid email address";
    }

    // ✅ Mobile validation (Indian or US)
    if (
      profile.mobile_no &&
      !/^(\+91\d{10}|91\d{10}|\+1\d{10}|\d{10})$/.test(profile.mobile_no)
    ) {
      newErrors.mobile_no = "Enter a valid Indian or US mobile number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // no errors → valid
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfileData({ [e.target.id]: e.target.value });
    setErrors((prev) => ({ ...prev, [e.target.id]: undefined })); // clear specific field error
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const isValid = validate();
    if (!isValid) return;

    await updateUserProfile(profile);
  };

  return (
    <MainLayout>
      <div className="min-h-screen bg-[#0f0c18] text-white px-8 py-10 pt-[100px] flex items-center justify-center">
        <div className="container flex items-center justify-center bg-[#231F29] border border-[#4C4C4C] rounded-xl w-full max-w-7xl min-h-[700px]">
          <div>
            {/* Header Section */}
            <div>
              <h1 className="text-2xl font-semibold">Super Admin</h1>
              <div className="inline-block px-2 py-0.5 text-xs bg-white/10 rounded-md mt-3 bg-gradient-to-r from-purple-600 to-blue-600">
                {user?.user_type === 1 ? "User" : "Admin"}
              </div>
              <p className="text-sm text-gray-400 mt-2">
                Manage your personal information and profile settings
              </p>
            </div>

            {/* Profile Section */}
            <div className="mt-10">
              <h2 className="text-xl font-semibold mb-6">
                Profile Information
              </h2>

              <form
                className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl"
                onSubmit={handleSubmit}
              >
                {/* First Name */}
                <LabelInputContainer>
                  <Label htmlFor="firstname">First Name</Label>
                  <Input
                    id="firstname"
                    type="text"
                    value={profile.firstname}
                    onChange={handleChange}
                    placeholder="Super Admin"
                    className="bg-[#1b1625] border-none focus:ring-purple-500"
                  />
                  {errors.firstname && <ErrorText text={errors.firstname} />}
                </LabelInputContainer>

                {/* Last Name */}
                <LabelInputContainer>
                  <Label htmlFor="lastname">Last Name</Label>
                  <Input
                    id="lastname"
                    type="text"
                    value={profile.lastname}
                    onChange={handleChange}
                    placeholder="Admin"
                    className="bg-[#1b1625] border-none focus:ring-purple-500"
                  />
                  {errors.lastname && <ErrorText text={errors.lastname} />}
                </LabelInputContainer>

                {/* Mobile Number */}
                <LabelInputContainer>
                  <Label htmlFor="mobile_no">Mobile Number</Label>
                  <Input
                    id="mobile_no"
                    type="tel"
                    value={profile.mobile_no}
                    onChange={handleChange}
                    placeholder="9876543219"
                    className="bg-[#1b1625] border-none focus:ring-purple-500"
                  />
                  {errors.mobile_no && <ErrorText text={errors.mobile_no} />}
                </LabelInputContainer>

                {/* Email ID */}
                <LabelInputContainer>
                  <Label htmlFor="email">Email ID</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profile.email}
                    onChange={handleChange}
                    placeholder="adengine@gmail.com"
                    className="bg-[#1b1625] border-none focus:ring-purple-500"
                  />
                  {errors.email && <ErrorText text={errors.email} />}
                </LabelInputContainer>
              </form>

              {/* Edit Button */}
              <div className="mt-10 w-full flex justify-end">
                <button
                  type="submit"
                  disabled={saving}
                  onClick={handleSubmit}
                  className="w-28 cursor-pointer"
                >
                  <ButtonColorful
                    label={saving ? "Saving..." : "Edit Profile"}
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

export default Page;

/* ✅ Subcomponents */
const Label = ({
  htmlFor,
  children,
}: {
  htmlFor: string;
  children: React.ReactNode;
}) => (
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
