"use client";

import Link from 'next/link';
import { useEffect, useState } from "react";
import LogoutButton from "@/src/components/auth/LogoutButton";

export default function Home() {

  const [events, setEvents] = useState<any[]>([]);

  useEffect(() => {
    async function loadEvents() {

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
          console.error(
            "Unexpected /api/events response:",
            data
          );

          throw new Error(
            "Events API returned an invalid response."
          );
        }

        setEvents(data.slice(0, 5));
      } catch (error) {
        console.error(
          "Could not load events:",
          error
        );

        setEvents([]);
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

    </main>
  );
}