import { Bell, LogOut, Search } from "lucide-react";
import { logoutAdmin } from "@/app/actions/auth";

export function AdminHeader({
  displayName = "Admin",
}: {
  displayName?: string;
}) {
  const initials = displayName
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-background/95 px-5 backdrop-blur sm:px-6 lg:px-8">
      <div className="pl-12 lg:pl-0">
        <p className="text-xs text-muted">Clinic administration</p>
        <h1 className="text-sm font-semibold text-foreground">
          Dr. Mehta Dental
        </h1>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          className="hidden h-9 items-center gap-2 rounded-lg border border-border bg-surface px-3 text-xs text-muted transition-colors hover:text-foreground sm:flex"
        >
          <Search className="h-4 w-4" />
          Search
          <span className="ml-2 rounded border border-border px-1.5 py-0.5 text-[10px]">
            ⌘ K
          </span>
        </button>

        <button
          type="button"
          aria-label="Notifications"
          className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-surface text-muted transition-colors hover:text-foreground"
        >
          <Bell className="h-4 w-4" />

          <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-accent" />
        </button>

        <form action={logoutAdmin}>
          <button
            type="submit"
            className="flex h-9 items-center gap-2 rounded-lg border border-border bg-surface px-3 text-xs text-muted transition-colors hover:text-foreground"
            aria-label="Sign out"
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </form>

        <div className="ml-1 flex h-9 w-9 items-center justify-center rounded-full bg-primary text-xs font-semibold text-white">
          {initials}
        </div>
      </div>
    </header>
  );
}
