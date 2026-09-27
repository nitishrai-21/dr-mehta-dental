"use client";

import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { createPrescription } from "@/app/actions/prescriptions";

type MedicationItem = {
  medication: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions: string;
};

const emptyItem: MedicationItem = {
  medication: "",
  dosage: "",
  frequency: "",
  duration: "",
  instructions: "",
};

export function PrescriptionForm({
  appointmentId,
  patientName,
  treatment,
}: {
  appointmentId: string;
  patientName: string;
  treatment: string;
}) {
  const router = useRouter();

  const [items, setItems] = useState<MedicationItem[]>([{ ...emptyItem }]);

  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState("");

  function updateItem(
    index: number,
    field: keyof MedicationItem,
    value: string,
  ) {
    setItems((current) =>
      current.map((item, itemIndex) =>
        itemIndex === index
          ? {
              ...item,
              [field]: value,
            }
          : item,
      ),
    );
  }

  function addItem() {
    setItems((current) => [...current, { ...emptyItem }]);
  }

  function removeItem(index: number) {
    setItems((current) =>
      current.length === 1
        ? current
        : current.filter((_, itemIndex) => itemIndex !== index),
    );
  }

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setIsPending(true);
    setError("");

    const result = await createPrescription(
      appointmentId,
      items.map((item) => ({
        ...item,
        instructions: item.instructions || undefined,
      })),
    );

    if (!result.success) {
      setError(result.message);
      setIsPending(false);
      return;
    }

    router.push(`/admin/prescriptions/${result.id}`);
    router.refresh();
  }

  return (
    <form onSubmit={submit} className="space-y-6">
      <div className="rounded-2xl border border-border bg-surface p-5">
        <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted">
          Patient
        </p>

        <p className="mt-1 text-base font-semibold">{patientName}</p>

        <p className="mt-1 text-xs text-muted">{treatment}</p>
      </div>

      <div className="space-y-4">
        {items.map((item, index) => (
          <section
            key={index}
            className="rounded-2xl border border-border bg-surface p-5"
          >
            <div className="mb-5 flex items-center justify-between">
              <h3 className="text-sm font-semibold">Medication {index + 1}</h3>

              {items.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeItem(index)}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Remove
                </button>
              )}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="mb-1.5 block text-xs font-medium">
                  Medication
                </label>

                <input
                  value={item.medication}
                  onChange={(event) =>
                    updateItem(index, "medication", event.target.value)
                  }
                  placeholder="e.g. Amoxicillin"
                  required
                  className="h-11 w-full rounded-xl border border-border bg-background px-3.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-medium">
                  Dosage
                </label>

                <input
                  value={item.dosage}
                  onChange={(event) =>
                    updateItem(index, "dosage", event.target.value)
                  }
                  placeholder="e.g. 500 mg"
                  required
                  className="h-11 w-full rounded-xl border border-border bg-background px-3.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-medium">
                  Frequency
                </label>

                <input
                  value={item.frequency}
                  onChange={(event) =>
                    updateItem(index, "frequency", event.target.value)
                  }
                  placeholder="e.g. 3 times daily"
                  required
                  className="h-11 w-full rounded-xl border border-border bg-background px-3.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-medium">
                  Duration
                </label>

                <input
                  value={item.duration}
                  onChange={(event) =>
                    updateItem(index, "duration", event.target.value)
                  }
                  placeholder="e.g. 5 days"
                  required
                  className="h-11 w-full rounded-xl border border-border bg-background px-3.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-medium">
                  Instructions
                </label>

                <input
                  value={item.instructions}
                  onChange={(event) =>
                    updateItem(index, "instructions", event.target.value)
                  }
                  placeholder="e.g. After food"
                  className="h-11 w-full rounded-xl border border-border bg-background px-3.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
                />
              </div>
            </div>
          </section>
        ))}
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="button"
          onClick={addItem}
          className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-border bg-surface px-4 text-sm font-semibold text-foreground hover:bg-surface-muted"
        >
          <Plus className="h-4 w-4" />
          Add medication
        </button>

        <button
          type="submit"
          disabled={isPending}
          className="inline-flex h-11 items-center justify-center rounded-xl bg-primary px-5 text-sm font-semibold text-white transition-colors hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isPending ? "Creating prescription..." : "Create prescription"}
        </button>
      </div>
    </form>
  );
}
