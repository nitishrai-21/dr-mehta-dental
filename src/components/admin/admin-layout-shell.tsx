"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { AdminHeader } from "@/components/admin/admin-header";

export function AdminLayoutShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <AdminSidebar />

      <div className="lg:pl-64">
        <AdminHeader />

        <main className="px-5 py-6 sm:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
