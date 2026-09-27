"use client";

import { Search } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export function PatientSearch({
  defaultValue = "",
}: {
  defaultValue?: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [value, setValue] = useState(defaultValue);

  function submit(event: React.FormEvent<HTMLFormElement>) {
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

  return (
    <form onSubmit={submit} className="relative w-full sm:max-w-sm">
      <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />

      <input
        type="search"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder="Search name, phone or email..."
        className="h-10 w-full rounded-xl border border-border bg-surface pl-10 pr-3.5 text-sm outline-none transition-colors placeholder:text-muted/70 focus:border-primary focus:ring-2 focus:ring-primary/10"
      />
    </form>
  );
}
