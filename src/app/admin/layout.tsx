import type { ReactNode } from "react";
import { AdminLayoutShell } from "@/components/admin/admin-layout-shell";
import { getCurrentAdmin } from "@/lib/auth";

export default async function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  const admin = await getCurrentAdmin();

  if (!admin) {
    return <>{children}</>;
  }

  const role = admin.role === "RECEPTION" ? "RECEPTION" : "ADMIN";

  return (
    <AdminLayoutShell role={role} displayName={admin.name}>
      {children}
    </AdminLayoutShell>
  );
}
