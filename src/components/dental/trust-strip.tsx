const trustItems = [
  "Personalised care",
  "Modern dentistry",
  "Comfort-focused",
  "Easy appointments",
];

export function TrustStrip() {
  return (
    <section className="border-y border-border bg-surface">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="grid divide-y divide-border sm:grid-cols-2 sm:divide-y-0 lg:grid-cols-4 lg:divide-x">
          {trustItems.map((item) => (
            <div
              key={item}
              className="flex items-center justify-center gap-3 px-4 py-5 text-center sm:py-6"
            >
              <span
                className="flex h-7 w-7 items-center justify-center rounded-full bg-primary-light text-xs font-semibold text-primary"
                aria-hidden="true"
              >
                ✓
              </span>

              <span className="text-sm font-medium text-foreground">
                {item}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
