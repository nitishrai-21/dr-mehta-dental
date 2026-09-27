import { redirect } from "next/navigation";
import { LoginForm } from "@/components/admin/login-form";
import { getCurrentAdmin } from "@/lib/auth";

export default async function AdminLoginPage() {
  const admin = await getCurrentAdmin();

  if (admin) {
    redirect("/admin");
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-surface-muted px-4 py-12">
      <div className="w-full max-w-md rounded-2xl border border-border bg-surface p-6 shadow-sm sm:p-8">
        <div className="mb-6 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
            Admin access
          </p>
          <h1 className="mt-3 text-3xl font-semibold text-foreground">
            Welcome back
          </h1>
          <p className="mt-2 text-sm text-muted">
            Sign in to review appointments, patients and prescriptions.
          </p>
        </div>

        <LoginForm />
      </div>
    </main>
  );
}
