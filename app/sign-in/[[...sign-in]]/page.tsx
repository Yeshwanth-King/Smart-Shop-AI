"use client";
// SignInForm.tsx
import React, { useState } from "react";
import { useSignIn } from "@clerk/clerk-react";
import { Mail } from "lucide-react";
import AuthFormProps from "../../types";
import { useRouter } from "next/navigation";
const SignInForm: React.FC<AuthFormProps> = ({
  redirectUrl = "/sso-callback",
  afterSignInUrl = "/",
}) => {
  const { signIn } = useSignIn();
  const [email, setEmail] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const router = useRouter();

  const handleOAuthSignIn = async (strategy: "oauth_google"): Promise<void> => {
    if (!signIn) return;

    try {
      setIsLoading(true);
      setError("");
      await signIn.authenticateWithRedirect({
        strategy,
        redirectUrl,
        redirectUrlComplete: afterSignInUrl,
      });
    } catch (err) {
      console.error("OAuth error:", err);
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!signIn) return;

    try {
      setIsLoading(true);
      setError("");
      await signIn.create({
        identifier: email,
      });
    } catch (err) {
      console.error("Email sign-in error:", err);
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#09090B] px-8 to-gray-800 flex flex-col justify-center">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="h-16 w-16 bg-indigo-500 rounded-xl mx-auto flex items-center justify-center">
          <span className="text-2xl font-bold text-white">AI</span>
        </div>

        <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
          Welcome back
        </h2>
        <p className="mt-2 text-center text-sm text-gray-400">
          Don&apos;t have an account?{" "}
          <button
            onClick={(ev) => {
              ev.preventDefault();
              router.push("/sign-up");
            }}
            className="font-medium text-indigo-400 hover:text-indigo-300 transition-colors"
          >
            Sign up for free
          </button>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-gray-800/50 backdrop-blur-xl py-8 px-4 shadow-xl ring-1 ring-gray-700/50 rounded-lg sm:rounded-2xl sm:px-10">
          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
              {error}
            </div>
          )}

          <div className="space-y-3">
            <button
              onClick={() => handleOAuthSignIn("oauth_google")}
              disabled={isLoading}
              className="w-full flex items-center justify-center px-4 py-2 border border-gray-700 rounded-xl 
                       shadow-sm bg-gray-800 hover:bg-gray-700 transition-colors text-white 
                       disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Continue with Google
            </button>
          </div>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-700"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-gray-800 text-gray-400">
                  Or continue with
                </span>
              </div>
            </div>
          </div>

          <form onSubmit={handleEmailSignIn} className="mt-6 space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-300"
              >
                Email address
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-500" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-700 rounded-xl 
                           bg-gray-800 text-white placeholder-gray-400 
                           focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent
                           disabled:opacity-50 disabled:cursor-not-allowed"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading || !email}
              className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-xl 
                       shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 
                       focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 
                       transition-colors duration-200
                       disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Loading..." : "Continue with Email"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignInForm;
