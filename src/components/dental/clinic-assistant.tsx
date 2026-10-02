"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { LoaderCircle, MessageCircle, Send, X } from "lucide-react";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

const suggestedQuestions = [
  "What should I expect on my first visit?",
  "What services do you offer?",
  "How do I request an appointment?",
];

export function ClinicAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const endOfMessagesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) inputRef.current?.focus();
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [isOpen, messages, isPending, error]);

  async function ask(question = input) {
    const content = question.trim();

    if (!content || isPending) return;

    const nextMessages = [
      ...messages,
      { role: "user" as const, content },
    ].slice(-8);
    setMessages(nextMessages);
    setInput("");
    setError(null);
    setIsPending(true);

    try {
      const response = await fetch("/api/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: nextMessages }),
      });
      const result = (await response.json()) as { reply?: string };

      if (!response.ok || !result.reply) {
        throw new Error("Assistant request failed");
      }

      setMessages((current) => [
        ...current,
        { role: "assistant", content: result.reply! },
      ]);
    } catch {
      setError(
        "I can't reach the assistant right now. Please call +91 80 1234 5678 for help.",
      );
    } finally {
      setIsPending(false);
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void ask();
  }

  return (
    <div className="fixed bottom-5 right-4 z-[60] sm:bottom-6 sm:right-6">
      {isOpen && (
        <section
          id="clinic-assistant-panel"
          aria-label="Dr. Mehta Dental assistant"
          className="mb-3 flex max-h-[min(70dvh,34rem)] w-[calc(100vw-2rem)] max-w-sm flex-col overflow-hidden rounded-xl border border-border bg-background shadow-[0_18px_60px_rgba(23,37,43,0.18)]"
        >
          <header className="flex items-start justify-between gap-4 border-b border-border bg-surface px-4 py-3.5">
            <div>
              <p className="font-serif text-lg font-semibold text-foreground">
                Dr. Mehta Dental
              </p>
              <p className="mt-0.5 text-xs text-muted">
                Clinic information assistant
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              aria-label="Close assistant"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md text-muted transition-colors hover:bg-surface-muted hover:text-foreground"
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          </header>

          <div
            className="min-h-36 flex-1 space-y-3 overflow-y-auto px-4 py-4"
            aria-live="polite"
            aria-relevant="additions text"
          >
            {messages.length === 0 && (
              <>
                <p className="max-w-[19rem] rounded-lg bg-primary-light px-3.5 py-3 text-sm leading-5 text-primary-dark">
                  Hello. I can help with clinic details and appointment
                  requests.
                </p>
                <div className="flex flex-col items-start gap-2 pt-1">
                  {suggestedQuestions.map((question) => (
                    <button
                      key={question}
                      type="button"
                      onClick={() => void ask(question)}
                      disabled={isPending}
                      className="rounded-md border border-border bg-surface px-3 py-2 text-left text-xs leading-4 text-foreground transition-colors hover:border-primary/40 hover:bg-surface-muted disabled:opacity-50"
                    >
                      {question}
                    </button>
                  ))}
                </div>
              </>
            )}

            {messages.map((message, index) => (
              <p
                key={`${message.role}-${index}`}
                className={`max-w-[88%] whitespace-pre-wrap rounded-lg px-3.5 py-2.5 text-sm leading-5 ${
                  message.role === "user"
                    ? "ml-auto bg-primary text-white"
                    : "bg-primary-light text-primary-dark"
                }`}
              >
                {message.content}
              </p>
            ))}

            {isPending && (
              <p className="flex items-center gap-2 text-xs text-muted">
                <LoaderCircle
                  className="h-4 w-4 animate-spin"
                  aria-hidden="true"
                />
                Preparing a reply...
              </p>
            )}

            {error && (
              <p role="alert" className="text-xs leading-5 text-red-700">
                {error}
              </p>
            )}
            <div ref={endOfMessagesRef} />
          </div>

          <div className="border-t border-border bg-surface px-4 py-3">
            <p className="mb-2 text-[11px] leading-4 text-muted">
              AI replies may be inaccurate. Messages are processed by an
              external AI service. Don&apos;t share personal or medical details;
              this is not medical advice.
            </p>
            <form onSubmit={handleSubmit} className="flex items-center gap-2">
              <input
                ref={inputRef}
                value={input}
                onChange={(event) => setInput(event.target.value)}
                maxLength={800}
                placeholder="Ask about the clinic"
                aria-label="Your question"
                className="h-10 min-w-0 flex-1 rounded-md border border-border bg-background px-3 text-sm outline-none placeholder:text-muted/70 focus:border-primary focus:ring-2 focus:ring-primary/10"
              />
              <button
                type="submit"
                aria-label="Send message"
                title="Send message"
                disabled={isPending || !input.trim()}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-primary text-white transition-colors hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Send className="h-4 w-4" aria-hidden="true" />
              </button>
            </form>
          </div>
        </section>
      )}

      <button
        type="button"
        aria-expanded={isOpen}
        aria-controls="clinic-assistant-panel"
        aria-label={
          isOpen ? "Close clinic assistant" : "Ask the clinic assistant"
        }
        onClick={() => setIsOpen((open) => !open)}
        className="ml-auto flex h-12 items-center justify-center gap-2 rounded-full bg-primary px-4 text-sm font-semibold text-white shadow-lg transition-colors hover:bg-primary-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
      >
        {isOpen ? (
          <X className="h-4 w-4" aria-hidden="true" />
        ) : (
          <MessageCircle className="h-4 w-4" aria-hidden="true" />
        )}
        <span>{isOpen ? "Close" : "Ask the clinic"}</span>
      </button>
    </div>
  );
}
