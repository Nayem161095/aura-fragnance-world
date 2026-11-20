"use client";

import { MouseEvent } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function Navbar() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  async function handleLogout() {
    await logout();
    router.push("/login");
  }

  // Already on /login or /register -> trigger the smooth AuthSlider blade sweep instead of remounting
  function handleAuthNav(
    e: MouseEvent<HTMLAnchorElement>,
    target: "login" | "register"
  ) {
    if (pathname === "/login" || pathname === "/register") {
      e.preventDefault();
      window.dispatchEvent(new CustomEvent("auth-switch", { detail: target }));
    }
  }

  return (
    <header className="w-full bg-[#0D0A08]/95 backdrop-blur border-b border-[#C8A97E]/25 px-6 py-4 sticky top-0 z-30">
      <nav
        aria-label="Main navigation"
        className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-4"
      >
        {/* Brand Wordmark */}
        <Link href="/" className="flex flex-col leading-tight">
          <span className="font-serif text-xl md:text-2xl tracking-[0.14em] text-[#F5EFE6] uppercase">
            Aura
          </span>
          <span className="text-[9px] uppercase tracking-[0.32em] text-[#C8A97E]">
            Fragrance World
          </span>
        </Link>

        {/* Center Editorial Links */}
        <div className="flex flex-wrap items-center gap-6 text-xs uppercase tracking-[0.16em] text-[#F5EFE6]/80">
          <Link href="/" className="hover:text-[#C8A97E] transition">
            Home
          </Link>
          <Link href="/products" className="hover:text-[#C8A97E] transition">
            Shop
          </Link>
          <Link
            href="/#collections"
            className="hover:text-[#C8A97E] transition"
          >
            Collections
          </Link>
          <Link href="/#craft" className="hover:text-[#C8A97E] transition">
            About
          </Link>
        </div>

        {/* Right Auth Actions */}
        <div className="flex items-center gap-4 text-xs uppercase tracking-[0.14em]">
          {!loading && user ? (
            <>
              <Link
                href="/dashboard"
                className="text-[#F5EFE6]/85 hover:text-[#C8A97E] transition"
              >
                Profile
              </Link>
              {user.role === "admin" && (
                <Link
                  href="/admin"
                  className="text-[#C8A97E] font-semibold hover:text-[#F5EFE6] transition"
                >
                  Admin
                </Link>
              )}
              <button
                type="button"
                onClick={handleLogout}
                className="border border-[#C8A97E]/50 text-[#F5EFE6] px-4 py-2 rounded-full hover:bg-[#C8A97E] hover:text-[#0D0A08] transition cursor-pointer"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                onClick={(e) => handleAuthNav(e, "login")}
                className="text-[#F5EFE6]/85 hover:text-[#C8A97E] transition"
              >
                Login
              </Link>
              <Link
                href="/register"
                onClick={(e) => handleAuthNav(e, "register")}
                className="border border-[#C8A97E]/60 text-[#C8A97E] px-5 py-2 rounded-full hover:bg-[#C8A97E] hover:text-[#0D0A08] transition font-medium"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}