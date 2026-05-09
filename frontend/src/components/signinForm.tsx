import { useState, type ChangeEvent, type FormEvent } from "react";
import { AxiosError } from "axios";
import API from "../services/api";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import type { SigninData } from "../types/user";
import { useNavigate } from "react-router-dom";

type BackendSigninResponse = {
  token?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  message?: string;
};

const SigninForm = () => {
  const [formData, setFormData] = useState<SigninData>({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverMessage, setServerMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setServerMessage("");
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setServerMessage("");

    try {
      const res = await API.post<BackendSigninResponse>("/user/signin", formData);

      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
      }
      localStorage.setItem(
        "user",
        JSON.stringify({
          firstName: res.data.firstName || "",
          lastName: res.data.lastName || "",
          email: res.data.email || formData.email,
        })
      );
      window.dispatchEvent(new Event("authChange"));
      navigate("/dashboard");
    } catch (err) {
      const axiosError = err as AxiosError<{ message?: string }>;
      setServerMessage(axiosError.response?.data?.message || "Invalid credentials");
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
        <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          Welcome Back
        </h2>
        <p className="text-sm text-slate-600">Sign in to continue writing and reading.</p>
      </div>

      <Input
        name="email"
        type="email"
        placeholder="Email"
        value={formData.email}
        onChange={handleChange}
        className="h-11"
        required
      />

      <div className="relative">
        <Input
          name="password"
          type={showPassword ? "text" : "password"}
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          className="h-11 pr-12"
          required
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

      {serverMessage && <p className="rounded-md bg-red-100 p-2 text-sm text-red-700">{serverMessage}</p>}

      <Button
        type="submit"
        className="h-11 w-full transition-transform duration-200 hover:scale-[1.01]"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Signing in..." : "Sign In"}
      </Button>
      <p className="text-center text-sm text-slate-600">
        New here?{" "}
        <button
          type="button"
          className="font-medium text-blue-600 transition-colors hover:text-blue-700 hover:underline"
          onClick={() => navigate("/signup")}
        >
          Create an account
        </button>
      </p>
    </form>
  );
};

export default SigninForm;