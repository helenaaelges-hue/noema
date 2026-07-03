"use client";

import {useEffect, useState} from "react";
import Link from "next/link";

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

    useEffect(() => {
        async function loadEvents() {
            const response = await fetch("/api/events");
            const data = await response.json();
            setEvents(data);
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

            {filteredEvents.length === 0 ? (
                <p>No events found.</p>
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
