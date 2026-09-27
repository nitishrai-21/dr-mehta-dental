import Link from "next/link";

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  pathname: string;
  params: Record<string, string | undefined>;
};

export function Pagination({
  currentPage,
  totalPages,
  pathname,
  params,
}: PaginationProps) {
  if (totalPages <= 1) {
    return null;
  }

  function createHref(page: number) {
    const searchParams = new URLSearchParams();

    for (const [key, value] of Object.entries(params)) {
      if (value) {
        searchParams.set(key, value);
      }
    }

    if (page > 1) {
      searchParams.set("page", String(page));
    }

    const query = searchParams.toString();

    return query ? `${pathname}?${query}` : pathname;
  }

  return (
    <div className="flex items-center justify-between gap-4 border-t border-border pt-5">
      <p className="text-xs text-muted">
        Page {currentPage} of {totalPages}
      </p>

      <div className="flex items-center gap-2">
        {currentPage > 1 ? (
          <Link
            href={createHref(currentPage - 1)}
            className="rounded-lg border border-border bg-surface px-3 py-2 text-xs font-semibold text-foreground hover:bg-surface-muted"
          >
            Previous
          </Link>
        ) : (
          <span className="rounded-lg border border-border bg-surface-muted px-3 py-2 text-xs font-semibold text-muted">
            Previous
          </span>
        )}

        {currentPage < totalPages ? (
          <Link
            href={createHref(currentPage + 1)}
            className="rounded-lg border border-border bg-surface px-3 py-2 text-xs font-semibold text-foreground hover:bg-surface-muted"
          >
            Next
          </Link>
        ) : (
          <span className="rounded-lg border border-border bg-surface-muted px-3 py-2 text-xs font-semibold text-muted">
            Next
          </span>
        )}
      </div>
    </div>
  );
}
