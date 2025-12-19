"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
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
  };

  const handleUpdate = async () => {
    const token = localStorage.getItem("accessToken");
    await fetch("/api/users/profile", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name }),
    });
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  return (
    <div className="max-w-md mx-auto mt-10">
      <h2 className="text-2xl mb-4">Your Profile</h2>
      <label className="block mb-2">Name</label>
      <input
        className="border p-2 w-full mb-4"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <label className="block mb-2">Email</label>
      <input className="border p-2 w-full mb-4" value={email} readOnly />
      <button
        onClick={handleUpdate}
        className="bg-blue-600 text-white py-2 px-4 rounded"
      >
        Update Profile
      </button>
    </div>
  );
}
