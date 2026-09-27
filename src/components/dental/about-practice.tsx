import {
  Check,
  GraduationCap,
  HeartHandshake,
  Microscope,
  ShieldCheck,
} from "lucide-react";

const highlights = [
  {
    title: "Experienced care",
    description:
      "More than 15 years of experience across general and cosmetic dentistry.",
    icon: ShieldCheck,
  },
  {
    title: "Modern technology",
    description:
      "Contemporary tools and techniques for precise and comfortable treatment.",
    icon: Microscope,
  },
  {
    title: "Comfort-first approach",
    description:
      "A calm environment and thoughtful care designed around each patient.",
    icon: HeartHandshake,
  },
];

export function AboutPractice() {
  return (
    <section id="about" className="bg-background py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="grid items-center gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          {/* Doctor visual */}
          <div className="relative">
            <div className="relative aspect-[4/4.5] overflow-hidden rounded-[1.75rem] bg-primary-light">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/15 via-transparent to-accent/20" />

              <div className="absolute inset-5 flex items-center justify-center overflow-hidden rounded-[1.35rem] border border-primary/10 bg-[#e8efec]">
                <div className="text-center">
                  <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-primary text-2xl font-semibold text-white shadow-lg">
                    DM
                  </div>

                  <p className="mt-5 font-serif text-2xl font-semibold text-foreground">
                    Dr. Arjun Mehta
                  </p>

                  <p className="mt-1 text-sm font-medium text-primary">
                    BDS, MDS
                  </p>

                  <p className="mt-1 text-xs text-muted">
                    Cosmetic & General Dentistry
                  </p>
                </div>
              </div>
            </div>

            {/* Credential */}
            <div className="absolute -bottom-4 -right-2 rounded-xl border border-border bg-surface p-3.5 shadow-md sm:-right-4">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent-light text-accent">
                  <GraduationCap className="h-4 w-4" />
                </div>

                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-primary">
                    Qualified
                  </p>

                  <p className="text-sm font-medium text-foreground">
                    BDS · MDS
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
              About the practice
            </p>

            <h2 className="mt-3 max-w-xl text-4xl font-semibold leading-tight sm:text-5xl">
              Experienced care with a personal touch.
            </h2>

            <p className="mt-5 max-w-2xl text-base leading-7 text-muted">
              Dr. Arjun Mehta provides thoughtful, personalised dental care in a
              comfortable and welcoming environment.
            </p>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-muted">
              With more than 15 years of experience across general and cosmetic
              dentistry, the practice combines modern techniques with a simple
              philosophy: listen carefully, explain clearly, and treat every
              patient as an individual.
            </p>

            {/* Highlights */}
            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              {highlights.map((highlight) => {
                const Icon = highlight.icon;

                return (
                  <div key={highlight.title}>
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-light text-primary">
                      <Icon className="h-4 w-4" />
                    </div>

                    <h3 className="mt-3 text-sm font-semibold text-foreground">
                      {highlight.title}
                    </h3>

                    <p className="mt-1.5 text-xs leading-5 text-muted">
                      {highlight.description}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Small trust row */}
            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-border pt-6">
              <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                <Check className="h-4 w-4 text-primary" />
                Patient-first philosophy
              </div>

              <div className="text-sm text-muted">Clear treatment guidance</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
