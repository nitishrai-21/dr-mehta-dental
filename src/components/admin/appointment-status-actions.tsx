"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, CheckCircle2, Clock3, X } from "lucide-react";
import { updateAppointmentStatus } from "@/app/actions/appointments";

type AppointmentStatus = "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED";

type AppointmentStatusActionsProps = {
  appointmentId: string;
  status: AppointmentStatus;
};

export function AppointmentStatusActions({
  appointmentId,
  status,
}: AppointmentStatusActionsProps) {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);
  const [currentStatus, setCurrentStatus] = useState<AppointmentStatus>(status);
  const [notice, setNotice] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);
  const [confirmCancel, setConfirmCancel] = useState(false);

  async function submitStatus(nextStatus: AppointmentStatus) {
    if (isPending) {
      return;
    }

    setIsPending(true);
    setNotice(null);

    try {
      const result = await updateAppointmentStatus(appointmentId, nextStatus);

      if (!result.success) {
        setNotice({
          type: "error",
          message: result.message,
        });
        return;
      }

      setCurrentStatus(nextStatus);
      setNotice({
        type: "success",
        message: result.message,
      });
      router.refresh();
    } finally {
      setIsPending(false);
    }
  }

  if (currentStatus === "CANCELLED") {
    return (
      <div className="space-y-3">
        <button
          type="button"
          disabled
          className="inline-flex h-10 items-center gap-2 rounded-xl bg-slate-100 px-4 text-sm font-semibold text-slate-500"
        >
          <X className="h-4 w-4" />
          Cancelled
        </button>

        {notice && (
          <div
            className={`rounded-xl border px-3 py-2 text-sm ${
              notice.type === "success"
                ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                : "border-red-200 bg-red-50 text-red-700"
            }`}
          >
            {notice.message}
          </div>
        )}
      </div>
    );
  }

  if (currentStatus === "COMPLETED") {
    return (
      <div className="space-y-3">
        <button
          type="button"
          disabled
          className="inline-flex h-10 items-center gap-2 rounded-xl bg-slate-100 px-4 text-sm font-semibold text-slate-500"
        >
          <CheckCircle2 className="h-4 w-4" />
          Completed
        </button>

        {notice && (
          <div
            className={`rounded-xl border px-3 py-2 text-sm ${
              notice.type === "success"
                ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                : "border-red-200 bg-red-50 text-red-700"
            }`}
          >
            {notice.message}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {confirmCancel ? (
        <div className="rounded-xl border border-red-200 bg-red-50 p-3">
          <p className="text-sm font-medium text-red-700">
            Cancel this appointment?
          </p>

          <div className="mt-3 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setConfirmCancel(false)}
              className="inline-flex h-9 items-center rounded-lg border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700"
            >
              Keep appointment
            </button>

            <button
              type="button"
              disabled={isPending}
              onClick={() => {
                setConfirmCancel(false);
                void submitStatus("CANCELLED");
              }}
              className="inline-flex h-9 items-center rounded-lg bg-red-600 px-3 text-xs font-semibold text-white"
            >
              Confirm cancellation
            </button>
          </div>
        </div>
      ) : null}

      <div className="flex flex-wrap gap-2">
        {currentStatus === "PENDING" && (
          <button
            type="button"
            disabled={isPending}
            onClick={() => void submitStatus("CONFIRMED")}
            className="inline-flex h-10 items-center gap-2 rounded-xl bg-primary px-4 text-sm font-semibold text-white transition-colors hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Check className="h-4 w-4" />
            Confirm
          </button>
        )}

        {currentStatus === "CONFIRMED" && (
          <button
            type="button"
            disabled={isPending}
            onClick={() => void submitStatus("COMPLETED")}
            className="inline-flex h-10 items-center gap-2 rounded-xl bg-primary px-4 text-sm font-semibold text-white transition-colors hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-60"
          >
            <CheckCircle2 className="h-4 w-4" />
            Mark completed
          </button>
        )}

        {(currentStatus === "PENDING" || currentStatus === "CONFIRMED") && (
          <button
            type="button"
            disabled={isPending}
            onClick={() => setConfirmCancel(true)}
            className="inline-flex h-10 items-center gap-2 rounded-xl border border-red-200 bg-white px-4 text-sm font-semibold text-red-700 transition-colors hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <X className="h-4 w-4" />
            Cancel
          </button>
        )}

        {currentStatus === "PENDING" && (
          <button
            type="button"
            disabled={isPending}
            onClick={() => void submitStatus("COMPLETED")}
            className="inline-flex h-10 items-center gap-2 rounded-xl border border-border bg-surface px-4 text-sm font-semibold text-muted transition-colors hover:bg-surface-muted hover:text-foreground disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Clock3 className="h-4 w-4" />
            Complete
          </button>
        )}
      </div>

      {notice && (
        <div
          className={`rounded-xl border px-3 py-2 text-sm ${
            notice.type === "success"
              ? "border-emerald-200 bg-emerald-50 text-emerald-700"
              : "border-red-200 bg-red-50 text-red-700"
          }`}
        >
          {notice.message}
        </div>
      )}
    </div>
  );
}
