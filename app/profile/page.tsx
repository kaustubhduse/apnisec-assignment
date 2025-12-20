"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import LoadingSpinner from "../components/LoadingSpinner";

export default function ProfilePage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const router = useRouter();

  const fetchProfile = async () => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      router.push("/login");
      return;
    }

    const res = await fetch("/api/users/profile", {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) {
      router.push("/login");
      return;
    }

    const data = await res.json();
    setName(data.user.name);
    setEmail(data.user.email);
    setIsLoadingProfile(false);
  };

  const handleUpdate = async () => {
    setIsUpdating(true);
    const token = localStorage.getItem("accessToken");

    await fetch("/api/users/profile", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name }),
    });

    setIsUpdating(false);
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  if (isLoadingProfile) {
    return (
      <div className="h-screen overflow-hidden flex items-center justify-center bg-gradient-to-br from-[#020617] via-[#020617] to-black font-mono">
        <div className="flex flex-col items-center gap-4">
          <LoadingSpinner size="lg" />
          <p className="text-cyan-400">Loading secure profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen overflow-hidden bg-gradient-to-br from-[#020617] via-[#020617] to-black font-mono flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-[#020617] border border-cyan-900/40 rounded-lg shadow-[0_0_20px_rgba(34,211,238,0.15)] p-6">
          <h2 className="text-2xl font-bold text-cyan-400 mb-6 tracking-wide">
            Secure Profile
          </h2>

          {/* Name */}
          <label className="block text-sm font-medium text-gray-400 mb-2">
            Name
          </label>
          <input
            className="w-full bg-black border border-cyan-900/40 text-green-400 
                       px-3 py-2 rounded-md mb-4 
                       focus:ring-2 focus:ring-cyan-500 
                       focus:outline-none"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={isUpdating}
          />

          {/* Email */}
          <label className="block text-sm font-medium text-gray-400 mb-2">
            Email
          </label>
          <input
            className="w-full bg-black border border-cyan-900/40 text-gray-400 
                       px-3 py-2 rounded-md mb-6 cursor-not-allowed"
            value={email}
            readOnly
          />

          {/* Update Button */}
          <button
            onClick={handleUpdate}
            disabled={isUpdating}
            className="w-full bg-cyan-600 text-black font-semibold py-2.5 rounded-md 
                       hover:bg-cyan-500 transition 
                       shadow-[0_0_12px_rgba(34,211,238,0.5)]
                       disabled:opacity-50 disabled:cursor-not-allowed
                       flex items-center justify-center gap-2"
          >
            {isUpdating ? (
              <>
                <LoadingSpinner size="sm" />
                <span>Updating...</span>
              </>
            ) : (
              "Update Profile"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
