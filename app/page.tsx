// app/page.tsx
import Link from 'next/link';

export default function LandingPage() {
  return (
    <section>
      {/* Hero Section */}
      <div className="bg-blue-900 text-white text-center py-20">
        <h1 className="text-4xl font-bold mb-4">Welcome to ApniSec</h1>
        <p className="mb-6">Your Trusted Cybersecurity Partner</p>
        <Link href="/register" className="bg-white text-blue-900 px-6 py-3 rounded">
          Get Started
        </Link>
      </div>

      {/* Features Section */}
      <div className="p-8 grid md:grid-cols-3 gap-6">
        <div className="border p-4 rounded">
          <h2 className="text-xl font-semibold mb-2">Cloud Security</h2>
          <p>Protect your cloud infrastructure with robust security measures.</p>
        </div>
        <div className="border p-4 rounded">
          <h2 className="text-xl font-semibold mb-2">Reteam Assessment</h2>
          <p>Evaluate your team’s readiness and security awareness.</p>
        </div>
        <div className="border p-4 rounded">
          <h2 className="text-xl font-semibold mb-2">Vulnerability Testing</h2>
          <p>Identify and fix vulnerabilities with our expert testing.</p>
        </div>
      </div>
    </section>
  );
}
