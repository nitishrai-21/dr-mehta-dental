"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  CalendarDays,
  ClipboardList,
  Clock3,
  LayoutDashboard,
  LogOut,
  Menu,
  Pill,
  Stethoscope,
  Users,
  X,
} from "lucide-react";
import { useState } from "react";
import { logoutAdmin } from "@/app/actions/auth";

const navigation = [
  {
    name: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
    roles: ["ADMIN", "RECEPTION"],
  },
  {
    name: "Appointments",
    href: "/admin/appointments",
    icon: CalendarDays,
    roles: ["ADMIN", "RECEPTION"],
  },
  {
    name: "Patients",
    href: "/admin/patients",
    icon: Users,
    roles: ["ADMIN", "RECEPTION"],
  },
  {
    name: "Prescriptions",
    href: "/admin/prescriptions",
    icon: Pill,
    roles: ["ADMIN", "RECEPTION"],
  },
  {
    name: "Audit Log",
    href: "/admin/audit",
    icon: Clock3,
    roles: ["ADMIN"],
  },
] as const;

export function AdminSidebar({ role }: { role: "ADMIN" | "RECEPTION" }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const visibleNavigation = navigation.filter((item) =>
    item.roles.some((allowedRole) => allowedRole === role),
  );

  return (
    <>
      {/* Mobile trigger */}
      <button
        type="button"
        onClick={() => setMobileOpen(true)}
        className="fixed left-4 top-4 z-40 flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-surface text-foreground shadow-sm lg:hidden"
        aria-label="Open navigation"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Mobile backdrop */}
      {mobileOpen && (
        <button
          type="button"
          aria-label="Close navigation"
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 z-40 bg-black/30 lg:hidden"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-border bg-surface transition-transform duration-200 lg:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-16 items-center justify-between border-b border-border px-5">
          <Link
            href="/admin"
            onClick={() => setMobileOpen(false)}
            className="flex items-center gap-2.5"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-white">
              <Stethoscope className="h-5 w-5" />
            </div>

            <div>
              <p className="text-sm font-semibold text-foreground">
                Dr. Mehta Dental
              </p>
              <p className="text-[11px] text-muted">Admin Portal</p>
            </div>
          </Link>

          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-muted hover:bg-surface-muted hover:text-foreground lg:hidden"
            aria-label="Close navigation"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <nav className="flex-1 space-y-1 px-3 py-5">
          <p className="mb-3 px-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-muted">
            Clinic
          </p>

          {visibleNavigation.map((item) => {
            const Icon = item.icon;

            const isActive =
              item.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-primary-light text-primary"
                    : "text-muted hover:bg-surface-muted hover:text-foreground"
                }`}
              >
                <Icon className="h-[18px] w-[18px]" />
                <span>{item.name}</span>
              </Link>
            );
          })}

          <div className="my-5 border-t border-border" />

          <p className="mb-3 px-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-muted">
            Public site
          </p>

          <Link
            href="/"
            className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted transition-colors hover:bg-surface-muted hover:text-foreground"
          >
            <ClipboardList className="h-[18px] w-[18px]" />
            <span>View website</span>
          </Link>
        </nav>

        <div className="border-t border-border p-4">
          <form action={logoutAdmin}>
            <button
              type="submit"
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-border bg-surface px-3 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-surface-muted"
            >
              <LogOut className="h-4 w-4" />
              Sign out
            </button>
          </form>

          <div className="mt-3 rounded-xl bg-surface-muted p-3">
            <p className="text-xs font-semibold text-foreground">Demo clinic</p>
            <p className="mt-1 text-[11px] leading-4 text-muted">
              Manage appointments, patients and prescriptions.
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}
