"use client";

import {
  ArrowRight,
  Brush,
  CircleDot,
  HeartPulse,
  ScanLine,
  Smile,
} from "lucide-react";

import Autoplay from "embla-carousel-autoplay";
import Image from "next/image";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const services = [
  {
    title: "General Dentistry",
    icon: HeartPulse,
  },
  {
    title: "Cosmetic Dentistry",
    icon: Smile,
  },
  {
    title: "Dental Implants",
    icon: CircleDot,
  },
  {
    title: "Preventive Care",
    icon: Brush,
  },
  {
    title: "Orthodontics",
    icon: ScanLine,
  },
];

const slides = [
  {
    image: "/images/dental/dentist.jpg",
    eyebrow: "Your dentist",
    title: "Personalised care from people who listen.",
  },
  {
    image: "/images/dental/treatment.jpg",
    eyebrow: "Modern treatment",
    title: "Thoughtful care supported by modern technology.",
  },
  {
    image: "/images/dental/consultation.jpg",
    eyebrow: "Patient experience",
    title: "Every visit starts with understanding your needs.",
  },
  {
    image: "/images/dental/interior.jpg",
    eyebrow: "Our environment",
    title: "A comfortable experience from the moment you arrive.",
  },
];

export function Hero() {
  const autoplay = Autoplay({
    delay: 4500,
    stopOnInteraction: false,
    stopOnMouseEnter: true,
  });

  return (
    <section className="relative overflow-hidden bg-background">
      <div className="mx-auto max-w-7xl px-5 pb-8 pt-8 sm:pb-10 sm:pt-10 lg:px-8 lg:pb-12 lg:pt-12">
        {/* Hero */}
        <div className="grid items-center gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12">
          {/* Content */}
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary-light px-3.5 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-primary">
              <span
                className="h-1.5 w-1.5 rounded-full bg-primary"
                aria-hidden="true"
              />
              Modern dental care
            </div>

            <h1 className="mt-5 max-w-2xl text-4xl font-semibold leading-[1.08] tracking-tight text-foreground sm:text-5xl lg:text-[3.75rem]">
              Confident smiles start with{" "}
              <span className="text-primary">exceptional care.</span>
            </h1>

            <p className="mt-4 max-w-xl text-sm leading-6 text-muted sm:text-base">
              Personalised dental care in a calm, modern environment. From
              everyday dental health to advanced treatments, your comfort comes
              first.
            </p>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <a
                href="#contact"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-primary-dark hover:shadow-md"
              >
                Book an Appointment
                <ArrowRight className="h-4 w-4" />
              </a>

              <a
                href="#services"
                className="inline-flex items-center justify-center rounded-full border border-border bg-surface px-6 py-3.5 text-sm font-semibold text-foreground transition-colors hover:bg-surface-muted"
              >
                Explore Treatments
              </a>
            </div>

            {/* Trust points */}
            <div className="mt-6 flex flex-wrap gap-x-6 gap-y-3 border-t border-border pt-5 text-sm text-muted">
              <span className="flex items-center gap-2">
                <span className="text-accent" aria-hidden="true">
                  ✓
                </span>
                Personalised care
              </span>

              <span className="flex items-center gap-2">
                <span className="text-accent" aria-hidden="true">
                  ✓
                </span>
                Modern facilities
              </span>

              <span className="flex items-center gap-2">
                <span className="text-accent" aria-hidden="true">
                  ✓
                </span>
                Easy appointments
              </span>
            </div>
          </div>

          {/* Image Carousel */}
          <div className="relative lg:pl-4">
            <Carousel
              opts={{
                loop: true,
              }}
              plugins={[autoplay]}
              className="w-full"
            >
              <CarouselContent>
                {slides.map((slide) => (
                  <CarouselItem key={slide.image}>
                    <div className="relative overflow-hidden rounded-[2rem] bg-surface">
                      <div className="relative aspect-[5/4] overflow-hidden rounded-[2rem]">
                        <Image
                          src={slide.image}
                          alt={slide.title}
                          fill
                          priority={slide === slides[0]}
                          sizes="(max-width: 1024px) 100vw, 45vw"
                          className="object-cover transition-transform duration-700"
                        />

                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

                        {/* Top label */}
                        <div className="absolute left-5 right-5 top-5 flex items-center justify-between sm:left-6 sm:right-6 sm:top-6">
                          <span className="rounded-full border border-white/20 bg-black/20 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-white backdrop-blur-md">
                            {slide.eyebrow}
                          </span>

                          <span className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-black/20 text-white backdrop-blur-md">
                            ✦
                          </span>
                        </div>

                        {/* Caption */}
                        <div className="absolute bottom-5 left-5 right-5 sm:bottom-6 sm:left-6 sm:right-6">
                          <p className="max-w-sm font-serif text-xl leading-tight text-white sm:text-2xl">
                            {slide.title}
                          </p>
                        </div>
                      </div>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>

              {/* Controls */}
              <CarouselPrevious className="left-4 border-white/20 bg-black/30 text-white backdrop-blur-md hover:bg-black/50 hover:text-white" />

              <CarouselNext className="right-4 border-white/20 bg-black/30 text-white backdrop-blur-md hover:bg-black/50 hover:text-white" />
            </Carousel>
          </div>
        </div>

        {/* Services */}
        <div
          id="services"
          className="scroll-mt-24 mt-10 border-y border-border py-5 lg:mt-12"
        >
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center">
            {/* Label */}
            <div className="shrink-0 lg:w-44">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                Our services
              </p>

              <p className="mt-1 text-xs text-muted">
                Care for every stage of your smile.
              </p>
            </div>

            {/* Services */}
            <div className="grid flex-1 grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 lg:border-l lg:border-border">
              {services.map((service, index) => {
                const Icon = service.icon;

                return (
                  <a
                    key={service.title}
                    href="#contact"
                    className={`group flex items-center gap-3 px-3 py-3 transition-colors hover:text-primary sm:px-4 lg:border-r lg:border-border ${
                      index === services.length - 1 ? "lg:border-r-0" : ""
                    }`}
                  >
                    <Icon className="h-4 w-4 shrink-0 text-primary" />

                    <span className="text-xs font-semibold leading-5 text-foreground transition-colors group-hover:text-primary sm:text-[13px]">
                      {service.title}
                    </span>
                  </a>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
