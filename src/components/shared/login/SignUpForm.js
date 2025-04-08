"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import meridianBackground from "@/assets/images/about/meridian-background.png";
import meridianLogo from "@/assets/images/logo/favicon.png";

const SignUpForm = ({ switchToLogin }) => {
  const [formState, setFormState] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    error: "",
    success: "",
    isLoading: false,
    acceptedTerms: false,
    showResend: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormState({ ...formState, isLoading: true, error: "", success: "" });

    if (formState.password !== formState.confirmPassword) {
      setFormState({
        ...formState,
        error: "Passwords do not match.",
        isLoading: false,
      });
      return;
    }

    if (!formState.acceptedTerms) {
      setFormState({
        ...formState,
        error: "You must accept the Terms and Privacy Policy.",
        isLoading: false,
      });
      return;
    }

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: formState.username,
          email: formState.email,
          password: formState.password,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setFormState({
          ...formState,
          success:
            "Registration successful! Please check your email to activate your account.",
          isLoading: false,
        });
        setTimeout(() => {
          router.push("/login");
        }, 5000);
      } else {
        if (
          data.message ===
          "Email already registered. Please login or verify your email."
        ) {
          setFormState({
            ...formState,
            error: data.message,
            showResend: true,
            isLoading: false,
          });
        } else {
          setFormState({
            ...formState,
            error: data.message || "An error occurred during registration.",
            isLoading: false,
          });
        }
      }
    } catch (error) {
      setFormState({
        ...formState,
        error: "An error occurred. Please try again later.",
        isLoading: false,
      });
    }
  };

  const handleResendEmail = async () => {
    setFormState({ ...formState, isLoading: true, error: "", success: "" });

    try {
      const res = await fetch("/api/auth/resend-activation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formState.email }),
      });

      const data = await res.json();
      if (res.ok) {
        setFormState({
          ...formState,
          success: "A new activation link has been sent to your email!",
          showResend: false,
          isLoading: false,
        });
      } else {
        setFormState({
          ...formState,
          error: data.message || "Failed to resend activation email.",
          isLoading: false,
        });
      }
    } catch (error) {
      setFormState({
        ...formState,
        error: "An error occurred. Please try again.",
        isLoading: false,
      });
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Left Section - Background Image with Overlay Content */}
      <div className="hidden md:flex relative w-[750px] h-[700px] rounded-[20px] overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image
            src={meridianBackground}
            alt="Meridian Background"
            layout="fill"
            objectFit="cover"
            objectPosition="center"
            quality={100}
            priority
          />
          <div className="absolute inset-0 bg-black bg-opacity-30"></div>
        </div>

        {/* Logo Container - Positioned in middle left with centered logo */}
        <div className="absolute left-0 top-1/2 transform -translate-y-1/2 z-20">
        <div className="bg-white h-[160px] w-[600px] flex items-center justify-center rounded-r-[100px]">
            <Image
              src={meridianLogo}
              alt="Meridian Logo"
              width={300}
              height={80}
              className="object-contain"
              priority
            />
          </div>
        </div>

        {/* Content Overlay - Centered below logo */}
        <div className="absolute left-0 top-[65%] z-10 w-full">
          <div className="max-w-md mx-auto text-center px-8">
            <h2 className="text-4xl font-bold text-white mb-4">
              Welcome to Meridian
            </h2>
            <p className="text-lg text-white">
              Access your courses, collaborate with peers, and track your
              progress—all in one place.
            </p>
          </div>
        </div>
      </div>

      {/* Right Section - Sign Up Form */}
      <div className="w-[900px] h-[700px] md:w-auto bg-white flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Mobile header (hidden on desktop) */}
          <div className="md:hidden text-center mb-8">
            <div className="mb-4">
              <Image
                src={meridianLogo}
                alt="Meridian Logo"
                width={80}
                height={80}
                className="mx-auto"
                priority
              />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              MERIDIAN LMS
            </h1>
            <h2 className="text-xl text-gray-700 mb-4">Create Your Account</h2>
          </div>

          <div className="mb-6">
            <h3 className="text-2xl font-semibold text-gray-800 mb-2 ml-40">
              SIGN UP
            </h3>
            <p className="text-gray-600">
              Already have an account?{" "}
              <button
                onClick={switchToLogin}
                className="text-yellow hover:underline font-medium"
              >
                Log In
              </button>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {formState.error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                {formState.error}
              </div>
            )}

            {formState.success && (
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
                {formState.success}
              </div>
            )}

            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Full Name
              </label>
              <input
                id="username"
                type="text"
                placeholder="Enter your full name"
                value={formState.username}
                onChange={(e) =>
                  setFormState({
                    ...formState,
                    username: e.target.value,
                  })
                }
                className="w-[400px] px-6 py-4 text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow placeholder-gray-400"
                required
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={formState.email}
                onChange={(e) =>
                  setFormState({
                    ...formState,
                    email: e.target.value,
                  })
                }
                className="w-[400px] px-6 py-4 text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow placeholder-gray-400"
                required
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Password
              </label>
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Create a password"
                value={formState.password}
                onChange={(e) =>
                  setFormState({
                    ...formState,
                    password: e.target.value,
                  })
                }
                className="w-[400px] px-6 py-4 text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow placeholder-gray-400"
                required
              />
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                type={showPassword ? "text" : "password"}
                placeholder="Confirm your password"
                value={formState.confirmPassword}
                onChange={(e) =>
                  setFormState({
                    ...formState,
                    confirmPassword: e.target.value,
                  })
                }
                className="w-[400px] px-6 py-4 text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow placeholder-gray-400"
                required
              />
            </div>

            <div className="flex items-center justify-between space-x-4">
              <div className="flex items-center space-x-8">
                <div className="flex items-center">
                  <input
                    id="showPassword"
                    type="checkbox"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    checked={showPassword}
                    onChange={() => setShowPassword(!showPassword)}
                  />
                  <label
                    htmlFor="showPassword"
                    className="ml-2 block text-sm text-gray-700 whitespace-nowrap"
                  >
                    Show password
                  </label>
                </div>
              </div>
            </div>

            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="terms"
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  checked={formState.acceptedTerms}
                  onChange={(e) =>
                    setFormState({
                      ...formState,
                      acceptedTerms: e.target.checked,
                    })
                  }
                  required
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="terms" className="font-medium text-gray-700">
                  I agree to the{" "}
                  <Link href="/privacy-policy" className="text-yellow hover:underline">
                    Terms and Conditions
                  </Link>{" "}
                </label>
              </div>
            </div>

            {formState.showResend && (
              <div className="text-center">
                <button
                  onClick={handleResendEmail}
                  type="button"
                  className="text-yellow hover:underline font-medium"
                  disabled={formState.isLoading}
                >
                  Resend Verification Email
                </button>
              </div>
            )}

            <div>
              <button
                type="submit"
                className="w-full bg-yellow hover:bg-yellow-dark text-white font-medium py-3 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                disabled={formState.isLoading}
              >
                {formState.isLoading ? (
                  <span className="flex items-center justify-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Processing...
                  </span>
                ) : (
                  "Sign Up"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignUpForm;
