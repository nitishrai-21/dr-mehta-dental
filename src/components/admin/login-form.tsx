"use client";

import { useActionState } from "react";
import { loginAdmin } from "@/app/actions/auth";

const initialState = {
  success: false,
  message: "",
};

export function LoginForm() {
  const [state, formAction, isPending] = useActionState(
    loginAdmin,
    initialState,
  );

  return (
    <form action={formAction} className="space-y-5">
      <div className="space-y-2">
        <label htmlFor="email" className="text-sm font-medium text-foreground">
          Email address
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          defaultValue="admin@drmehta-demo.local"
          className="h-11 w-full rounded-xl border border-border bg-surface px-3 text-sm text-foreground outline-none transition focus:border-primary"
          placeholder="admin@drmehta-demo.local"
          required
        />
      </div>

      <div className="space-y-2">
        <label
          htmlFor="password"
          className="text-sm font-medium text-foreground"
        >
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          className="h-11 w-full rounded-xl border border-border bg-surface px-3 text-sm text-foreground outline-none transition focus:border-primary"
          placeholder="Enter your password"
          required
        />
      </div>

      {state?.message ? (
        <div
          className={`rounded-xl border px-3 py-2 text-sm ${
            state.success
              ? "border-emerald-200 bg-emerald-50 text-emerald-700"
              : "border-red-200 bg-red-50 text-red-700"
          }`}
        >
          {state.message}
        </div>
      ) : null}

      <button
        type="submit"
        disabled={isPending}
        className="flex h-11 w-full items-center justify-center rounded-xl bg-primary px-4 text-sm font-semibold text-white transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isPending ? "Signing in..." : "Sign in to admin"}
      </button>
    </form>
  );
}
