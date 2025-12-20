"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import LoadingSpinner from "../components/LoadingSpinner";

export default function RegisterPage() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error("Registration failed");
      router.push("/login");
    } catch (err: any) {
      setError(err.message);
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#020617] via-[#020617] to-black font-mono flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="bg-[#020617] border border-cyan-900/40 rounded-lg shadow-[0_0_20px_rgba(34,211,238,0.15)] p-6">
          <h2 className="text-2xl font-bold text-cyan-400 mb-6 tracking-wide text-center">
            Create Secure Account
          </h2>

          {error && (
            <p className="text-red-400 mb-4 text-sm text-center">
              {error}
            </p>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* Name */}
            <input
              type="text"
              placeholder="Name"
              className="w-full bg-black border border-cyan-900/40 text-green-400 
                         px-3 py-2 rounded-md 
                         focus:ring-2 focus:ring-cyan-500 
                         focus:outline-none placeholder-gray-600"
              value={form.name}
              onChange={(e) =>
                setForm({ ...form, name: e.target.value })
              }
              required
              disabled={isLoading}
            />

            {/* Email */}
            <input
              type="email"
              placeholder="Email"
              className="w-full bg-black border border-cyan-900/40 text-green-400 
                         px-3 py-2 rounded-md 
                         focus:ring-2 focus:ring-cyan-500 
                         focus:outline-none placeholder-gray-600"
              value={form.email}
              onChange={(e) =>
                setForm({ ...form, email: e.target.value })
              }
              required
              disabled={isLoading}
            />

            {/* Password */}
            <input
              type="password"
              placeholder="Password"
              className="w-full bg-black border border-cyan-900/40 text-green-400 
                         px-3 py-2 rounded-md 
                         focus:ring-2 focus:ring-cyan-500 
                         focus:outline-none placeholder-gray-600"
              value={form.password}
              onChange={(e) =>
                setForm({ ...form, password: e.target.value })
              }
              required
              disabled={isLoading}
            />

            {/* Register Button */}
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
                  <span>Creating account...</span>
                </>
              ) : (
                "Register"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
