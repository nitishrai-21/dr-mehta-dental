"use client";

import { useState } from "react";
import { ChevronDown, Clock3, Loader2, MapPin, Phone } from "lucide-react";
import { createAppointment } from "@/app/actions/appointments";

const faqs = [
  {
    question: "What should I expect during my first visit?",
    answer:
      "Your first visit includes a conversation about your dental concerns, a thorough examination, and recommendations based on your individual needs.",
  },
  {
    question: "How often should I visit the dentist?",
    answer:
      "For most patients, a routine dental checkup every six months is a good starting point. Your dentist may recommend a different schedule depending on your oral health.",
  },
  {
    question: "Do you accept new patients?",
    answer:
      "Yes. New patients are welcome. You can use the appointment form or contact the clinic directly to arrange your first visit.",
  },
  {
    question: "Do you offer emergency appointments?",
    answer:
      "We do our best to accommodate urgent dental concerns. Please call the clinic directly if you are experiencing significant pain, swelling, or another dental emergency.",
  },
];

export function AppointmentSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [isPending, setIsPending] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setIsPending(true);
    setMessage(null);

    const form = event.currentTarget;
    const formData = new FormData(form);

    const data = {
      name: String(formData.get("name") ?? ""),
      phone: String(formData.get("phone") ?? ""),
      email: String(formData.get("email") ?? ""),
      date: String(formData.get("date") ?? ""),
      time: String(formData.get("time") ?? "") as
        | "morning"
        | "afternoon"
        | "evening",
      service: String(formData.get("service") ?? ""),
      patient: String(formData.get("patient") ?? "") as "new" | "existing",
      message: String(formData.get("message") ?? ""),
    };

    try {
      const result = await createAppointment(data);

      if (!result.success) {
        setMessage({
          type: "error",
          text: result.message,
        });
        return;
      }

      setMessage({
        type: "success",
        text: result.message,
      });

      form.reset();
    } catch {
      setMessage({
        type: "error",
        text: "Something went wrong. Please try again or call the clinic directly.",
      });
    } finally {
      setIsPending(false);
    }
  }

  return (
    <section
      id="contact"
      className="border-t border-border bg-surface-muted py-6 sm:py-8 lg:py-10"
    >
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-14">
          {/* Appointment */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
              Book an appointment
            </p>

            <h2 className="mt-2.5 max-w-lg text-3xl font-semibold leading-tight sm:text-4xl">
              Ready to take care of your smile?
            </h2>

            <p className="mt-4 max-w-md text-sm leading-6 text-muted">
              Tell us a little about what you need and our team will get back to
              you to confirm a convenient appointment time.
            </p>

            {/* Form */}
            <form className="mt-7 space-y-4" onSubmit={handleSubmit}>
              {/* Name + Phone */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="name"
                    className="mb-1.5 block text-xs font-medium text-foreground"
                  >
                    Full name
                  </label>

                  <input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="Your full name"
                    required
                    disabled={isPending}
                    className="h-11 w-full rounded-xl border border-border bg-background px-3.5 text-sm outline-none transition-colors placeholder:text-muted/70 focus:border-primary focus:ring-2 focus:ring-primary/10 disabled:cursor-not-allowed disabled:opacity-60"
                  />
                </div>

                <div>
                  <label
                    htmlFor="phone"
                    className="mb-1.5 block text-xs font-medium text-foreground"
                  >
                    Phone number
                  </label>

                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    placeholder="+91 98765 43210"
                    required
                    disabled={isPending}
                    className="h-11 w-full rounded-xl border border-border bg-background px-3.5 text-sm outline-none transition-colors placeholder:text-muted/70 focus:border-primary focus:ring-2 focus:ring-primary/10 disabled:cursor-not-allowed disabled:opacity-60"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="mb-1.5 block text-xs font-medium text-foreground"
                >
                  Email address
                </label>

                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  required
                  disabled={isPending}
                  className="h-11 w-full rounded-xl border border-border bg-background px-3.5 text-sm outline-none transition-colors placeholder:text-muted/70 focus:border-primary focus:ring-2 focus:ring-primary/10 disabled:cursor-not-allowed disabled:opacity-60"
                />
              </div>

              {/* Date + Time */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="date"
                    className="mb-1.5 block text-xs font-medium text-foreground"
                  >
                    Preferred date
                  </label>

                  <input
                    id="date"
                    name="date"
                    type="date"
                    required
                    disabled={isPending}
                    min={new Date().toISOString().split("T")[0]}
                    className="h-11 w-full rounded-xl border border-border bg-background px-3.5 text-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/10 disabled:cursor-not-allowed disabled:opacity-60"
                  />
                </div>

                <div>
                  <label
                    htmlFor="time"
                    className="mb-1.5 block text-xs font-medium text-foreground"
                  >
                    Preferred time
                  </label>

                  <select
                    id="time"
                    name="time"
                    defaultValue=""
                    required
                    disabled={isPending}
                    className="h-11 w-full rounded-xl border border-border bg-background px-3.5 text-sm text-foreground outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/10 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <option value="" disabled>
                      Select a time
                    </option>
                    <option value="morning">Morning</option>
                    <option value="afternoon">Afternoon</option>
                    <option value="evening">Evening</option>
                  </select>
                </div>
              </div>

              {/* Service + Patient status */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="service"
                    className="mb-1.5 block text-xs font-medium text-foreground"
                  >
                    Treatment needed
                  </label>

                  <select
                    id="service"
                    name="service"
                    defaultValue=""
                    required
                    disabled={isPending}
                    className="h-11 w-full rounded-xl border border-border bg-background px-3.5 text-sm text-foreground outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/10 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <option value="" disabled>
                      Select a treatment
                    </option>
                    <option value="general">General Dentistry</option>
                    <option value="cosmetic">Cosmetic Dentistry</option>
                    <option value="implants">Dental Implants</option>
                    <option value="preventive">Preventive Care</option>
                    <option value="orthodontics">Orthodontics</option>
                    <option value="emergency">Emergency</option>
                    <option value="other">Not sure</option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="patient"
                    className="mb-1.5 block text-xs font-medium text-foreground"
                  >
                    Patient status
                  </label>

                  <select
                    id="patient"
                    name="patient"
                    defaultValue=""
                    required
                    disabled={isPending}
                    className="h-11 w-full rounded-xl border border-border bg-background px-3.5 text-sm text-foreground outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/10 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <option value="" disabled>
                      Select one
                    </option>
                    <option value="new">New patient</option>
                    <option value="existing">Existing patient</option>
                  </select>
                </div>
              </div>

              {/* Message */}
              <div>
                <label
                  htmlFor="message"
                  className="mb-1.5 block text-xs font-medium text-foreground"
                >
                  How can we help?
                </label>

                <textarea
                  id="message"
                  name="message"
                  rows={3}
                  placeholder="Tell us briefly about your dental concern..."
                  disabled={isPending}
                  className="w-full resize-none rounded-xl border border-border bg-background px-3.5 py-3 text-sm outline-none transition-colors placeholder:text-muted/70 focus:border-primary focus:ring-2 focus:ring-primary/10 disabled:cursor-not-allowed disabled:opacity-60"
                />
              </div>

              {/* Server response */}
              {message && (
                <div
                  role="alert"
                  className={`rounded-xl border px-4 py-3 text-sm ${
                    message.type === "success"
                      ? "border-primary/20 bg-primary-light text-primary-dark"
                      : "border-red-200 bg-red-50 text-red-700"
                  }`}
                >
                  {message.text}
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={isPending}
                className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 text-sm font-semibold text-white transition-colors hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
              >
                {isPending && <Loader2 className="h-4 w-4 animate-spin" />}

                {isPending ? "Submitting request..." : "Request an appointment"}
              </button>
            </form>
          </div>

          {/* FAQ */}
          <div id="faq" className="lg:pt-8">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
              Frequently asked questions
            </p>

            <h2 className="mt-2.5 text-2xl font-semibold leading-tight sm:text-3xl">
              Have questions?
            </h2>

            <p className="mt-3 max-w-lg text-sm leading-6 text-muted">
              A few things patients commonly ask before their appointment.
            </p>

            <div className="mt-7 divide-y divide-border border-y border-border">
              {faqs.map((faq, index) => {
                const isOpen = openIndex === index;

                return (
                  <div key={faq.question}>
                    <button
                      type="button"
                      onClick={() => setOpenIndex(isOpen ? null : index)}
                      aria-expanded={isOpen}
                      className="flex w-full items-center justify-between gap-5 py-4.5 text-left"
                    >
                      <span className="text-sm font-semibold text-foreground sm:text-base">
                        {faq.question}
                      </span>

                      <ChevronDown
                        className={`h-4 w-4 shrink-0 text-muted transition-transform ${
                          isOpen ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    <div
                      className={`grid transition-all duration-200 ${
                        isOpen ? "grid-rows-[1fr] pb-4" : "grid-rows-[0fr]"
                      }`}
                    >
                      <div className="overflow-hidden">
                        <p className="max-w-xl pr-8 text-sm leading-6 text-muted">
                          {faq.answer}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Clinic contact details */}
            <div className="mt-6 border-t border-border pt-5">
              <div className="grid gap-4 sm:grid-cols-3">
                <a
                  href="tel:+918012345678"
                  className="flex items-start gap-2.5 text-sm text-muted transition-colors hover:text-foreground"
                >
                  <Phone className="mt-0.5 h-4 w-4 shrink-0 text-primary" />

                  <span>
                    <span className="block text-xs font-semibold text-foreground">
                      Call us
                    </span>
                    <span className="mt-0.5 block text-xs">
                      +91 80 1234 5678
                    </span>
                  </span>
                </a>

                <div className="flex items-start gap-2.5 text-sm text-muted">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />

                  <span>
                    <span className="block text-xs font-semibold text-foreground">
                      Visit us
                    </span>
                    <span className="mt-0.5 block text-xs">
                      Bengaluru, Karnataka
                    </span>
                  </span>
                </div>

                <div className="flex items-start gap-2.5 text-sm text-muted">
                  <Clock3 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />

                  <span>
                    <span className="block text-xs font-semibold text-foreground">
                      Opening hours
                    </span>
                    <span className="mt-0.5 block text-xs">
                      Mon – Sat, 9 AM – 7 PM
                    </span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
