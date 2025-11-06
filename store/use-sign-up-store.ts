import { SignupStore } from "@/types/common"
import { create } from "zustand"

export const useSignupStore = create<SignupStore>((set, get) => ({
  formData: {
    firstname: "",
    lastname: "",
    mobile_no: "",
    email: "",
    password: "",
    c_password: "",
    user_proj_id: "",
    first_login: 2,
    user_type: 0,
  },
  errors: {},

  setField: (field, value) => {
    set((state) => ({
      formData: { ...state.formData, [field]: value },
      errors: { ...state.errors, [field]: "" },
    }))
  },

  validate: () => {
    const { formData } = get()
    const newErrors: Record<string, string> = {}

    const emailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/
    const indiaRegex = /^[6-9]\d{9}$/
    const usRegex = /^\+?1?\d{10}$/

    if (!formData.firstname.trim()) newErrors.firstname = "First name is required"
    if (!formData.lastname.trim()) newErrors.lastname = "Last name is required"

    if (!formData.mobile_no.trim()) {
      newErrors.mobile_no = "Mobile number is required"
    } else if (!indiaRegex.test(formData.mobile_no) && !usRegex.test(formData.mobile_no)) {
      newErrors.mobile_no = "Enter a valid Indian or US mobile number"
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Only valid Gmail addresses are allowed"
    }

    if (!formData.password.trim()) newErrors.password = "Password is required"
    if (formData.password.length < 6)
      newErrors.password = "Password must be at least 6 characters long"

    if (formData.c_password !== formData.password)
      newErrors.c_password = "Passwords do not match"

    set({ errors: newErrors })

    return Object.keys(newErrors).length === 0
  },

  reset: () =>
    set({
      formData: {
        firstname: "",
        lastname: "",
        mobile_no: "",
        email: "",
        password: "",
        c_password: "",
        user_proj_id: "",
        first_login: 2,
        user_type: 0,
      },
      errors: {},
    }),
}))
