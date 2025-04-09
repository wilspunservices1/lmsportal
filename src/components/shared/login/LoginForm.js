
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
      {/* Left Section - Enhanced Background with Creative Elements */}
      <div className="hidden md:flex relative w-[750px] h-[700px] rounded-[20px] overflow-hidden bg-gradient-to-br from-blue-900 to-indigo-800">
        {/* <div className="hidden md:flex relative w-[750px] h-[700px] rounded-[20px] overflow-hidden"> */}
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
        <div className="absolute inset-0 overflow-hidden">
          {/* Floating Circles */}
          <div className="absolute top-1/4 left-1/4 w-40 h-40 rounded-full bg-blue-700 opacity-20 mix-blend-overlay animate-float1"></div>
          <div className="absolute top-1/3 right-1/5 w-32 h-32 rounded-full bg-indigo-600 opacity-20 mix-blend-overlay animate-float2"></div>
          <div className="absolute bottom-1/4 right-1/3 w-24 h-24 rounded-full bg-purple-500 opacity-20 mix-blend-overlay animate-float3"></div>

          {/* Diagonal Lines Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0 bg-[linear-gradient(45deg,_transparent_45%,_white_45%,_white_55%,_transparent_55%)] bg-[length:40px_40px]"></div>
          </div>
        </div>

        {/* Logo Container - Enhanced with subtle glow */}
        <div className="absolute left-0 top-1/2 transform -translate-y-1/2 z-20">
          <div className="bg-white/90 backdrop-blur-sm h-[120px] w-[500px] flex items-center justify-center rounded-r-[100px] shadow-xl border-l-4 border-yellow">
            <div className="relative group">
              <Image
                src={meridianLogo}
                alt="Meridian Logo"
                width={280}
                height={80}
                className="object-contain transition-transform duration-300 group-hover:scale-105"
                priority
              />
              <div className="absolute inset-0 rounded-full bg-blue-500/10 blur-md group-hover:opacity-50 transition-opacity duration-300 -z-10"></div>
            </div>
          </div>
        </div>

        {/* Content Overlay - Enhanced with animation */}
        <div className="absolute left-0 top-[65%] z-10 w-full">
          <div className="max-w-md mx-auto text-center px-8 space-y-6">
            <h2 className="text-4xl font-bold text-white mb-4 animate-fade-in-up">
              Welcome to <span className="text-yellow">Meridian</span>
            </h2>
            <p className="text-lg text-white/90 leading-relaxed animate-fade-in-up delay-100">
              Access your courses, collaborate with peers, and track your
              progress—all in one place.
            </p>

            {/* Animated Dots */}
            <div className="flex justify-center space-x-2 animate-bounce delay-300">
              <div className="w-3 h-3 bg-yellow rounded-full"></div>
              <div className="w-3 h-3 bg-white rounded-full"></div>
              <div className="w-3 h-3 bg-yellow rounded-full"></div>
            </div>
          </div>
        </div>

        {/* Bottom Decorative Elements */}
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black/30 to-transparent z-0"></div>
      </div>

      {/* Right Section - Login Form (unchanged) */}
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
            <h3 className="text-2xl font-semibold text-gray-800 mb-2 ml-40">
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
                className="w-[400px] px-6 py-4 text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow placeholder-gray-400"
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
                className="w-[400px] px-6 py-4 text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow placeholder-gray-400"
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
                className="w-full bg-yellow hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-300"
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
                className="w-full flex items-center justify-center gap-2 bg-white border border-gray-300 rounded-md py-3 px-4 text-sm font-medium text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-yellow transition-colors duration-300"
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
                className="text-sm text-yellow hover:underline transition-colors duration-300"
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
