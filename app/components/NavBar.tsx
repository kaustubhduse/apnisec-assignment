"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";

export default function NavBar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem("accessToken");
    setIsLoggedIn(!!token);
  }, [pathname]); // Re-check on route change

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

    // Clear tokens from localStorage
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
    <nav className="bg-gray-800 text-white p-4">
      <div className="flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="text-xl font-bold cursor-pointer hover:text-gray-300">
          ApniSec
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-4">
          {isLoggedIn ? (
            <>
              <Link href="/dashboard" className="cursor-pointer hover:text-gray-300 transition-colors">
                Dashboard
              </Link>
              <Link href="/profile" className="cursor-pointer hover:text-gray-300 transition-colors">
                Profile
              </Link>
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded cursor-pointer transition-colors"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="cursor-pointer hover:bg-gray-700 transition-colors px-6 py-2 rounded border border-gray-600">
                Login
              </Link>
              <Link href="/register" className="cursor-pointer bg-blue-600 hover:bg-blue-700 transition-colors px-6 py-2 rounded">
                Register
              </Link>
            </>
          )}
        </div>

        {/* Hamburger Button for Mobile */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden cursor-pointer p-2 hover:bg-gray-700 rounded transition-colors"
          aria-label="Toggle menu"
        >
          <div className="w-6 h-0.5 bg-white mb-1"></div>
          <div className="w-6 h-0.5 bg-white mb-1"></div>
          <div className="w-6 h-0.5 bg-white"></div>
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden mt-4 flex flex-col gap-3">
          {isLoggedIn ? (
            <>
              <Link 
                href="/dashboard" 
                className="cursor-pointer hover:text-gray-300 transition-colors py-2"
                onClick={closeMobileMenu}
              >
                Dashboard
              </Link>
              <Link 
                href="/profile" 
                className="cursor-pointer hover:text-gray-300 transition-colors py-2"
                onClick={closeMobileMenu}
              >
                Profile
              </Link>
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded cursor-pointer transition-colors text-left"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link 
                href="/login" 
                className="cursor-pointer hover:bg-gray-700 transition-colors py-2 px-6 rounded border border-gray-600 text-center"
                onClick={closeMobileMenu}
              >
                Login
              </Link>
              <Link 
                href="/register" 
                className="cursor-pointer bg-blue-600 hover:bg-blue-700 transition-colors py-2 px-6 rounded text-center"
                onClick={closeMobileMenu}
              >
                Register
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
