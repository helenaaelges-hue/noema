"use client";

import {useEffect, useState} from "react";
import Link from "next/link";

type Event = {
    id: number;
    category: string;
    value: string;
    trigger: string | null;
    notes: string | null;
    createdAt: string;
};

export default function EventsListPage() {
    const [events, setEvents] = useState<Event[]>([]);

    useEffect(() => {
        async function loadEvents() {
            const response = await fetch("/api/events");
            const data = await response.json();
            setEvents(data);
        }

        loadEvents();
    }, []);

    return (
        <main className="p-8 max-w-4xl mx-auto">
            <Link href="/">
                &larr; Home 
            </Link>

            <h1 className="text-3xl font-bold mt-4 mb-6">
                Event History
            </h1>

            {events.length === 0 ? (
                <p>No events found.</p>
            ) : (
                <div className="space-y-4">
                    {events.map((event) => (
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

                            <p>
                                <strong>Trigger:</strong> {event.trigger || "-"}
                            </p>

                            <p>
                                <strong>Notes:</strong> {event.notes || "-"}
                            </p>

                            <p>
                                <strong>Date:</strong>{" "}
                                {new Date(event.createdAt).toLocaleString()}
                            </p>
                        </div>
                    ))}
                </div>
            )}
        </main>
    );
}  
