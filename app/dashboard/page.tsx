"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Issue = {
  id: string;
  type: string;
  title: string;
  description: string;
  priority?: string;
  status?: string;
};

export default function DashboardPage() {
  const [user, setUser] = useState<{ name: string } | null>(null);
  const [issues, setIssues] = useState<Issue[]>([]);
  const [form, setForm] = useState({
    type: "Cloud Security",
    title: "",
    description: "",
  });
  const [error, setError] = useState("");
  const router = useRouter();

  const fetchUser = async () => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      router.push("/login");
      return;
    }
    const res = await fetch("/api/auth/me", {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) {
      router.push("/login");
      return;
    }
    const data = await res.json();
    setUser(data.user);
  };

  const fetchIssues = async (typeFilter?: string) => {
    const token = localStorage.getItem("accessToken");
    if (!token) return;
    let url = "/api/issues";
    if (typeFilter) url += `?type=${encodeURIComponent(typeFilter)}`;
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    if (res.ok) {
      setIssues(data.issues);
    }
  };

  useEffect(() => {
    fetchUser();
    fetchIssues();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("accessToken");
      const res = await fetch("/api/issues", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Error creating issue");
      const data = await res.json();
      setIssues([...issues, data.issue]);
      setForm({ ...form, title: "", description: "" });
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleDelete = async (id: string) => {
    const token = localStorage.getItem("accessToken");
    await fetch(`/api/issues/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    setIssues(issues.filter((issue) => issue.id !== id));
  };

  const handleFilter = (type: string) => {
    fetchIssues(type);
  };

  return (
    <div className="max-w-2xl mx-auto mt-8">
      <h2 className="text-xl mb-2">Dashboard</h2>
      {user && <p>Welcome, {user.name}!</p>}

      <div className="mt-6">
        <h3 className="font-semibold">Create New Issue</h3>
        {error && <p className="text-red-500">{error}</p>}
        <form onSubmit={handleCreate} className="flex flex-col gap-2">
          <select
            value={form.type}
            onChange={(e) => setForm({ ...form, type: e.target.value })}
            className="border p-2"
          >
            <option>Cloud Security</option>
            <option>Reteam Assessment</option>
            <option>VAPT</option>
          </select>
          <input
            type="text"
            placeholder="Title"
            className="border p-2"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            required
          />
          <textarea
            placeholder="Description"
            className="border p-2"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            required
          />
          <button
            type="submit"
            className="bg-green-600 text-white py-2 rounded"
          >
            Create
          </button>
        </form>
      </div>

      <div className="mt-6">
        <h3 className="font-semibold">Filter Issues</h3>
        <button
          onClick={() => handleFilter("")}
          className="mr-2 px-2 py-1 bg-gray-300 rounded"
        >
          All
        </button>
        <button
          onClick={() => handleFilter("Cloud Security")}
          className="mr-2 px-2 py-1 bg-gray-300 rounded"
        >
          Cloud Security
        </button>
        <button
          onClick={() => handleFilter("Reteam Assessment")}
          className="mr-2 px-2 py-1 bg-gray-300 rounded"
        >
          Reteam
        </button>
        <button
          onClick={() => handleFilter("VAPT")}
          className="px-2 py-1 bg-gray-300 rounded"
        >
          VAPT
        </button>
      </div>

      <div className="mt-6">
        <h3 className="font-semibold">Your Issues</h3>
        {issues.map((issue) => (
          <div
            key={issue.id}
            className="border p-3 mt-2 rounded flex justify-between items-start"
          >
            <div>
              <h4 className="font-semibold">{issue.title}</h4>
              <p>Type: {issue.type}</p>
              <p>{issue.description}</p>
            </div>
            <button
              onClick={() => handleDelete(issue.id)}
              className="text-red-600"
            >
              Delete
            </button>
          </div>
        ))}
        {issues.length === 0 && <p>No issues found.</p>}
      </div>
    </div>
  );
}
