"use client";

import {useEffect, useState} from "react";
import {useParams} from "next/navigation";
import Link from "next/link";

export default function EditEventPage() {
    const params = useParams();

    const [category, setCategory] = useState("");
    const [value, setValue] = useState("");
    const [moodScore, setMoodScore] = useState("");
    const [trigger, setTrigger] = useState("");
    const [notes, setNotes] = useState("");
    const [eventDate, setEventDate] = useState("");
    const [categories, setCategories] = useState<
        { id: number; name: string }[]
    >([]);

    const [triggers, setTriggers] = useState<
        { id: number; name: string } []
    >([]);

    async function updateEvent() {
        await fetch(
            `/api/events/${params.id}`,
            {
                method: "PUT",

                headers: {
                    "Content-Type":
                        "application/json",
                },

                body: JSON.stringify({
                    category,
                    value,
                    moodScore,
                    trigger,
                    notes,
                    eventDate,
                }),
            }
        );

        alert("Changes saved!");
    }

    useEffect(() => {
        async function loadEvent() {
            const response = await fetch(
                `/api/events/${params.id}`
            );

            const data =
                await response.json();

            setCategory(data.category);
            setValue(data.value);

            setMoodScore(
                data.moodScore?.toString() || ""
            );

            setTrigger(data.trigger || "");
            setNotes(data.notes || "");

            setEventDate(
                new Date(data.eventDate)
                    .toISOString()
                    .slice(0, 16)
            );

            setLoading(false);
        }

        loadEvent();

        async function loadCategories() {
            const response =
                await fetch("/api/categories");

            const data =
                await response.json();

            setCategories(data);
        }

        async function loadTriggers() {
            const response =
                await fetch("/api/triggers");

            const data =
                await response.json();

            setTriggers(data);
        }

        loadCategories();
        loadTriggers();

    }, [params.id]);

    const [loading, setLoading] =
        useState(true);

    if (loading) {
        return <p>Loading...</p>;
    }

    return (
        <main className="p-8 max-w-xl mx-auto">
            <Link href="/events-list">
                &larr; Back to Event History
            </Link>

            <h1 className="text-3xl font-bold mt-4 mb-6">
                Edit Event
            </h1>

            <div className="space-y-4">

                <label>Category</label>
                <select
                    className="border p-2 w-full"
                    value={category}
                    onChange={(e) =>
                        setCategory(e.target.value)
                    }
                >
                    {categories.map((category) => (
                        <option
                            key={category.id}
                            value={category.name}
                        >
                            {category.name}
                        </option>
                    ))}
                </select>

                <label>Value</label>
                <input
                    className="border p-2 w-full"
                    value={value}
                    onChange={(e) =>
                        setValue(e.target.value)
                    }
                />

                <label>Mood Score</label>
                <input
                    type="number"
                    className="border p-2 w-full"
                    value={moodScore}
                    onChange={(e) =>
                        setMoodScore(e.target.value)
                    }
                />

                <label>Trigger</label>
                <select
                    className="border p-2 w-full"
                    value={trigger}
                    onChange={(e) =>
                        setTrigger(e.target.value)
                    }
                >
                    <option value="">
                        No Trigger
                    </option>

                    {triggers.map((trigger) => (
                        <option
                            key={trigger.id}
                            value={trigger.name}
                        >
                            {trigger.name}
                        </option>
                    ))}
                </select>

                <label>Notes</label>
                <textarea
                    className="border p-2 w-full"
                    value={notes}
                    onChange={(e) =>
                        setNotes(e.target.value)
                    }
                />

                <label>Event Date</label>
                <input
                    type="datetime-local"
                    className="border p-2 w-full"
                    value={eventDate}
                    onChange={(e) =>
                        setEventDate(e.target.value)
                    }
                />

                <button
                    type="button"
                    onClick={updateEvent}
                    className="border rounded p-3"
                >
                    Save Changes
                </button>
                
            </div>
        </main>
    );
}