import type { ReactNode } from "react";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { AdminHeader } from "@/components/admin/admin-header";

export function AdminLayoutShell({
  children,
  role,
  displayName,
}: {
  children: ReactNode;
  role: "ADMIN" | "RECEPTION";
  displayName: string;
}) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <AdminSidebar role={role} />

      <div className="lg:pl-64">
        <AdminHeader displayName={displayName} />

        <main className="px-5 py-6 sm:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
