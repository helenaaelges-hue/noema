"use client";

import {useEffect, useState} from "react";
import Link from "next/link";
import {EmptyState, ErrorState, LoadingState} from "@/src/components/ui/PageState";

type Event = {
    id: number;
    category: string;
    value: string;
    moodScore: number | null;
    triggers: {
        trigger: {
            id: number;
            name: string;
        };
    }[];
    notes: string | null;
    eventDate: string;
    createdAt: string;
};

export default function EventsListPage() {
    const [events, setEvents] = useState<Event[]>([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        async function loadEvents() {
            setLoading(true);
            setError("");

            try {
                const response =
                    await fetch("/api/events");

                const text =
                    await response.text();

                let data: unknown = null;

                if (text) {
                    try {
                        data =
                            JSON.parse(text);
                    } catch {
                        throw new Error(
                            "The events API returned invalid JSON."
                        );
                    }
                }

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
                        "The events API returned an invalid response."
                    );
                }

                setEvents(data);
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

    async function deleteEvent(id: number) {
        const confirmed = confirm(
            "Are you sure you want to delete this event?"
        );

        if (!confirmed) return;

        const response = await fetch(
            `/api/events/${id}`,
            {
                method: "DELETE",
            }
        );

        if (response.ok) {
            setEvents(
                events.filter(
                    (event) => event.id !== id
                )
            );
        }
    }

    if (loading) {
        return (
            <main className="p-8 max-w-4xl mx-auto">
                <p>Loading events...</p>
            </main>
        );
    }

    if (error) {
        return (
            <main className="p-8 max-w-4xl mx-auto">
                <p
                    role="alert"
                    className="text-red-700"
                >
                    {error}
                </p>
            </main>
        );
    }

    if (loading) {
        return (
            <main className="p-8 max-w-4xl mx-auto">
                <LoadingState
                    message="Loading events..."
                />
            </main>
        );
    }

    if (error) {
        return (
            <main className="p-8 max-w-4xl mx-auto">
                <ErrorState
                    message={error}
                />
            </main>
        );
    }

    const filteredEvents = events.filter((event) => {
        const query = search.toLowerCase();

        return (
            event.category.toLowerCase().includes(query) ||
            event.value.toLowerCase().includes(query) ||
            event.triggers.some((t) =>
                t.trigger.name
                    .toLowerCase()
                    .includes(query)) ||
            (event.notes ?? "")
                .toLowerCase()
                .includes(query)
        );
    });

    return (
        <main className="p-8 max-w-4xl mx-auto">
            <Link href="/">
                &larr; Home 
            </Link>

            <h1 className="text-3xl font-bold mt-4 mb-6">
                Event History
            </h1>

            <input
                type="text"
                placeholder="Search events..."
                className="border rounded p-2 w-full mb-6"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />

            {events.length === 0 ? (
                <EmptyState
                    title="No events recorded"
                    description="Your event history will appear here after you record your first entry."
                    actionHref="/events"
                    actionLabel="Record an event"
                />
            ) : filteredEvents.length === 0 ? (
                <EmptyState
                    title="No matching events"
                    description="No events match the current search or filter."
                />
            ) : (
                <div className="space-y-4">
                    {filteredEvents.map((event) => (

                        <div 
                            key={event.id}
                            className="border rounded p-4"
                        >
                            <p>
                                <strong>Category:</strong> {event.category}
                            </p>

                            <p>
                                <strong>Value:</strong> {event.value}
                            </p>

                        {event.moodScore !== null && (
                            <p>
                                <strong>Mood Score:</strong>{" "}
                                {event.moodScore}/10
                            </p>
                        )}

                            <p>
                                <strong>Triggers:</strong>{" "}
                                    {event.triggers.length > 0
                                        ? event.triggers
                                            .map((t) => t.trigger.name)
                                            .join(", ")
                                        : "-"}
                            </p>

                            <p>
                                <strong>Notes:</strong> {event.notes || "-"}
                            </p>

                            <p>
                                <strong>Event Date:</strong>{" "}
                                {new Date(event.eventDate)
                                    .toLocaleString("de-DE")}
                            </p>

                            <Link
                                href={`/events/edit/${event.id}`}
                                className="border rounded px-3 py-2 mr-2"
                            >
                                Edit
                            </Link>

                            <button
                                onClick={() => deleteEvent(event.id)}
                                className="mt-4 border rounded px-3 py-1"
                            >
                                Delete
                            </button>
                        </div>
                        ))}
                    </div>
            )}
        </main>
    );
}  
