"use client";
import Image from "next/image";
import { useState } from "react";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="min-h-screen flex flex-col justify-between bg-primarygreen-1">
      {/* Main content */}
      <div className="flex flex-1 flex-col items-center justify-center p-4 sm:p-8">
        <div className="max-w-2xl w-full text-center space-y-6 sm:space-y-8 bg-white/90 rounded-2xl p-6 sm:p-10 shadow-2xl border border-white/30">
          {/* Logo */}
          <div className="mb-6 sm:mb-8 flex justify-center">
            <Image
              src="/deelfabriek-website-labels-boven_v2.svg"
              alt="Deelfabriek Kortrijk Logo"
              width={250}
              height={100}
              priority
              className="mx-auto w-[200px] sm:w-[250px]"
            />
          </div>
          {/* Login form */}
          <div className="w-full max-w-sm mx-auto flex flex-col gap-4">
            <input
              type="email"
              placeholder="Email"
              className="border rounded px-3 py-2"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="username"
              required
            />
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Wachtwoord"
                className="border rounded px-3 py-2 pr-10 w-full"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
              />
              <button
                type="button"
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500"
                onClick={() => setShowPassword((v) => !v)}
                tabIndex={-1}
                aria-label={
                  showPassword ? "Verberg wachtwoord" : "Toon wachtwoord"
                }
              >
                {showPassword ? (
                  // Eye open SVG
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                ) : (
                  // Eye closed SVG
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13.875 18.825A10.05 10.05 0 0112 19c-4.477 0-8.268-2.943-9.542-7a9.956 9.956 0 012.293-3.95m1.414-1.414A9.956 9.956 0 0112 5c4.477 0 8.268 2.943 9.542 7a9.956 9.956 0 01-4.043 5.197M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 3l18 18"
                    />
                  </svg>
                )}
              </button>
            </div>
            <button
              type="submit"
              className="bg-primarygreen-1 text-white py-2 rounded font-semibold hover:bg-blue-700 transition"
            >
              Login
            </button>
            <button
              type="button"
              className="text-primarygreen-1 text-sm underline mt-1 mx-auto block"
              onClick={() => {
                // handle forgot password
              }}
            >
              Wachtwoord vergeten?
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="w-full bg-[#004431] py-6 px-4 sm:px-8 border-t border-white/10">
        <div className="flex flex-col sm:flex-row items-start sm:items-center w-full max-w-2xl mx-auto gap-4 sm:gap-8 sm:justify-center">
          <div className="flex-shrink-0 flex items-center justify-center">
            <Image
              src="/logo-stadkortrijk.png"
              alt="Kortrijk Logo"
              width={140}
              height={56}
              className="bg-transparent w-[120px] h-auto mb-2 sm:mb-0 sm:w-[260px] sm:h-[45px]"
            />
          </div>
          <div className="text-white flex flex-col justify-center items-start">
            <span className="font-bold text-lg sm:text-lg">Deelfabriek</span>
            <span className="text-base sm:text-base">
              Rijkswachtstraat 5, 8500 Kortrijk
            </span>
            <span className="text-base sm:text-base mt-2">056 27 76 60</span>
            <span className="text-base sm:text-base">
              deelfabriek@kortrijk.be
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
