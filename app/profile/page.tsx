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
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-4">
          <LoadingSpinner size="lg" />
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto mt-10 px-4">
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
        <h2 className="text-2xl font-bold mb-4">Your Profile</h2>
        <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
      <input
        className="border p-2 w-full mb-4"
        value={name}
        onChange={(e) => setName(e.target.value)}
        disabled={isUpdating}
      />
      <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
      <input className="border p-2 w-full mb-4" value={email} readOnly />
      <button
        onClick={handleUpdate}
        className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        disabled={isUpdating}
      >
        {isUpdating ? (
          <>
            <LoadingSpinner size="sm" />
            <span>Updating...</span>
          </>
        ) : (
          'Update Profile'
        )}
      </button>
      </div>
    </div>
  );
}
