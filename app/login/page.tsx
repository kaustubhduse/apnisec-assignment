"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import LoadingSpinner from "../components/LoadingSpinner";

export default function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Login failed");

      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("refreshToken", data.refreshToken);

      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message);
      setIsLoading(false);
    }
  }

  return (
    <div className="h-[100dvh] w-screen overflow-hidden bg-gradient-to-br from-[#020617] via-[#020617] to-black font-mono flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-[#020617] border border-cyan-900/40 rounded-lg shadow-[0_0_20px_rgba(34,211,238,0.15)] p-6">
          <h2 className="text-2xl font-bold text-cyan-400 mb-6 tracking-wide text-center">
            Secure Login
          </h2>

          {error && (
            <p className="text-red-400 mb-4 text-sm text-center">{error}</p>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input
              type="email"
              placeholder="Email"
              className="w-full bg-black border border-cyan-900/40 text-green-400 
                         px-3 py-2 rounded-md 
                         focus:ring-2 focus:ring-cyan-500 
                         focus:outline-none placeholder-gray-600"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
              disabled={isLoading}
            />

            <input
              type="password"
              placeholder="Password"
              className="w-full bg-black border border-cyan-900/40 text-green-400 
                         px-3 py-2 rounded-md 
                         focus:ring-2 focus:ring-cyan-500 
                         focus:outline-none placeholder-gray-600"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
              disabled={isLoading}
            />

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-cyan-600 text-black font-semibold py-2.5 rounded-md 
                         hover:bg-cyan-500 transition 
                         shadow-[0_0_12px_rgba(34,211,238,0.5)]
                         disabled:opacity-50 disabled:cursor-not-allowed
                         flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <LoadingSpinner size="sm" />
                  <span>Logging in...</span>
                </>
              ) : (
                "Login"
              )}
            </button>

            <div className="text-center mt-4">
              <a
                href="/forgot-password"
                className="text-cyan-400 hover:text-cyan-300 text-sm transition-colors"
              >
                Forgot Password?
              </a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
