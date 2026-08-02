"use client";

import { useMemo, useState } from "react";

import { clinics, conditionGroups, contact } from "@/lib/site";
import { cn } from "@/lib/utils";

/**
 * A booking request that needs no backend.
 *
 * The form assembles a structured message and hands it to the visitor's own
 * mail client (or WhatsApp, if the clinic has a line configured). Nothing is
 * transmitted to this site, nothing is stored, and no third-party form
 * service ever sees a child's health details. That matters more here than
 * the convenience of a database would.
 *
 * WhatsApp options appear only when `contact.whatsappHref` is set, so an
 * unmonitored number can never be advertised by accident.
 */

type Field = {
  id: keyof FormState;
  label: string;
  type?: "text" | "tel" | "email" | "number";
  placeholder?: string;
  required?: boolean;
  half?: boolean;
};

type FormState = {
  childName: string;
  childAge: string;
  parentName: string;
  phone: string;
  email: string;
  concern: string;
  clinic: string;
  preferred: string;
  message: string;
};

const initial: FormState = {
  childName: "",
  childAge: "",
  parentName: "",
  phone: "",
  email: "",
  concern: "",
  clinic: clinics[0]?.name ?? "",
  preferred: "",
  message: "",
};

const fields: Field[] = [
  { id: "childName", label: "Child's name", required: true, half: true },
  { id: "childAge", label: "Child's age", placeholder: "e.g. 7 years", required: true, half: true },
  { id: "parentName", label: "Your name", required: true, half: true },
  { id: "phone", label: "Phone number", type: "tel", required: true, half: true },
  { id: "email", label: "Email (optional)", type: "email" },
  { id: "preferred", label: "Preferred day or time", placeholder: "e.g. weekday evenings" },
];

