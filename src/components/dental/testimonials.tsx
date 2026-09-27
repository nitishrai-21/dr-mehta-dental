"use client";

import { useState } from "react";
import { ArrowLeft, ArrowRight, Star } from "lucide-react";

const testimonials = [
  {
    quote:
      "The entire experience was comfortable from the first consultation. Dr. Mehta explained everything clearly and never made me feel rushed.",
    name: "Priya Sharma",
    detail: "Cosmetic Dentistry Patient",
  },
  {
    quote:
      "I had been putting off my dental treatment for years. The team made the process simple, professional, and surprisingly stress-free.",
    name: "Rahul Kapoor",
    detail: "General Dentistry Patient",
  },
  {
    quote:
      "The clinic is modern, welcoming, and the attention to detail is excellent. I finally feel confident about keeping up with regular checkups.",
    name: "Ananya Rao",
    detail: "Regular Patient",
  },
];

function Stars() {
  return (
    <div className="flex gap-1" aria-label="5 out of 5 stars">
      {Array.from({ length: 5 }).map((_, index) => (
        <Star
          key={index}
          className="h-4 w-4 fill-current text-amber-400"
          aria-hidden="true"
        />
      ))}
    </div>
  );
}

export function Testimonials() {
  const [activeIndex, setActiveIndex] = useState(0);

  const testimonial = testimonials[activeIndex];

  const previous = () => {
    setActiveIndex((current) =>
      current === 0 ? testimonials.length - 1 : current - 1,
    );
  };

  const next = () => {
    setActiveIndex((current) =>
      current === testimonials.length - 1 ? 0 : current + 1,
    );
  };

  return (
    <section id="reviews" className="bg-background py-8 sm:py-10 lg:py-12">
      <div className="mx-auto max-w-5xl px-5 lg:px-8">
        {/* Heading */}
        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
            Patient experiences
          </p>

          <h2 className="mx-auto mt-2 max-w-2xl text-3xl font-semibold leading-tight sm:text-4xl">
            What our patients have to say.
          </h2>

          <div className="mt-4 flex items-center justify-center gap-3">
            <Stars />

            <span className="text-sm text-muted">4.9 average rating</span>
          </div>
        </div>

        {/* Carousel */}
        <div className="mt-8">
          <div className="relative overflow-hidden rounded-[2rem] bg-primary px-6 py-9 text-white sm:px-10 sm:py-11 lg:px-16 lg:py-12">
            {/* Quote mark */}
            <div
              aria-hidden="true"
              className="absolute left-6 top-3 font-serif text-[90px] leading-none text-white/10 sm:left-10"
            >
              “
            </div>

            <div className="relative mx-auto max-w-3xl text-center">
              <Stars />

              <blockquote
                key={activeIndex}
                className="mt-6 font-serif text-xl leading-8 sm:text-2xl sm:leading-9"
              >
                “{testimonial.quote}”
              </blockquote>

              <div className="mt-7">
                <p className="text-sm font-semibold">{testimonial.name}</p>

                <p className="mt-1 text-xs text-white/60">
                  {testimonial.detail}
                </p>
              </div>
            </div>

            {/* Navigation */}
            <div className="relative mt-8 flex items-center justify-between">
              <button
                type="button"
                onClick={previous}
                aria-label="Previous testimonial"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 text-white transition-colors hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/50"
              >
                <ArrowLeft className="h-4 w-4" />
              </button>

              <span className="text-xs font-medium tracking-[0.15em] text-white/50">
                {String(activeIndex + 1).padStart(2, "0")} /{" "}
                {String(testimonials.length).padStart(2, "0")}
              </span>

              <button
                type="button"
                onClick={next}
                aria-label="Next testimonial"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 text-white transition-colors hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/50"
              >
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Progress */}
          <div className="mt-4 flex justify-center gap-2">
            {testimonials.map((testimonialItem, index) => (
              <button
                key={testimonialItem.name}
                type="button"
                onClick={() => setActiveIndex(index)}
                aria-label={`Show testimonial ${index + 1}`}
                aria-current={index === activeIndex}
                className={`h-1.5 rounded-full transition-all ${
                  index === activeIndex
                    ? "w-8 bg-primary"
                    : "w-2 bg-border hover:bg-primary/40"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Demo notice */}
        <p className="mt-5 text-center text-[11px] text-muted">
          Demo testimonials and rating for this portfolio project. Replace with
          verified patient reviews before using for a real clinic.
        </p>
      </div>
    </section>
  );
}
