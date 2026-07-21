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
    const [deletingEventId, setDeletingEventId] = useState<number | null>(
        null
    );

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

    async function deleteEvent(
        id: number
    ) {
        if (
            deletingEventId !== null
        ) {
            return;
        }

        const confirmed =
            window.confirm(
                "Are you sure you want to delete this event?"
            );

        if (!confirmed) {
            return;
        }

        setError("");
        setDeletingEventId(id);

        try {
            const response =
                await fetch(
                    `/api/events/${id}`,
                    {
                        method: "DELETE",
                    }
                );

            const responseText =
                await response.text();

            let data: unknown = null;

            if (responseText) {
                try {
                    data =
                        JSON.parse(
                            responseText
                        );
                } catch {
                    if (!response.ok) {
                        throw new Error(
                            "The server returned an invalid response."
                        );
                    }
                }
            }

            if (!response.ok) {
                const message =
                    data !== null &&
                    typeof data ===
                        "object" &&
                    "error" in data &&
                    typeof data.error ===
                        "string"
                        ? data.error
                        : "Failed to delete event.";

                throw new Error(message);
            }

            setEvents(
                currentEvents =>
                    currentEvents.filter(
                        event =>
                            event.id !== id
                    )
            );
        } catch (deleteError) {
            setError(
                deleteError instanceof Error
                    ? deleteError.message
                    : "Failed to delete event."
            );
        } finally {
            setDeletingEventId(null);
        }
    }

    if (loading) {
        return (
            <main className="page-shell">
                <LoadingState
                    message="Loading events..."
                />
            </main>
        );
    }

    if (error) {
        return (
            <main className="page-shell">
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
        <main className="page-shell">
            <div className="mb-8">
                <h1 className="page-heading">
                    Event History
                </h1>

                <p className="page-description">
                    Review, search, edit, or delete
                    your recorded events.
                </p>
            </div>

            <div className="surface-card mb-6">
                <label
                    htmlFor="event-search"
                    className="field-label"
                >
                    Search events
                </label>

                <input
                    id="event-search"
                    type="search"
                    placeholder="Search events..."
                    className="feld-input"
                    value={search}
                    onChange={event => setSearch(event.target.value)}
                />

                <p className="mt-2 text-sm text-slate-500">
                    Search by category, value, trigger, or notes.
                </p>
            </div>

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
                        <article 
                            key={event.id}
                            className="surface-card-compact"
                        >
                            <div className="flex flex-wrap items-start justify-between gap-3">
                                <div>
                                    <p className="text-xs font-semibold uppercase tracking-wide text-indigo-600">
                                        {event.category}
                                    </p>

                                    <h2 className="mt-1 text-lg font-semibold text-slate-900">
                                        {event.value}
                                    </h2>
                                </div>

                                <time
                                    dateTime={
                                        event.eventDate
                                    }
                                    className="text-sm text-slate-500"
                                >
                                    {new Date(
                                        event.eventDate
                                    ).toLocaleString(
                                        "de-DE"
                                    )}
                                </time>
                            </div>

                            <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
                                {event.moodScore !==
                                    null && (
                                    <div>
                                        <dt className="font-medium text-slate-700">
                                            Mood Score
                                        </dt>

                                        <dd className="text-slate-600">
                                            {
                                            event.moodScore
                                            }
                                            /10
                                        </dd>
                                    </div>
                                )}

                                <div>
                                    <dt className="font-medium text-slate-700">
                                        Triggers
                                    </dt>

                                    <dd className="text-slate-600">
                                        {event
                                            .triggers
                                            .length >
                                        0
                                            ? event.triggers
                                                    .map(
                                                        relation =>
                                                            relation
                                                                .trigger
                                                                .name
                                                    )
                                                    .join(
                                                        ", "
                                                    )
                                            : "None"}
                                    </dd>
                                </div>

                                <div className="sm:col-span-2">
                                    <dt className="font-medium text-slate-700">
                                        Notes
                                    </dt>

                                    <dd className="whitespace-pre-wrap text-slate-600">
                                        {event.notes ||
                                            "No notes"}
                                    </dd>
                                </div>
                            </dl>

                            <div className="mt-4 flex flex-wrap gap-2 border-t border-slate-100 pt-4">
                                <Link
                                    href={`/events/edit/${event.id}`}
                                    className="button-secondary"
                                >
                                    Edit
                                </Link>

                                <button
                                    type="button"
                                    onClick={() => deleteEvent(event.id)}
                                    disabled={deletingEventId !== null}
                                    className="button-danger"
                                >
                                    {deletingEventId ===
                                    event.id
                                        ? "Deleting..."
                                        : "Delete"}
                                </button>
                            </div>
                        </article>
                    ))}
                </div>
            )}
        </main>
    );
}
