"use client";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [token, setToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const tokenParam = searchParams.get("token");
    if (tokenParam) {
      setToken(tokenParam);
    } else {
      setError("Invalid reset link");
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");
    setError("");

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters long");
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage(data.message);
        setTimeout(() => {
          router.push("/login");
        }, 2000);
      } else {
        setError(data.error || "Failed to reset password");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#020617] via-[#020617] to-black font-mono flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-[#020617] border border-cyan-900/40 rounded-lg shadow-[0_0_30px_rgba(34,211,238,0.2)] p-8">
          <h1 className="text-3xl font-bold text-cyan-400 mb-2 text-center">
            Reset Password
          </h1>
          <p className="text-gray-400 text-center mb-6 text-sm">
            Enter your new password below
          </p>

          {message && (
            <div className="mb-4 p-3 bg-green-900/20 border border-green-500/30 text-green-400 rounded-md text-sm">
              {message} Redirecting to login...
            </div>
          )}

          {error && (
            <div className="mb-4 p-3 bg-red-900/20 border border-red-500/30 text-red-400 rounded-md text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="newPassword"
                className="block text-sm font-medium text-gray-400 mb-2"
              >
                New Password
              </label>
              <input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                className="w-full px-4 py-2 bg-black border border-cyan-900/40 text-green-400 rounded-md focus:ring-2 focus:ring-cyan-500 focus:outline-none transition-colors placeholder-gray-600"
                placeholder="Enter new password"
                disabled={isLoading || !token}
              />
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-400 mb-2"
              >
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full px-4 py-2 bg-black border border-cyan-900/40 text-green-400 rounded-md focus:ring-2 focus:ring-cyan-500 focus:outline-none transition-colors placeholder-gray-600"
                placeholder="Confirm new password"
                disabled={isLoading || !token}
              />
            </div>

            <button
              type="submit"
              disabled={isLoading || !token}
              className="w-full bg-cyan-600 text-black py-2.5 px-4 rounded-md hover:bg-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-semibold transition-colors shadow-[0_0_12px_rgba(34,211,238,0.5)]"
            >
              {isLoading ? "Resetting..." : "Reset Password"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link
              href="/login"
              className="text-cyan-400 hover:text-cyan-300 text-sm transition-colors"
            >
              ← Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
