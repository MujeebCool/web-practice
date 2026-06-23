"use client";

import { useState } from "react";
import Sidebar from "@/components/dashboard/Sidebar";
import Topbar from "@/components/dashboard/Topbar";

/**
 * Dashboard Layout — Sidebar + Topbar shell
 *
 * Professional data-forward layout. Sidebar collapses on mobile
 * with hamburger toggle in the Topbar.
 */
export default function DashboardLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-ivory">
      {/* Sidebar */}
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main content area */}
      <div className="flex flex-1 flex-col lg:ml-64">
        <Topbar onMenuToggle={() => setSidebarOpen(true)} />
        <main className="flex-1 px-6 py-8 lg:px-10">
          {children}
        </main>
      </div>
    </div>
  );
}
