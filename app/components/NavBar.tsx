"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";

export default function NavBar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    setIsLoggedIn(!!token);
  }, [pathname]);

  const handleLogout = async () => {
    const refreshToken = localStorage.getItem("refreshToken");

    if (refreshToken) {
      try {
        await fetch("/api/auth/logout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ refreshToken }),
        });
      } catch (error) {
        console.error("Logout error:", error);
      }
    }

    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    setIsLoggedIn(false);
    setIsMobileMenuOpen(false);
    router.push("/login");
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="bg-gradient-to-r from-slate-900 via-gray-900 to-slate-900 text-white border-b border-cyan-500/20 shadow-lg">
      <div className="px-5 mx-auto">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity">
            <Image src="/logo.png" alt="ApniSec Logo" width={120} height={120} className="rounded" />
          </Link>

          <div className="hidden md:flex items-center space-x-6">
            {isLoggedIn ? (
              <>
                <Link href="/dashboard" className="cursor-pointer hover:text-cyan-400 transition-colors px-3 py-2 rounded-md hover:bg-slate-800/50 font-medium">
                  Dashboard
                </Link>
                <Link href="/profile" className="cursor-pointer hover:text-cyan-400 transition-colors px-3 py-2 rounded-md hover:bg-slate-800/50 font-medium">
                  Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="bg-red-600 hover:bg-red-700 px-5 py-2 rounded-md cursor-pointer transition-colors font-medium shadow-md hover:shadow-lg"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="cursor-pointer hover:text-cyan-400 transition-colors px-4 py-2 rounded-md hover:bg-slate-800/50 font-medium border border-transparent hover:border-cyan-500/30">
                  Login
                </Link>
                <Link href="/register" className="cursor-pointer bg-cyan-600 hover:bg-cyan-700 transition-colors px-5 py-2 rounded-md font-medium shadow-md hover:shadow-lg">
                  Register
                </Link>
              </>
            )}
          </div>

          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden cursor-pointer p-2 hover:bg-slate-800 rounded transition-colors"
            aria-label="Toggle menu"
          >
            <div className="w-6 h-0.5 bg-cyan-400 mb-1.5"></div>
            <div className="w-6 h-0.5 bg-cyan-400 mb-1.5"></div>
            <div className="w-6 h-0.5 bg-cyan-400"></div>
          </button>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-cyan-500/20 bg-slate-900/95 backdrop-blur-sm">
          <div className="px-4 py-4 space-y-3">
            {isLoggedIn ? (
              <>
                <Link 
                  href="/dashboard" 
                  className="block cursor-pointer hover:text-cyan-400 transition-colors py-2 px-3 rounded-md hover:bg-slate-800/50 font-medium"
                  onClick={closeMobileMenu}
                >
                  Dashboard
                </Link>
                <Link 
                  href="/profile" 
                  className="block cursor-pointer hover:text-cyan-400 transition-colors py-2 px-3 rounded-md hover:bg-slate-800/50 font-medium"
                  onClick={closeMobileMenu}
                >
                  Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full bg-red-600 hover:bg-red-700 px-4 py-2 rounded-md cursor-pointer transition-colors text-left font-medium shadow-md"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link 
                  href="/login" 
                  className="block cursor-pointer hover:text-cyan-400 transition-colors py-2 px-3 rounded-md hover:bg-slate-800/50 font-medium border border-transparent hover:border-cyan-500/30"
                  onClick={closeMobileMenu}
                >
                  Login
                </Link>
                <Link 
                  href="/register" 
                  className="block cursor-pointer bg-cyan-600 hover:bg-cyan-700 transition-colors py-2 px-3 rounded-md text-center font-medium shadow-md"
                  onClick={closeMobileMenu}
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
