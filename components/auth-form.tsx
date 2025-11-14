"use client"

import * as React from "react"
import { ChevronLeft, Mail, User, Eye, EyeOff } from "lucide-react"
import { motion } from "framer-motion"
import { useTheme } from "next-themes"
import Link from "next/link"
import { useAuthStore } from "@/lib/auth-store"
import { useRouter } from "next/navigation"
import { ButtonColorful } from "./ui/button-colorful"

const AuthForm: React.FC = () => {
  return (
    <div className="bg-black py-20 text-white selection:bg-zinc-300">
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.25, ease: "easeInOut" }}
        className="relative z-10 mx-auto w-full max-w-xl p-4"
      >
        <BackButton />
        <Logo />
        <Header />
        <SocialButtons />
        <Divider />
        <LoginForm />
        <TermsAndConditions />
      </motion.div>
      <BackgroundDecoration />
    </div>
  )
}

const BackButton: React.FC = () => (
  <Link href="/" className="inline-block mb-6">
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="flex items-center text-sm font-medium text-zinc-400 hover:text-blue-400 transition-colors"
    >
      <ChevronLeft size={16} className="mr-1" />
      Back to home
    </motion.div>
  </Link>
)

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string
}

const Button: React.FC<ButtonProps> = ({ children, className, ...props }) => (
  <button
    className={`rounded-md bg-gradient-to-br from-blue-400 to-blue-700 px-4 py-2 text-lg text-white 
    ring-2 ring-blue-500/50 ring-offset-2 ring-offset-black 
    transition-all hover:scale-[1.02] hover:ring-transparent active:scale-[0.98] active:ring-blue-500/70 ${className}`}
    {...props}
  >
    {children}
  </button>
)

const Logo: React.FC = () => (
  <div className="flex items-center justify-center mb-3">
    <span className="font-bold text-3xl text-white">
      Ad
      <span className="bg-clip-text text-transparent bg-[linear-gradient(to_right,#9333ea_70%,#2563eb_100%)]">
        Engine
      </span>
    </span>
  </div>
)

const Header: React.FC = () => (
  <div className="mb-6 text-center">
    <h1 className="text-2xl font-semibold text-white">Sign in to your account</h1>
    <p className="mt-2 text-zinc-400">
      Don't have an account?{" "}
      <Link href="/sign-up" className="text-blue-400 hover:underline">
        Create one.
      </Link>
    </p>
  </div>
)

const SocialButtons: React.FC = () => (
  <div className="mb-6 space-y-3">
    <div className="grid grid-cols-1 gap-3">
      {/* <SocialButton icon={<Mail size={20} className="text-white" />}>Sign in with Google</SocialButton> */}
      <Link href="/sign-up" className="w-full">
        <SocialButton icon={<User size={20} className="text-white" />}>Create Account</SocialButton>
      </Link>
    </div>
  </div>
)

const SocialButton: React.FC<{
  icon?: React.ReactNode
  fullWidth?: boolean
  children?: React.ReactNode
}> = ({ icon, fullWidth, children }) => (
  <button
    className={`relative z-0 flex items-center justify-center gap-2 overflow-hidden rounded-md 
    border border-zinc-700 bg-zinc-900 
    px-4 py-2 font-semibold text-white transition-all duration-500
    before:absolute before:inset-0 before:-z-10 before:translate-x-[150%] before:translate-y-[150%] before:scale-[2.5]
    before:rounded-[100%] before:bg-white before:transition-transform before:duration-1000 before:content-[""]
    hover:scale-105 hover:text-black hover:before:translate-x-[0%] hover:before:translate-y-[0%] active:scale-95
    ${fullWidth ? "col-span-2" : ""} w-full`}
  >
    {icon}
    <span>{children}</span>
  </button>
)

const Divider: React.FC = () => (
  <div className="my-6 flex items-center gap-3">
    <div className="h-px w-full bg-zinc-700" />
    <span className="text-zinc-400">OR</span>
    <div className="h-px w-full bg-zinc-700" />
  </div>
)

const LoginForm: React.FC = () => {
  const router = useRouter()
  const [formData, setFormData] = React.useState({ email: "", password: "" })
  const [errors, setErrors] = React.useState({ email: "", password: "" })
  const [showPassword, setShowPassword] = React.useState(false)
  const { login, loading, error, clearError } = useAuthStore()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    setFormData((prev) => ({ ...prev, [id]: value }))
    setErrors((prev) => ({ ...prev, [id]: "" }))
    if (error) clearError()
  }

  const validateForm = () => {
    let valid = true
    const newErrors = { email: "", password: "" }

    if (!formData.email) {
      newErrors.email = "Email is required"
      valid = false
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Enter a valid email"
      valid = false
    }

    if (!formData.password) {
      newErrors.password = "Password is required"
      valid = false
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters"
      valid = false
    }

    setErrors(newErrors)
    return valid
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    const success = await login(formData.email, formData.password);
    console.log("success", success);

    if (success) {
      const user = useAuthStore.getState().user; 

      if (user?.user_type === 0) {
        router.push("/dashboard");
      } else {
        router.push("/");
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Email */}
      <div className="mb-3">
        <label htmlFor="email" className="mb-1.5 block text-zinc-400">
          Email
        </label>
        <input
          id="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="your.email@provider.com"
          className="w-full rounded-md border border-zinc-700 
          bg-black px-3 py-2 text-white
          placeholder-zinc-500 ring-1 ring-transparent transition-shadow focus:outline-0 focus:ring-purple-500"
        />
        {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
      </div>

      {/* Password */}
      <div className="mb-6 relative">
        <div className="mb-1.5 flex items-end justify-between">
          <label htmlFor="password" className="block text-zinc-400">
            Password
          </label>
          <a href="#" className="text-sm text-purple-400">
            Forgot Password?
          </a>
        </div>
        <div className="relative">
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            value={formData.password}
            onChange={handleChange}
            placeholder="••••••••••••"
            className="w-full rounded-md border border-zinc-700 
            bg-black px-3 py-2 pr-10 text-white
            placeholder-zinc-500 ring-1 ring-transparent transition-shadow focus:outline-0 focus:ring-purple-500"
          />
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
        {errors.password && <p className="mt-1 text-sm text-red-500">{errors.password}</p>}
      </div>

      {error && <p className="text-center mb-3 text-sm text-red-500">{error}</p>}

      <ButtonColorful
        loading={loading}
        label={loading ? "Signing in..." : "Sign in"}
        isIcon={false}
        className="w-full"
      />
    </form>
  )
}

const TermsAndConditions: React.FC = () => (
  <p className="mt-9 text-xs text-zinc-400">
    By signing in, you agree to our{" "}
    <a href="#" className="text-blue-400">
      Terms & Conditions
    </a>{" "}
    and{" "}
    <a href="#" className="text-blue-400">
      Privacy Policy.
    </a>
  </p>
)

const BackgroundDecoration: React.FC = () => {
  const { theme } = useTheme()
  const isDarkTheme = theme === "light" || "dark"

  return (
    <div
      className="absolute right-0 top-0 z-0 size-[50vw]"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' width='32' height='32' fill='none' strokeWidth='2' stroke='rgb(30 58 138 / 0.5)'%3e%3cpath d='M0 .5H31.5V32'/%3e%3c/svg%3e")`,
      }}
    >
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(100% 100% at 100% 0%, rgba(0,0,0,0), rgba(0,0,0,1))",
        }}
      />
    </div>
  )
}

export default AuthForm
