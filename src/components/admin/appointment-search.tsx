"use client";

import { Search, X } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export function AppointmentSearch({
  defaultValue = "",
}: {
  defaultValue?: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [value, setValue] = useState(defaultValue);

  useEffect(() => {
    setValue(searchParams.get("query") ?? "");
  }, [searchParams]);

  function submitSearch(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const params = new URLSearchParams(searchParams);

    if (value.trim()) {
      params.set("query", value.trim());
    } else {
      params.delete("query");
    }

    params.delete("page");

    router.replace(`${pathname}?${params.toString()}`);
  }

  function clearSearch() {
    const params = new URLSearchParams(searchParams);

    params.delete("query");
    params.delete("page");

    setValue("");

    router.replace(`${pathname}?${params.toString()}`);
  }

  return (
    <form onSubmit={submitSearch} className="relative w-full sm:max-w-sm">
      <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />

      <input
        type="search"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder="Search patients or treatment..."
        className="h-10 w-full rounded-xl border border-border bg-surface pl-10 pr-10 text-sm outline-none transition-colors placeholder:text-muted/70 focus:border-primary focus:ring-2 focus:ring-primary/10"
      />

      {value && (
        <button
          type="button"
          onClick={clearSearch}
          aria-label="Clear search"
          className="absolute right-2.5 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-md text-muted hover:bg-surface-muted hover:text-foreground"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      )}
    </form>
  );
}
