"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AlertTriangle, Check, CheckCircle2, Clock3, X } from "lucide-react";
import { updateAppointmentStatus } from "@/app/actions/appointments";

type AppointmentStatus = "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED";

type AppointmentStatusActionsProps = {
  appointmentId: string;
  status: AppointmentStatus;
};

const statusLabels: Record<AppointmentStatus, string> = {
  PENDING: "Pending",
  CONFIRMED: "Confirmed",
  CANCELLED: "Cancelled",
  COMPLETED: "Completed",
};

const statusDescriptions: Record<AppointmentStatus, string> = {
  PENDING: "The appointment will be moved back to pending.",
  CONFIRMED:
    "The appointment will be marked as confirmed and ready for the scheduled visit.",
  CANCELLED: "The appointment will be cancelled and cannot be restored.",
  COMPLETED:
    "The appointment will be marked as completed and this action cannot be undone.",
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

  const [pendingStatus, setPendingStatus] = useState<AppointmentStatus | null>(
    null,
  );

  function requestStatusChange(nextStatus: AppointmentStatus) {
    if (isPending || nextStatus === currentStatus) {
      return;
    }

    setNotice(null);
    setPendingStatus(nextStatus);
  }

  function closeConfirmation() {
    if (isPending) {
      return;
    }

    setPendingStatus(null);
  }

  async function submitStatus() {
    if (!pendingStatus || isPending) {
      return;
    }

    const nextStatus = pendingStatus;

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
      setPendingStatus(null);

      setNotice({
        type: "success",
        message: result.message,
      });

      router.refresh();
    } catch {
      setNotice({
        type: "error",
        message: "Unable to update the appointment status.",
      });
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

        {notice && <StatusNotice notice={notice} />}
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

        {notice && <StatusNotice notice={notice} />}
      </div>
    );
  }

  return (
    <>
      <div className="space-y-3">
        <div className="flex flex-wrap gap-2">
          {currentStatus === "PENDING" && (
            <button
              type="button"
              disabled={isPending}
              onClick={() => requestStatusChange("CONFIRMED")}
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
              onClick={() => requestStatusChange("COMPLETED")}
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
              onClick={() => requestStatusChange("CANCELLED")}
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
              onClick={() => requestStatusChange("COMPLETED")}
              className="inline-flex h-10 items-center gap-2 rounded-xl border border-border bg-surface px-4 text-sm font-semibold text-muted transition-colors hover:bg-surface-muted hover:text-foreground disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Clock3 className="h-4 w-4" />
              Complete
            </button>
          )}
        </div>

        {notice && <StatusNotice notice={notice} />}
      </div>

      {pendingStatus && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              closeConfirmation();
            }
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="status-confirmation-title"
            aria-describedby="status-confirmation-description"
            className="w-full max-w-md overflow-hidden rounded-2xl border border-border bg-surface shadow-2xl"
          >
            <div className="p-6">
              <div className="flex items-start gap-4">
                <div
                  className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
                    pendingStatus === "CANCELLED"
                      ? "bg-red-100 text-red-600"
                      : "bg-primary-light text-primary"
                  }`}
                >
                  {pendingStatus === "CANCELLED" ? (
                    <AlertTriangle className="h-5 w-5" />
                  ) : (
                    <CheckCircle2 className="h-5 w-5" />
                  )}
                </div>

                <div className="min-w-0">
                  <h3
                    id="status-confirmation-title"
                    className="text-lg font-semibold text-foreground"
                  >
                    {pendingStatus === "CANCELLED"
                      ? "Cancel appointment?"
                      : `Change appointment to ${statusLabels[pendingStatus]}?`}
                  </h3>

                  <p
                    id="status-confirmation-description"
                    className="mt-1.5 text-sm leading-5 text-muted"
                  >
                    {statusDescriptions[pendingStatus]}
                  </p>
                </div>
              </div>

              <div className="mt-5 rounded-xl border border-border bg-surface-muted p-4">
                <div className="flex items-center justify-between gap-4 text-sm">
                  <span className="text-muted">Current status</span>

                  <span className="font-semibold text-foreground">
                    {statusLabels[currentStatus]}
                  </span>
                </div>

                <div className="my-3 border-t border-border" />

                <div className="flex items-center justify-between gap-4 text-sm">
                  <span className="text-muted">New status</span>

                  <span
                    className={`font-semibold ${
                      pendingStatus === "CANCELLED"
                        ? "text-red-600"
                        : "text-primary"
                    }`}
                  >
                    {statusLabels[pendingStatus]}
                  </span>
                </div>
              </div>

              <div className="mt-4 flex items-start gap-2.5 rounded-xl border border-amber-200 bg-amber-50 p-3">
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />

                <p className="text-xs leading-5 text-amber-800">
                  Please review this action carefully.{" "}
                  <span className="font-semibold">
                    This status change cannot be undone.
                  </span>
                </p>
              </div>
            </div>

            <div className="flex flex-col-reverse gap-2 border-t border-border bg-surface-muted p-4 sm:flex-row sm:justify-end">
              <button
                type="button"
                disabled={isPending}
                onClick={closeConfirmation}
                className="inline-flex h-10 items-center justify-center rounded-xl border border-border bg-surface px-4 text-sm font-semibold text-foreground transition-colors hover:bg-surface-muted disabled:cursor-not-allowed disabled:opacity-60"
              >
                Go back
              </button>

              <button
                type="button"
                disabled={isPending}
                onClick={() => void submitStatus()}
                className={`inline-flex h-10 items-center justify-center gap-2 rounded-xl px-4 text-sm font-semibold text-white transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${
                  pendingStatus === "CANCELLED"
                    ? "bg-red-600 hover:bg-red-700"
                    : "bg-primary hover:bg-primary-dark"
                }`}
              >
                {isPending ? (
                  "Updating..."
                ) : pendingStatus === "CANCELLED" ? (
                  <>
                    <X className="h-4 w-4" />
                    Confirm cancellation
                  </>
                ) : (
                  <>
                    <Check className="h-4 w-4" />
                    Confirm change
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function StatusNotice({
  notice,
}: {
  notice: {
    type: "success" | "error";
    message: string;
  };
}) {
  return (
    <div
      className={`rounded-xl border px-3 py-2 text-sm ${
        notice.type === "success"
          ? "border-emerald-200 bg-emerald-50 text-emerald-700"
          : "border-red-200 bg-red-50 text-red-700"
      }`}
    >
      {notice.message}
    </div>
  );
}
