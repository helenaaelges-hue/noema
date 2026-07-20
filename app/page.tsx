"use client";

import Link from 'next/link';
import { useEffect, useState } from "react";
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
    <main className="page-shell">
      <div className="mb-8">
        <h1 className="page-heading">Noema</h1>

        <p className="page-description">
          Track behaviors, emotions, habits, and triggers.
          Discover meaningful patterns in your daily life.
        </p>
      </div>

      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        <Link
            href="/events"
            className="surface-card-compact group"
        >
            <p className="font-semibold text-slate-900 group-hover:text-indigo-700">
                Record Event
            </p>

            <p className="mt-1 text-sm text-slate-600">
                Add a mood, habit, activity,
                or other observation.
            </p>
        </Link>

        <Link
            href="/events-list"
            className="surface-card-compact group"
        >
            <p className="font-semibold text-slate-900 group-hover:text-indigo-700">
                Event History
            </p>

            <p className="mt-1 text-sm text-slate-600">
                Review and edit your recorded
                timeline.
            </p>
        </Link>

        <Link
            href="/analytics"
            className="surface-card-compact group"
        >
            <p className="font-semibold text-slate-900 group-hover:text-indigo-700">
                Analytics
            </p>

            <p className="mt-1 text-sm text-slate-600">
                Explore trends and trigger
                associations.
            </p>
        </Link>
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

        <div className="mt-10">
          <div className="mb-4 flex items-center justify-between gap-4">
              <h2 className="section-heading">
                  Recent Events
              </h2>

              <Link
                  href="/events-list"
                  className="text-link text-sm"
              >
                  View all
              </Link>
          </div>

          <div className="space-y-3">
              {events.map(event => (
                  <article
                      key={event.id}
                      className="surface-card-compact"
                  >
                      <div className="flex flex-wrap items-start justify-between gap-3">
                          <div>
                              <p className="text-xs font-semibold uppercase tracking-wide text-indigo-600">
                                  {event.category}
                              </p>

                              <p className="mt-1 font-medium text-slate-900">
                                  {event.value}
                              </p>
                          </div>

                          <time className="text-sm text-slate-500">
                              {new Date(
                                  event.eventDate
                              ).toLocaleString(
                                  "de-DE"
                              )}
                          </time>
                      </div>
                  </article>
              ))}
          </div>
        </div>
      )}

    </main>
  );
}