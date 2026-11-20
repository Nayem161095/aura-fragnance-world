"use client"; // Needed for useEffect, useRouter, and useAuth

import { useEffect, ReactNode } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

// Typed props: allowedRoles is optional (if omitted, any logged-in user is allowed)
interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: Array<"customer" | "admin">;
}

export default function ProtectedRoute({
  children,
  allowedRoles,
}: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  const router = useRouter();

  // Redirect unauthenticated visitors to /login once session check finishes
  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login"); // replace() prevents Back button from looping back here
    }
  }, [user, loading, router]);

  // 1. Still checking session with backend
  if (loading) {
    return (
      <main className="flex-1 bg-stone-50 flex items-center justify-center px-4">
        <p className="text-sm text-stone-600">Checking session...</p>
      </main>
    );
  }

  // 2. Not logged in (redirecting to /login)
  if (!user) {
    return null;
  }

  // 3. Logged in, but role does not have permission (Authorization check)
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return (
      <main className="flex-1 bg-stone-50 flex items-center justify-center px-4 py-12">
        <section className="animate-fade-slide-up max-w-md w-full bg-white border border-stone-200 rounded-xl p-8 text-center">
          <h1 className="text-2xl font-bold text-stone-900 mb-2">
            Access Denied
          </h1>
          <p className="text-sm text-stone-600 mb-6">
            You do not have permission to view this page.
          </p>
          <Link
            href="/dashboard"
            className="inline-block bg-stone-900 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-stone-700 transition"
          >
            Back to My Profile
          </Link>
        </section>
      </main>
    );
  }

  // 4. Authenticated and authorized — render the protected page
  return <>{children}</>;
}