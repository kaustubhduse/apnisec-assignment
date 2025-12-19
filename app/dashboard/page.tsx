"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import LoadingSpinner from "../components/LoadingSpinner";

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
  const [isLoadingInitial, setIsLoadingInitial] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [isDeletingId, setIsDeletingId] = useState<string | null>(null);
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
    const loadInitialData = async () => {
      await Promise.all([fetchUser(), fetchIssues()]);
      setIsLoadingInitial(false);
    };
    loadInitialData();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreating(true);
    setError("");
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
    } finally {
      setIsCreating(false);
    }
  };

  const handleDelete = async (id: string) => {
    setIsDeletingId(id);
    const token = localStorage.getItem("accessToken");
    await fetch(`/api/issues/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    setIssues(issues.filter((issue) => issue.id !== id));
    setIsDeletingId(null);
  };

  const handleFilter = (type: string) => {
    fetchIssues(type);
  };

  if (isLoadingInitial) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-4">
          <LoadingSpinner size="lg" />
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

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
            disabled={isCreating}
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
            disabled={isCreating}
          />
          <textarea
            placeholder="Description"
            className="border p-2"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            required
            disabled={isCreating}
          />
          <button
            type="submit"
            className="bg-green-600 text-white py-2 rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            disabled={isCreating}
          >
            {isCreating ? (
              <>
                <LoadingSpinner size="sm" />
                <span>Creating...</span>
              </>
            ) : (
              'Create'
            )}
          </button>
        </form>
      </div>

      <div className="mt-6">
        <h3 className="font-semibold">Filter Issues</h3>
        <button
          onClick={() => handleFilter("")}
          className="mr-2 px-2 py-1 bg-gray-300 rounded hover:bg-gray-400"
        >
          All
        </button>
        <button
          onClick={() => handleFilter("Cloud Security")}
          className="mr-2 px-2 py-1 bg-gray-300 rounded hover:bg-gray-400"
        >
          Cloud Security
        </button>
        <button
          onClick={() => handleFilter("Reteam Assessment")}
          className="mr-2 px-2 py-1 bg-gray-300 rounded hover:bg-gray-400"
        >
          Reteam
        </button>
        <button
          onClick={() => handleFilter("VAPT")}
          className="px-2 py-1 bg-gray-300 rounded hover:bg-gray-400"
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
              className="text-red-600 hover:text-red-800 disabled:opacity-50 flex items-center gap-2"
              disabled={isDeletingId === issue.id}
            >
              {isDeletingId === issue.id ? (
                <>
                  <LoadingSpinner size="sm" />
                  <span>Deleting...</span>
                </>
              ) : (
                'Delete'
              )}
            </button>
          </div>
        ))}
        {issues.length === 0 && <p>No issues found.</p>}
      </div>
    </div>
  );
}
