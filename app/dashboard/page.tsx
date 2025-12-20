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
    priority: "",
    status: "",
  });
  const [error, setError] = useState("");
  const [isLoadingInitial, setIsLoadingInitial] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [isDeletingId, setIsDeletingId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [activeFilter, setActiveFilter] = useState("");
  const [isLoadingPage, setIsLoadingPage] = useState(false);
  const [isLoadingFilter, setIsLoadingFilter] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const ITEMS_PER_PAGE = 5;

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

  const fetchIssues = async (typeFilter?: string, searchFilter?: string) => {
    const token = localStorage.getItem("accessToken");
    if (!token) return;
    
    const params = new URLSearchParams();
    if (typeFilter) params.append('type', typeFilter);
    if (searchFilter) params.append('search', searchFilter);
    
    let url = "/api/issues";
    if (params.toString()) url += `?${params.toString()}`;
    
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    if (res.ok) {
      setIssues(data.issues);
      setCurrentPage(1); 
    }
    setIsLoadingFilter(false);
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
      const issueData: any = {
        type: form.type,
        title: form.title,
        description: form.description,
      };
      
      if (form.priority) issueData.priority = form.priority;
      if (form.status) issueData.status = form.status;
      
      const res = await fetch("/api/issues", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(issueData),
      });
      if (!res.ok) throw new Error("Error creating issue");
      const data = await res.json();
      setIssues([data.issue, ...issues]); // Add to beginning
      setForm({ ...form, title: "", description: "", priority: "", status: "" });
    } 
    catch (err: any) {
      setError(err.message);
    } 
    finally {
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
    setActiveFilter(type);
    setIsLoadingFilter(true);
    fetchIssues(type, searchQuery);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoadingFilter(true);
    fetchIssues(activeFilter, searchQuery);
  };

  const clearSearch = () => {
    setSearchQuery("");
    setIsLoadingFilter(true);
    fetchIssues(activeFilter, "");
  };

  const totalPages = Math.ceil(issues.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentIssues = issues.slice(startIndex, endIndex);

  const goToPage = (page: number) => {
    setIsLoadingPage(true);
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(() => setIsLoadingPage(false), 300);
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "Cloud Security":
        return "bg-teal-900/30 text-teal-400 border border-teal-500/30";
      case "Reteam Assessment":
        return "bg-purple-900/30 text-purple-400 border border-purple-500/30";
      case "VAPT":
        return "bg-green-900/30 text-green-400 border border-green-500/30";
      default:
        return "bg-gray-800 text-gray-400";
    }
  };

  if (isLoadingInitial) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-[#020617] via-[#020617] to-black font-mono">
        <div className="flex flex-col items-center gap-4">
          <LoadingSpinner size="lg" />
          <p className="text-cyan-400">Loading secure dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#020617] via-[#020617] to-black font-mono pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-cyan-400">Dashboard</h1>
            {user && (
              <p className="text-gray-400 mt-2">Welcome back, {user.name}! 👋</p>
            )}
          </div>
          
          <form onSubmit={handleSearch} className="flex gap-2">
            <input
              type="text"
              placeholder="Search issues..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-64 px-3 py-2 bg-black border border-cyan-900/40 text-green-400 rounded-md focus:ring-2 focus:ring-cyan-500 focus:outline-none transition-colors placeholder-gray-600 text-sm"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-cyan-600 text-black font-semibold rounded-md hover:bg-cyan-500 transition-colors shadow-[0_0_12px_rgba(34,211,238,0.5)] text-sm"
            >
              Search
            </button>
            {searchQuery && (
              <button
                type="button"
                onClick={clearSearch}
                className="px-3 py-2 bg-slate-800/50 text-gray-400 rounded-md hover:bg-slate-700 hover:text-cyan-400 transition-colors border border-cyan-900/20 text-sm"
              >
                Clear
              </button>
            )}
          </form>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <div className="bg-[#020617] border border-cyan-900/40 rounded-lg shadow-[0_0_20px_rgba(34,211,238,0.15)] p-6 sticky top-6">
              <h2 className="text-xl font-semibold text-cyan-400 mb-4">
                Create New Issue
              </h2>
              {error && (
                <div className="mb-4 p-3 bg-red-900/20 border border-red-500/30 text-red-400 rounded-md text-sm">
                  {error}
                </div>
              )}
              <form onSubmit={handleCreate} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Issue Type
                  </label>
                  <select
                    value={form.type}
                    onChange={(e) => setForm({ ...form, type: e.target.value })}
                    className="w-full px-4 py-2 bg-black border border-cyan-900/40 text-green-400 rounded-md focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-colors"
                    disabled={isCreating}
                  >
                    <option>Cloud Security</option>
                    <option>Reteam Assessment</option>
                    <option>VAPT</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Title
                  </label>
                  <input
                    type="text"
                    placeholder="Enter issue title"
                    className="w-full px-4 py-2 bg-black border border-cyan-900/40 text-green-400 rounded-md focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-colors placeholder-gray-600"
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    required
                    disabled={isCreating}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Description
                  </label>
                  <textarea
                    placeholder="Describe the issue..."
                    rows={4}
                    className="w-full px-4 py-2 bg-black border border-cyan-900/40 text-green-400 rounded-md focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-colors resize-none placeholder-gray-600"
                    value={form.description}
                    onChange={(e) =>
                      setForm({ ...form, description: e.target.value })
                    }
                    required
                    disabled={isCreating}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Priority (Optional)
                  </label>
                  <select
                    value={form.priority}
                    onChange={(e) => setForm({ ...form, priority: e.target.value })}
                    className="w-full px-4 py-2 bg-black border border-cyan-900/40 text-green-400 rounded-md focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-colors"
                    disabled={isCreating}
                  >
                    <option value="">Select priority</option>
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Critical">Critical</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Status (Optional)
                  </label>
                  <select
                    value={form.status}
                    onChange={(e) => setForm({ ...form, status: e.target.value })}
                    className="w-full px-4 py-2 bg-black border border-cyan-900/40 text-green-400 rounded-md focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-colors"
                    disabled={isCreating}
                  >
                    <option value="">Select status</option>
                    <option value="Open">Open</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Resolved">Resolved</option>
                    <option value="Closed">Closed</option>
                  </select>
                </div>
                <button
                  type="submit"
                  className="w-full bg-cyan-600 text-black py-2.5 px-4 rounded-md hover:bg-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-semibold transition-colors shadow-[0_0_12px_rgba(34,211,238,0.5)]"
                  disabled={isCreating}
                >
                  {isCreating ? (
                    <>
                      <LoadingSpinner size="sm" />
                      <span>Creating...</span>
                    </>
                  ) : (
                    <>
                      <span>Create Issue</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <div className="bg-[#020617] border border-cyan-900/40 rounded-lg shadow-[0_0_20px_rgba(34,211,238,0.15)] p-6">
              <h2 className="text-lg font-semibold text-cyan-400 mb-4">
                Filter Issues
              </h2>
              <div className="flex flex-wrap gap-2">
                {["", "Cloud Security", "Reteam Assessment", "VAPT"].map((type) => (
                  <button
                    key={type || "all"}
                    onClick={() => handleFilter(type)}
                    className={`px-4 py-2 rounded-md font-medium transition-colors ${
                      activeFilter === type
                        ? "bg-cyan-600 text-black shadow-[0_0_10px_rgba(34,211,238,0.5)]"
                        : "bg-slate-800/50 text-gray-400 hover:bg-slate-700 hover:text-cyan-400 border border-cyan-900/20"
                    }`}
                  >
                    {type || "All"}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4 relative">
              {(isLoadingPage || isLoadingFilter) && (
                <div className="absolute inset-0 bg-[#020617]/75 flex items-center justify-center z-10 rounded-lg">
                  <LoadingSpinner size="md" />
                </div>
              )}
              
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-cyan-400">
                  Your Issues ({issues.length})
                </h2>
              </div>

              {currentIssues.length > 0 ? (
                <>
                  <div className="grid gap-4">
                    {currentIssues.map((issue) => (
                      <div
                        key={issue.id}
                        className="bg-[#020617] border border-cyan-900/40 rounded-lg shadow-[0_0_16px_rgba(34,211,238,0.1)] p-6 hover:shadow-[0_0_24px_rgba(34,211,238,0.2)] transition-shadow"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start gap-2 mb-2 flex-wrap">
                              <span
                                className={`px-3 py-1 rounded-full text-xs font-semibold ${getTypeColor(
                                  issue.type
                                )}`}
                              >
                                {issue.type}
                              </span>
                              {issue.priority && (
                                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-orange-900/30 text-orange-400 border border-orange-500/30">
                                  {issue.priority}
                                </span>
                              )}
                              {issue.status && (
                                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-900/30 text-blue-400 border border-blue-500/30">
                                  {issue.status}
                                </span>
                              )}
                            </div>
                            <h3 className="text-lg font-semibold text-cyan-400 mb-2">
                              {issue.title}
                            </h3>
                            <p className="text-gray-400 text-sm leading-relaxed">
                              {issue.description}
                            </p>
                          </div>
                          <button
                            onClick={() => handleDelete(issue.id)}
                            className="text-red-400 hover:text-red-300 disabled:opacity-50 flex items-center gap-2 font-medium whitespace-nowrap transition-colors"
                            disabled={isDeletingId === issue.id}
                          >
                            {isDeletingId === issue.id ? (
                              <>
                                <LoadingSpinner size="sm" />
                                <span>Deleting...</span>
                              </>
                            ) : (
                              <>
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-5 w-5"
                                  viewBox="0 0 20 20"
                                  fill="currentColor"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                                <span>Delete</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {totalPages > 1 && (
                    <div className="bg-[#020617] border border-cyan-900/40 rounded-lg shadow-[0_0_16px_rgba(34,211,238,0.1)] p-4 mt-6">
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-gray-400">
                          Showing {startIndex + 1} to {Math.min(endIndex, issues.length)} of {issues.length} issues
                        </p>
                        <div className="flex gap-2">
                          <button
                            onClick={() => goToPage(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="px-3 py-2 bg-slate-800/50 text-gray-400 rounded-md hover:bg-slate-700 hover:text-cyan-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors border border-cyan-900/20"
                          >
                            Previous
                          </button>
                          <div className="flex gap-1">
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                              (page) => (
                                <button
                                  key={page}
                                  onClick={() => goToPage(page)}
                                  className={`px-3 py-2 rounded-md transition-colors ${
                                    currentPage === page
                                      ? "bg-cyan-600 text-black shadow-[0_0_10px_rgba(34,211,238,0.5)]"
                                      : "bg-slate-800/50 text-gray-400 hover:bg-slate-700 hover:text-cyan-400 border border-cyan-900/20"
                                  }`}
                                >
                                  {page}
                                </button>
                              )
                            )}
                          </div>
                          <button
                            onClick={() => goToPage(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className="px-3 py-2 bg-slate-800/50 text-gray-400 rounded-md hover:bg-slate-700 hover:text-cyan-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors border border-cyan-900/20"
                          >
                            Next
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="bg-[#020617] border border-cyan-900/40 rounded-lg shadow-[0_0_16px_rgba(34,211,238,0.1)] p-12 text-center">
                  <div className="text-cyan-400/40 mb-4">
                    <svg
                      className="mx-auto h-12 w-12"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-cyan-400 mb-1">
                    No issues found
                  </h3>
                  <p className="text-gray-500">
                    Create your first issue to get started!
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
