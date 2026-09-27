import {
  BarChart3,
  Database,
  FileLock2,
  Palette,
  Rocket,
  ShieldCheck,
} from "lucide-react";

const skills = [
  {
    title: "Modern product UX",
    description:
      "Premium client-facing interfaces designed to feel polished, credible, and conversion-ready.",
    icon: Palette,
  },
  {
    title: "Secure backend patterns",
    description:
      "Protected routes, server actions, and validation layers built for real business workflows.",
    icon: ShieldCheck,
  },
  {
    title: "Data + workflow systems",
    description:
      "Prisma-powered business logic for appointments, patient records, and operational admin workflows.",
    icon: Database,
  },
  {
    title: "Performance-minded delivery",
    description:
      "Pagination, optimized queries, and clean architecture so the product stays fast as it scales.",
    icon: Rocket,
  },
  {
    title: "Business-friendly reporting",
    description:
      "Clear dashboards and operational summaries designed to help clients understand outcomes quickly.",
    icon: BarChart3,
  },
  {
    title: "Trust-first implementation",
    description:
      "Access controls, shareable links, and privacy-conscious patterns that feel production-minded.",
    icon: FileLock2,
  },
];

export function SkillsShowcase() {
  return (
    <section className="bg-surface-muted py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
            Why clients choose this approach
          </p>

          <h2 className="mt-3 text-4xl font-semibold leading-tight sm:text-5xl">
            Built to look premium and perform like a real business system.
          </h2>

          <p className="mt-5 text-base leading-7 text-muted">
            This project blends strong product design with practical
            engineering, giving clients a polished experience and a reliable
            foundation for future growth.
          </p>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {skills.map(({ title, description, icon: Icon }) => (
            <div
              key={title}
              className="rounded-3xl border border-border bg-surface p-6 shadow-sm transition-transform duration-200 hover:-translate-y-1"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-light text-primary">
                <Icon className="h-5 w-5" />
              </div>

              <h3 className="mt-5 text-lg font-semibold text-foreground">
                {title}
              </h3>

              <p className="mt-3 text-sm leading-6 text-muted">{description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
