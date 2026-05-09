import { useState, type ChangeEvent, type FormEvent } from "react";
import { AxiosError } from "axios";
import API from "../services/api";
import type { SignupData } from "../types/user";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";

type FormErrors = Partial<Record<keyof SignupData | "confirmPassword", string>>;
type BackendErrorResponse = {
  message?: string;
  error?: { msg?: string; message?: string };
  errors?: Array<{ msg?: string }>;
};

const SignupForm = () => {
  const [formData, setFormData] = useState<SignupData>({
    firstName: "",
    lastName: "",
    email: "",
    mobile: "",
    password: "",
  });
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverMessage, setServerMessage] = useState("");
  const navigate = useNavigate();

  const validateForm = (): FormErrors => {
    const nextErrors: FormErrors = {};

    if (!formData.firstName.trim()) nextErrors.firstName = "First name is required.";
    if (!formData.lastName.trim()) nextErrors.lastName = "Last name is required.";
    if (!formData.email.trim()) {
      nextErrors.email = "Email is required.";
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      nextErrors.email = "Enter a valid email address.";
    }

    if (!formData.mobile.trim()) {
      nextErrors.mobile = "Mobile number is required.";
    } else if (!/^\d{10,15}$/.test(formData.mobile)) {
      nextErrors.mobile = "Mobile number must be 10 to 15 digits.";
    }

    if (!formData.password) {
      nextErrors.password = "Password is required.";
    } else if (formData.password.length < 6) {
      nextErrors.password = "Password must be at least 6 characters.";
    }

    if (!confirmPassword) {
      nextErrors.confirmPassword = "Please confirm your password.";
    } else if (confirmPassword !== formData.password) {
      nextErrors.confirmPassword = "Passwords do not match.";
    }

    return nextErrors;
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
    setServerMessage("");
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const validationErrors = validateForm();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);
    setServerMessage("");

    try {
      await API.post("/user/signup", formData);
      setServerMessage("Account created successfully. Redirecting to sign in...");
      setTimeout(() => navigate("/signIn"), 1200);
    } catch (err) {
      const axiosError = err as AxiosError<BackendErrorResponse>;

      if (!axiosError.response) {
        setServerMessage(
          "Cannot reach server. Please check backend is running and CORS is enabled."
        );
        return;
      }

      const data = axiosError.response.data;
      const backendMessage =
        data?.message || data?.error?.msg || data?.error?.message || data?.errors?.[0]?.msg;

      setServerMessage(backendMessage || "Signup failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-md space-y-4 rounded-2xl border border-white/20 bg-white/90 p-6 shadow-xl backdrop-blur-sm transition-all duration-300 sm:p-8"
    >
      <div className="space-y-1 text-center">
        <h2 className="text-3xl font-bold tracking-tight text-slate-900">Create Account</h2>
        <p className="text-sm text-slate-600">Join and start sharing your stories.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-1">
          <Input
            name="firstName"
            placeholder="First Name"
            value={formData.firstName}
            onChange={handleChange}
            className="h-11"
          />
          {errors.firstName && <p className="text-xs text-red-500">{errors.firstName}</p>}
        </div>
        <div className="space-y-1">
          <Input
            name="lastName"
            placeholder="Last Name"
            value={formData.lastName}
            onChange={handleChange}
            className="h-11"
          />
          {errors.lastName && <p className="text-xs text-red-500">{errors.lastName}</p>}
        </div>
      </div>

      <div className="space-y-1">
        <Input
          name="email"
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          className="h-11"
        />
        {errors.email && <p className="text-xs text-red-500">{errors.email}</p>}
      </div>

      <div className="space-y-1">
        <Input
          name="mobile"
          type="text"
          placeholder="Mobile Number"
          value={formData.mobile}
          onChange={handleChange}
          className="h-11"
        />
        {errors.mobile && <p className="text-xs text-red-500">{errors.mobile}</p>}
      </div>

      <div className="space-y-1">
        <div className="relative">
          <Input
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="h-11 pr-12"
          />
          <button
            type="button"
            aria-label={showPassword ? "Hide password" : "Show password"}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 transition-colors hover:text-slate-700"
            onClick={() => setShowPassword((prev) => !prev)}
          >
            {showPassword ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="h-5 w-5"
              >
                <path d="M3 3l18 18" />
                <path d="M10.58 10.58a2 2 0 0 0 2.83 2.83" />
                <path d="M9.36 5.37A9.9 9.9 0 0 1 12 5c5.5 0 9.5 5 9.5 7s-1.2 3.33-3.09 4.68" />
                <path d="M6.61 6.61C4.39 8.12 2.5 10.4 2.5 12c0 2 4 7 9.5 7a9.9 9.9 0 0 0 4.39-1.02" />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="h-5 w-5"
              >
                <path d="M2.5 12s4-7 9.5-7 9.5 7 9.5 7-4 7-9.5 7-9.5-7-9.5-7z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            )}
          </button>
        </div>
        {errors.password && <p className="text-xs text-red-500">{errors.password}</p>}
      </div>

      <div className="space-y-1">
        <div className="relative">
          <Input
            name="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
              setErrors((prev) => ({ ...prev, confirmPassword: "" }));
            }}
            className="h-11 pr-12"
          />
          <button
            type="button"
            aria-label={showConfirmPassword ? "Hide password" : "Show password"}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 transition-colors hover:text-slate-700"
            onClick={() => setShowConfirmPassword((prev) => !prev)}
          >
            {showConfirmPassword ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="h-5 w-5"
              >
                <path d="M3 3l18 18" />
                <path d="M10.58 10.58a2 2 0 0 0 2.83 2.83" />
                <path d="M9.36 5.37A9.9 9.9 0 0 1 12 5c5.5 0 9.5 5 9.5 7s-1.2 3.33-3.09 4.68" />
                <path d="M6.61 6.61C4.39 8.12 2.5 10.4 2.5 12c0 2 4 7 9.5 7a9.9 9.9 0 0 0 4.39-1.02" />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="h-5 w-5"
              >
                <path d="M2.5 12s4-7 9.5-7 9.5 7 9.5 7-4 7-9.5 7-9.5-7-9.5-7z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            )}
          </button>
        </div>
        {errors.confirmPassword && (
          <p className="text-xs text-red-500">{errors.confirmPassword}</p>
        )}
      </div>

      {serverMessage && (
        <p
          className={`rounded-md p-2 text-sm ${
            serverMessage.includes("success")
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {serverMessage}
        </p>
      )}

      <Button
        type="submit"
        className="h-11 w-full transition-transform duration-200 hover:scale-[1.01]"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Creating account..." : "Sign Up"}
      </Button>

      <p className="text-center text-sm text-slate-600">
        Already have an account?{" "}
        <button
          type="button"
          className="font-medium text-blue-600 transition-colors hover:text-blue-700 hover:underline"
          onClick={() => navigate("/signIn")}
        >
          Sign In
        </button>
      </p>
    </form>
  );
};

export default SignupForm;