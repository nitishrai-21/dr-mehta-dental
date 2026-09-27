import { Clock3, MapPin, Phone } from "lucide-react";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-foreground text-background">
      <div className="mx-auto max-w-7xl px-5 py-14 lg:px-8 lg:py-16">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-[1.3fr_0.7fr_0.8fr]">
          {/* Brand */}
          <div>
            <a
              href="#"
              aria-label="Dr. Mehta Dental home"
              className="inline-flex items-center gap-3"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-sm font-semibold text-white">
                DM
              </span>

              <span>
                <span className="block font-serif text-xl font-semibold leading-none">
                  Dr. Mehta
                </span>

                <span className="mt-1 block text-[10px] font-medium uppercase tracking-[0.2em] text-background/45">
                  Dental Care
                </span>
              </span>
            </a>

            <p className="mt-6 max-w-sm text-sm leading-6 text-background/55">
              Modern dental care focused on your comfort, oral health, and
              confidence.
            </p>

            <a
              href="#contact"
              className="mt-7 inline-flex items-center rounded-full border border-background/20 px-5 py-2.5 text-sm font-medium text-background transition-colors hover:border-background/40 hover:bg-background/5"
            >
              Book an appointment
            </a>
          </div>

          {/* Quick links */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-background/35">
              Quick links
            </p>

            <nav className="mt-5 flex flex-col gap-3">
              <a
                href="#services"
                className="w-fit text-sm text-background/60 transition-colors hover:text-background"
              >
                Services
              </a>

              <a
                href="#about"
                className="w-fit text-sm text-background/60 transition-colors hover:text-background"
              >
                About
              </a>

              <a
                href="#reviews"
                className="w-fit text-sm text-background/60 transition-colors hover:text-background"
              >
                Reviews
              </a>

              <a
                href="#contact"
                className="w-fit text-sm text-background/60 transition-colors hover:text-background"
              >
                Contact
              </a>
              <a
                href="#faq"
                className="w-fit text-sm text-background/60 transition-colors hover:text-background"
              >
                FAQ
              </a>
            </nav>
          </div>

          {/* Clinic details */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-background/35">
              Clinic
            </p>

            <div className="mt-5 space-y-4">
              <div className="flex gap-3">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-background/40" />

                <p className="text-sm leading-6 text-background/60">
                  24 MG Road
                  <br />
                  Bengaluru, Karnataka 560001
                </p>
              </div>

              <a
                href="tel:+918012345678"
                className="flex items-center gap-3 text-sm text-background/60 transition-colors hover:text-background"
              >
                <Phone className="h-4 w-4 text-background/40" />
                +91 80 1234 5678
              </a>

              <div className="flex gap-3">
                <Clock3 className="mt-0.5 h-4 w-4 shrink-0 text-background/40" />

                <p className="text-sm leading-6 text-background/60">
                  Mon – Sat
                  <br />
                  9:00 AM – 7:00 PM
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 flex flex-col gap-3 border-t border-background/10 pt-6 text-xs text-background/35 sm:flex-row sm:items-center sm:justify-between">
          <p>© {year} Dr. Mehta Dental. All rights reserved.</p>

          <div className="flex gap-5">
            <a href="#" className="transition-colors hover:text-background/70">
              Privacy
            </a>

            <a href="#" className="transition-colors hover:text-background/70">
              Terms
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