export function AppointmentForm() {
  const [form, setForm] = useState<FormState>(initial);
  const [touched, setTouched] = useState(false);

  const missing = useMemo(
    () =>
      fields
        .filter((f) => f.required && !form[f.id].trim())
        .map((f) => f.label)
        .concat(form.concern ? [] : ["Reason for the appointment"]),
    [form]
  );

  const valid = missing.length === 0;

  const summary = useMemo(
    () =>
      [
        "Appointment request",
        "",
        `Child: ${form.childName || "not given"} (${form.childAge || "age not given"})`,
        `Parent / guardian: ${form.parentName || "not given"}`,
        `Phone: ${form.phone || "not given"}`,
        form.email ? `Email: ${form.email}` : null,
        `Reason: ${form.concern || "not given"}`,
        `Preferred location: ${form.clinic}`,
        form.preferred ? `Preferred time: ${form.preferred}` : null,
        form.message ? "" : null,
        form.message ? `Notes: ${form.message}` : null,
      ]
        .filter((line) => line !== null)
        .join("\n"),
    [form]
  );

  function update(id: keyof FormState, value: string) {
    setForm((prev) => ({ ...prev, [id]: value }));
  }

  function send(channel: "whatsapp" | "email") {
    setTouched(true);
    if (!valid) return;

    if (channel === "whatsapp") {
      if (!contact.whatsappHref) return;
      window.open(`${contact.whatsappHref}?text=${encodeURIComponent(summary)}`, "_blank");
      return;
    }

    const subject = `Appointment request for ${form.childName}`;
    window.open(
      `${contact.emailHref}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(summary)}`,
      "_self"
    );
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        send("email");
      }}
      noValidate
      className="rounded-2xl border border-line bg-paper-raised p-7 sm:p-9"
    >
      <p className="label text-marigold">Request an appointment</p>
      <h2 className="font-display mt-4 text-2xl leading-tight sm:text-3xl">
        Tell us who is coming, and why.
      </h2>
      <p className="mt-4 max-w-lg text-[0.92rem] leading-relaxed text-ink-muted">
        This form does not send anything anywhere on its own. It composes a message and hands it
        to your own email app, so your child&rsquo;s details never pass through this website.
      </p>

      <div className="mt-8 grid gap-x-6 gap-y-5 sm:grid-cols-2">
        {fields.map((field) => (
          <div key={field.id} className={cn(field.half ? "sm:col-span-1" : "sm:col-span-2")}>
            <Label htmlFor={field.id} required={field.required}>
              {field.label}
            </Label>
            <input
              id={field.id}
              name={field.id}
              type={field.type ?? "text"}
              value={form[field.id]}
              placeholder={field.placeholder}
              onChange={(e) => update(field.id, e.target.value)}
              aria-required={field.required}
              aria-invalid={touched && field.required && !form[field.id].trim() ? true : undefined}
              className={inputClass}
            />
          </div>
        ))}

        <div className="sm:col-span-1">
          <Label htmlFor="concern" required>
            Reason for the appointment
          </Label>
          <select
            id="concern"
            name="concern"
            value={form.concern}
            onChange={(e) => update("concern", e.target.value)}
            aria-required
            aria-invalid={touched && !form.concern ? true : undefined}
            className={inputClass}
          >
            <option value="">Please choose…</option>
            {conditionGroups.map((group) => (
              <option key={group.id} value={group.title}>
                {group.title}
              </option>
            ))}
            <option value="Second opinion">Second opinion on an existing diagnosis</option>
            <option value="Not sure">Not sure, I will describe it below</option>
          </select>
        </div>

        <div className="sm:col-span-1">
          <Label htmlFor="clinic">Preferred location</Label>
          <select
            id="clinic"
            name="clinic"
            value={form.clinic}
            onChange={(e) => update("clinic", e.target.value)}
            className={inputClass}
          >
            {clinics.map((clinic) => (
              <option key={clinic.id} value={clinic.name}>
                {clinic.name}
              </option>
            ))}
            <option value="Video consultation">Video consultation</option>
          </select>
        </div>

        <div className="sm:col-span-2">
          <Label htmlFor="message">Anything else worth knowing</Label>
          <textarea
            id="message"
            name="message"
            rows={4}
            value={form.message}
            onChange={(e) => update("message", e.target.value)}
            placeholder="What you have noticed, how long it has been going on, and anything already investigated."
            className={cn(inputClass, "resize-y")}
          />
        </div>
      </div>

      {touched && !valid && (
        <p role="alert" className="mt-5 text-[0.85rem] text-marigold">
          Still needed: {missing.join(", ")}.
        </p>
      )}

      <div className="mt-8 flex flex-wrap gap-3">
        <button
          type="submit"
          className="inline-flex h-12 items-center justify-center rounded-full bg-ink px-6 text-[0.9375rem] font-medium text-paper transition-colors duration-300 hover:bg-marigold hover:text-white dark:hover:text-ink"
        >
          Send by email
        </button>

        {contact.whatsappHref && (
          <button
            type="button"
            onClick={() => send("whatsapp")}
            className="inline-flex h-12 items-center justify-center rounded-full border border-line px-6 text-[0.9375rem] text-ink transition-colors duration-300 hover:border-marigold hover:text-marigold"
          >
            Send on WhatsApp
          </button>
        )}

        <a
          href={contact.bookingUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex h-12 items-center justify-center rounded-full border border-line px-6 text-[0.9375rem] text-ink transition-colors duration-300 hover:border-marigold hover:text-marigold"
        >
          Book on the hospital site
        </a>
      </div>

      <p className="mt-6 text-xs leading-relaxed text-ink-faint">
        Requests are answered during working hours. This is not a channel for emergencies. If your
        child is seriously unwell, go to the nearest emergency department.
      </p>
    </form>
  );
}

const inputClass =
  "mt-2 w-full rounded-lg border border-line bg-paper px-3.5 py-2.5 text-[0.95rem] text-ink transition-colors placeholder:text-ink-faint focus:border-marigold focus:outline-none aria-invalid:border-marigold";

function Label({
  htmlFor,
  required,
  children,
}: {
  htmlFor: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label htmlFor={htmlFor} className="label block">
      {children}
      {required && (
        <span aria-hidden="true" className="ml-1 text-marigold">
          *
        </span>
      )}
    </label>
  );
}
