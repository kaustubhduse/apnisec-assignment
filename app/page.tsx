// app/page.tsx
import Link from "next/link";

export default function LandingPage() {
  return (
    <section className="min-h-screen bg-gradient-to-br from-[#020617] via-[#020617] to-black font-mono text-gray-200">
      {/* Hero Section */}
      <div className="flex flex-col items-center justify-center text-center px-6 py-24">
        <h1 className="text-4xl md:text-5xl font-bold text-cyan-400 mb-4 tracking-wide">
          Welcome to ApniSec
        </h1>
        <p className="text-gray-400 mb-8 max-w-xl">
          Your trusted partner for modern cybersecurity, vulnerability
          assessment, and cloud protection.
        </p>

        <Link
          href="/register"
          className="bg-cyan-600 text-black font-semibold px-8 py-3 rounded-md 
                     hover:bg-cyan-500 transition 
                     shadow-[0_0_14px_rgba(34,211,238,0.5)]"
        >
          Get Started
        </Link>
      </div>

      {/* Features Section */}
      <div className="max-w-6xl mx-auto px-6 pb-24 grid gap-6 md:grid-cols-3">
        {/* Feature 1 */}
        <div className="bg-[#020617] border border-cyan-900/40 rounded-lg p-6
                        shadow-[0_0_16px_rgba(34,211,238,0.1)]">
          <h2 className="text-xl font-semibold text-cyan-400 mb-3">
            Cloud Security
          </h2>
          <p className="text-gray-400">
            Protect your cloud infrastructure with advanced monitoring,
            access controls, and threat detection.
          </p>
        </div>

        {/* Feature 2 */}
        <div className="bg-[#020617] border border-purple-900/40 rounded-lg p-6
                        shadow-[0_0_16px_rgba(168,85,247,0.1)]">
          <h2 className="text-xl font-semibold text-purple-400 mb-3">
            Red Team Assessment
          </h2>
          <p className="text-gray-400">
            Simulate real-world attacks to evaluate your organization’s
            security posture and response readiness.
          </p>
        </div>

        {/* Feature 3 */}
        <div className="bg-[#020617] border border-green-900/40 rounded-lg p-6
                        shadow-[0_0_16px_rgba(34,197,94,0.1)]">
          <h2 className="text-xl font-semibold text-green-400 mb-3">
            Vulnerability Testing
          </h2>
          <p className="text-gray-400">
            Identify, prioritize, and fix vulnerabilities before attackers
            can exploit them.
          </p>
        </div>
      </div>
    </section>
  );
}
