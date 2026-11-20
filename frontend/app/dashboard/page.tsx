"use client";

import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/context/AuthContext";

export default function DashboardPage() {
  const { user } = useAuth();

  return (
    // No allowedRoles passed -> any logged-in user (customer or admin) can view
    <ProtectedRoute>
      <main className="flex-1 bg-stone-50 px-6 py-12">
        <section className="animate-fade-slide-up max-w-4xl mx-auto bg-white border border-stone-200 rounded-xl p-8">
          <p className="text-xs uppercase tracking-widest text-amber-700 font-medium mb-2">
            Customer Profile
          </p>
          <h1 className="text-2xl font-bold text-stone-900 mb-1">
            Welcome, {user?.full_name}
          </h1>
          <p className="text-sm text-stone-600 mb-6">
            Signed in as {user?.email} ({user?.role})
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border border-stone-200 rounded-lg p-5">
              <h2 className="font-semibold text-stone-900 mb-1">
                Profile & Delivery Details
              </h2>
              <p className="text-sm text-stone-600">
                Add your phone number and shipping address here for faster
                checkout.
              </p>
            </div>
            <div className="border border-stone-200 rounded-lg p-5">
              <h2 className="font-semibold text-stone-900 mb-1">
                Order History
              </h2>
              <p className="text-sm text-stone-600">
                Your perfume orders will appear here once backend order APIs are
                connected.
              </p>
            </div>
          </div>
        </section>
      </main>
    </ProtectedRoute>
  );
}