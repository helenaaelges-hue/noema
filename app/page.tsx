"use client";

import Link from 'next/link';
import { useEffect, useState } from "react";
import LogoutButton from "@/src/components/auth/LogoutButton";
import {EmptyState, ErrorState, LoadingState} from "@/src/components/ui/PageState";

export default function Home() {

  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadEvents() {
      setLoading(true);
      setError("");

      try {
        const response =
          await fetch("/api/events");

        const data: unknown =
          await response.json();

        if (!response.ok) {
          const message =
            data &&
            typeof data === "object" &&
            "error" in data &&
            typeof data.error === "string"
              ? data.error
              : "Failed to load events.";

          throw new Error(message);
        }

        if (!Array.isArray(data)) {
          throw new Error(
            "The events API returned an invalid response.",
          );
        }

        setEvents(data.slice(0, 5));
      } catch (loadError) {
          setEvents([]);

          setError(
            loadError instanceof Error
              ? loadError.message
              : "Failed to load events."
          );
      } finally {
        setLoading(false);
      }
    }

    loadEvents();
  }, []);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8">
      <h1 className="text-5xl font-bold mb-4">Noema</h1>

      <p className="text-xl text-center max-w-xl mb-8">
        Track behaviors, emotions, habits, and triggers.
        Discover meaningful patterns in your daily life.
      </p>

      <div className="flex gap-4">
        <Link
          href="/events"
          className="border px-4 py-2 rounded"
        >
          Event Entry 
        </Link>

        <Link
          href="/events-list"
          className="border px-4 py-2 rounded"
        >
          Event History
        </Link>

        <Link
          href="/analytics"
          className="border px-4 py-2 rounded"
        >
          Analytics
        </Link>

        <LogoutButton />
      </div>

      {loading ? (
        <LoadingState message="Loading recent events..." />
      ) : error ? (
        <ErrorState message={error} />
      ) : events.length === 0 ? (
        <EmptyState
          title="No events yet"
          description="Record your first event to start building your personal timeline."
          actionHref="/events"
          actionLabel="Record an event"
        />
      ) : (

        <div className="mt-12">
          <h2 className="text-2xl font-semibold mb-4">
            Recent Events
          </h2>

          {events.map((event) => (

            <div
              key={event.id}
              className="border rounded p-3 mb-2"
            >

              <strong>
                {event.category}
              </strong>

              <p>
                {event.value}
              </p>

              <small>
                {new Date(
                  event.eventDate
                ).toLocaleString()}
              </small>
            </div>
          ))}
        </div>
      )}

    </main>
  );
}