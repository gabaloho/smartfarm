"use client";

import { FormEvent, useState } from "react";

export default function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    setSuccess(null);
    setError(null);

    const response = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, subject, message }),
    });

    const data = (await response.json().catch(() => ({}))) as {
      message?: string;
      error?: string;
      details?: Record<string, string[] | undefined>;
    };

    setIsLoading(false);

    if (!response.ok) {
      const firstFieldError = data.details
        ? Object.values(data.details).find((messages) => Array.isArray(messages) && messages.length > 0)?.[0]
        : null;
      setError(firstFieldError ?? data.error ?? "Unable to send message.");
      return;
    }

    setSuccess(data.message ?? "Message sent successfully.");
    setName("");
    setEmail("");
    setSubject("");
    setMessage("");
  }

  return (
    <form className="mt-5 grid sm:grid-cols-2 gap-4" onSubmit={onSubmit}>
      <label className="text-sm text-gray-700">
        Name
        <input
          type="text"
          className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-emerald-600"
          placeholder="Your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </label>
      <label className="text-sm text-gray-700">
        Email
        <input
          type="email"
          className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-emerald-600"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </label>
      <label className="text-sm text-gray-700 sm:col-span-2">
        Subject
        <input
          type="text"
          className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-emerald-600"
          placeholder="How can we help?"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          required
        />
      </label>
      <label className="text-sm text-gray-700 sm:col-span-2">
        Message
        <textarea
          rows={5}
          className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-emerald-600"
          placeholder="Write your message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
        />
      </label>
      {error && <p className="sm:col-span-2 text-sm text-red-600">{error}</p>}
      {success && <p className="sm:col-span-2 text-sm text-green-700">{success}</p>}
      <div className="sm:col-span-2">
        <button
          type="submit"
          disabled={isLoading}
          className="rounded-xl bg-emerald-700 px-5 py-3 text-sm font-semibold text-white hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isLoading ? "Sending..." : "Submit Message"}
        </button>
      </div>
    </form>
  );
}
