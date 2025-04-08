"use client";

import { getCsrfToken, signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import meridianBackground from "@/assets/images/about/meridian-background.png";
import meridianLogo from "@/assets/images/logo/favicon.png";

const LoginForm = ({ csrfToken, switchToSignUp }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState("Login Now");
  const [error, setError] = useState("");
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const signInOAuth = async (provider) => {
    try {
      setLoading("...");
      const res = await signIn(provider, { callbackUrl: "/" });
      if (!res?.error) {
        router.push("/");
      } else {
        setError(`Failed to login with ${provider}`);
      }
      setLoading("Login Now");
    } catch (err) {
      setLoading("Login Now");
      setError(err.message || "An unexpected error occurred");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading("...");
      const res = await signIn("credentials", {
        redirect: false,
        email,
        password,
        callbackUrl: "/",
      });

      setLoading("Login Now");

      if (res?.error) {
        if (res.error.includes("verify your email")) {
          setError("Please verify your email before logging in.");
        } else if (res.error.includes("No user found")) {
          setError("No user found with this email.");
        } else if (res.error.includes("Password does not match")) {
          setError("Invalid email or password.");
        } else {
          setError("An unexpected error occurred. Please try again.");
        }
      } else {
        router.push("/");
      }
    } catch (err) {
      setLoading("Login Now");
      setError(err.message || "An unexpected error occurred.");
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

      {/* Right Section - Login Form */}
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
            <h2 className="text-xl text-gray-700 mb-4">Welcome to Meridian</h2>
          </div>

          <div className="mb-6">
            <h3 className="text-2xl font-semibold text-gray-800 mb-2 ml-20">
              LOGIN
            </h3>
            <p className="text-gray-600">
              Don&apos;t have an account yet?{" "}
              <button
                onClick={switchToSignUp}
                className="text-yellow hover:underline font-medium"
              >
                Sign up for free
              </button>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input name="csrfToken" type="hidden" defaultValue={csrfToken} />

            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Your username or email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="Enter your email or username"
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="flex items-center justify-between space-x-4">
              <div className="flex items-center space-x-8">
                <div className="flex items-center">
                  <input
                    id="remember"
                    name="remember"
                    type="checkbox"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    checked={rememberMe}
                    onChange={() => setRememberMe(!rememberMe)}
                  />
                  <label
                    htmlFor="remember"
                    className="ml-2 block text-sm text-gray-700 whitespace-nowrap"
                  >
                    Remember me
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    id="togglePassword"
                    type="checkbox"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    checked={showPassword}
                    onChange={() => setShowPassword(!showPassword)}
                  />
                  <label
                    htmlFor="togglePassword"
                    className="ml-2 block text-sm text-gray-700 whitespace-nowrap"
                  >
                    Show password
                  </label>
                </div>
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="w-full bg-yellow hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                disabled={loading === "..."}
              >
                {loading}
              </button>
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  or login with
                </span>
              </div>
            </div>

            <div className="mt-6">
              <button
                type="button"
                onClick={() => signInOAuth("google")}
                className="w-full flex items-center justify-center gap-2 bg-white border border-gray-300 rounded-md py-3 px-4 text-sm font-medium text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="#DB4437">
                  <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" />
                </svg>
                Login with Google
              </button>
            </div>

            <div className="text-center mt-4">
              <Link
                href="/pass/forget"
                className="text-sm text-yellow hover:underline"
              >
                Forgot your password?
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export async function getServerSideProps(context) {
  return {
    props: {
      csrfToken: await getCsrfToken(context),
    },
  };
}

export default LoginForm;
