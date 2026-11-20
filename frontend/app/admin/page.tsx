"use client";

import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/context/AuthContext";

export default function AdminDashboardPage() {
  const { user } = useAuth();

  return (
    // allowedRoles={["admin"]} -> only users with role "admin" can access this page
    <ProtectedRoute allowedRoles={["admin"]}>
      <main className="flex-1 bg-stone-50 px-6 py-12">
        <section className="animate-fade-slide-up max-w-5xl mx-auto bg-white border border-stone-200 rounded-xl p-8">
          <p className="text-xs uppercase tracking-widest text-amber-700 font-medium mb-2">
            Admin Panel
          </p>
          <h1 className="text-2xl font-bold text-stone-900 mb-1">
            Aura Fragrance World — Administration
          </h1>
          <p className="text-sm text-stone-600 mb-6">
            Signed in as administrator: {user?.full_name}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="border border-stone-200 rounded-lg p-5">
              <h2 className="font-semibold text-stone-900 mb-1">
                Inventory Management
              </h2>
              <p className="text-sm text-stone-600">
                Add, update, and track perfume products and stock levels.
              </p>
            </div>
            <div className="border border-stone-200 rounded-lg p-5">
              <h2 className="font-semibold text-stone-900 mb-1">
                Sales Tracking
              </h2>
              <p className="text-sm text-stone-600">
                Monitor customer orders, revenue, and fulfillment status.
              </p>
            </div>
            <div className="border border-stone-200 rounded-lg p-5">
              <h2 className="font-semibold text-stone-900 mb-1">
                User Management
              </h2>
              <p className="text-sm text-stone-600">
                View customer accounts and manage admin permissions.
              </p>
            </div>
          </div>
        </section>
      </main>
    </ProtectedRoute>
  );
}