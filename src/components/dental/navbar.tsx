"use client";

import { useEffect, useState } from "react";
import { CalendarDays, Menu, Phone } from "lucide-react";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export function Navbar() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 768px)");

    const handleViewportChange = (event: MediaQueryListEvent) => {
      if (event.matches) {
        setOpen(false);
      }
    };

    mediaQuery.addEventListener("change", handleViewportChange);

    return () => {
      mediaQuery.removeEventListener("change", handleViewportChange);
    };
  }, []);

  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-background/90 backdrop-blur-md">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 lg:px-8">
        {/* Logo */}
        <a
          href="#"
          className="flex items-center gap-2"
          aria-label="Dr. Mehta Dental home"
          onClick={() => setOpen(false)}
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-sm font-semibold text-white">
            DM
          </span>

          <span className="leading-none">
            <span className="block font-serif text-lg font-semibold tracking-tight">
              Dr. Mehta
            </span>

            <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-muted">
              Dental Care
            </span>
          </span>
        </a>

        {/* Desktop navigation */}
        <nav
          className="hidden items-center gap-8 md:flex"
          aria-label="Main navigation"
        >
          <a
            href="#services"
            className="text-sm font-medium text-muted transition-colors hover:text-foreground"
          >
            Services
          </a>

          <a
            href="#about"
            className="text-sm font-medium text-muted transition-colors hover:text-foreground"
          >
            About
          </a>

          <a
            href="#reviews"
            className="text-sm font-medium text-muted transition-colors hover:text-foreground"
          >
            Reviews
          </a>

          <a
            href="#contact"
            className="rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-dark"
          >
            Book Appointment
          </a>
        </nav>

        {/* Mobile navigation */}
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger
            aria-label="Open navigation menu"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-surface text-foreground transition-colors hover:bg-surface-muted md:hidden"
          >
            <Menu className="h-5 w-5" aria-hidden="true" />
          </SheetTrigger>

          <SheetContent
            side="right"
            className="w-[85%] max-w-sm border-l border-border bg-background px-6"
          >
            <SheetHeader className="text-left">
              <SheetTitle className="font-serif text-2xl">
                Dr. Mehta Dental
              </SheetTitle>

              <SheetDescription className="text-sm leading-6 text-muted">
                Personalised dental care in a calm, modern environment.
              </SheetDescription>
            </SheetHeader>

            <nav className="mt-10 flex flex-col" aria-label="Mobile navigation">
              <a
                href="#services"
                onClick={() => setOpen(false)}
                className="border-b border-border py-4 text-left text-base font-medium text-foreground"
              >
                Services
              </a>

              <a
                href="#about"
                onClick={() => setOpen(false)}
                className="border-b border-border py-4 text-left text-base font-medium text-foreground"
              >
                About
              </a>

              <a
                href="#reviews"
                onClick={() => setOpen(false)}
                className="border-b border-border py-4 text-left text-base font-medium text-foreground"
              >
                Reviews
              </a>

              <a
                href="#contact"
                onClick={() => setOpen(false)}
                className="mt-6 flex items-center justify-center gap-2 rounded-full bg-primary px-5 py-3.5 text-sm font-semibold text-white"
              >
                <CalendarDays className="h-4 w-4" />
                Book an Appointment
              </a>

              <a
                href="tel:+910000000000"
                onClick={() => setOpen(false)}
                className="mt-3 flex items-center justify-center gap-2 rounded-full border border-border bg-surface px-5 py-3.5 text-sm font-semibold text-foreground"
              >
                <Phone className="h-4 w-4" />
                Call the Clinic
              </a>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
