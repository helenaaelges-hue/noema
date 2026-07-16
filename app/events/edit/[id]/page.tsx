"use client";

import {useEffect, useState} from "react";
import {useParams, useRouter} from "next/navigation";
import Link from "next/link";

type Category = {
    id: number;
    name: string;
};

type Trigger = {
    id: number;
    name: string;
};

type EventTrigger = {
    trigger: Trigger;
};

type EventResponse = {
    id: number;
    category: string;
    value: string;
    moodScore: number | null;
    notes: string | null;
    eventDate: string;
    triggers: EventTrigger[];
};

function getErrorMessage(
    data: unknown,
    fallback: string
): string {
    if (
        data &&
        typeof data === "object" &&
        "error" in data &&
        typeof data.error === "string"
    ) {
        return data.error;
    }

    return fallback;
}

async function readJsonResponse(
    response: Response
): Promise<unknown> {
    const text =
        await response.text();

    if (!text) {
        return null;
    }

    try {
        return JSON.parse(text);
    } catch {
        throw new Error(
            "The server returned an invalid response."
        );
    }
}

export default function EditEventPage() {
    const params = 
        useParams<{
            id: string;
        }>();

    const router =  
        useRouter();

    const eventId =
        Array.isArray(params.id)
            ? params.id[0]
            : params.id;

    const [category, setCategory] = useState("");
    const [value, setValue] = useState("");
    const [moodScore, setMoodScore] = useState("");
    const [notes, setNotes] = useState("");
    const [eventDate, setEventDate] = useState("");
    const [categories, setCategories] = useState<Category[]>([]);
    const [triggers, setTriggers] = useState<Trigger[]>([]);
    const [selectedTriggers, setSelectedTriggers] =
        useState<number[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!eventId) {
            setError(
                "Invalid event ID."
            );

            setLoading(false);
            return;
        }

        async function loadPageData() {
            setLoading(true);
            setError("");

            try {
                const [
                    eventResponse,
                    categoryResponse,
                    triggerResponse,
                ] = await Promise.all([
                    fetch(
                        `/api/events/${eventId}`
                    ),
                    fetch("/api/categories"),
                    fetch("/api/triggers"),
                ]);

                const [
                    eventData,
                    categoryData,
                    triggerData,
                ] = await Promise.all([
                    readJsonResponse(
                        eventResponse
                    ),
                    readJsonResponse(
                        categoryResponse
                    ),
                    readJsonResponse(
                        triggerResponse
                    ),
                ]);

                if (!eventResponse.ok) {
                    throw new Error(
                        getErrorMessage(
                            eventData,
                            "Failed to load event."
                        )
                    );
                }

                if (!categoryResponse.ok) {
                    throw new Error(
                        getErrorMessage(
                            categoryData,
                            "Failed to load categories."
                        )
                    );
                }

                if (!triggerResponse.ok) {
                    throw new Error(
                        getErrorMessage(
                            triggerData,
                            "Failed to load triggers."
                        )
                    );
                }

                if (
                    !eventData ||
                    typeof eventData !==
                        "object"
                ) {
                    throw new Error(
                        "The event API returned an invalid response."
                    );
                }

                if (
                    !Array.isArray(
                        categoryData
                    )
                ) {
                    throw new Error(
                        "The categories API returned an invalid response."
                    );
                }

                if (
                    !Array.isArray(
                        triggerData
                    )
                ) {
                    throw new Error(
                        "The triggers API returned an invalid response."
                    );
                }

                const event =
                    eventData as EventResponse;

                setCategory(
                    event.category
                );

                setValue(
                    event.value
                );

                setMoodScore(
                    event.category === "Mood" &&
                    event.moodScore !== null
                        ? event.moodScore.toString()
                        : ""
                );

                setNotes(
                    event.notes ?? ""
                );

                setEventDate(
                    new Date(
                        event.eventDate
                    )
                        .toISOString()
                        .slice(0, 16)
                );

                setSelectedTriggers(
                    Array.isArray(
                        event.triggers
                    )
                        ? event.triggers.map(
                            relation =>
                                relation
                                    .trigger
                                    .id
                        )
                        : []
                );

                setCategories(
                    categoryData as Category[]
                );

                setTriggers(
                    triggerData as Trigger[]
                );
            } catch (loadError) {
                setError(
                    loadError instanceof Error
                        ? loadError.message
                        : "Failed to load the event."
                );
            } finally {
                setLoading(false);
            }
        }

        loadPageData();
    }, [eventId]);

    useEffect(() => {
        if (
            category &&
            category !== "Mood"
        ) {
            setMoodScore("");
        }
    }, [category]);

    async function updateEvent() {
        if (!eventId) {
            setError(
                "Invalid event ID."
            );
            return;
        }

        if (
            !category ||
            !value.trim() ||
            !eventDate
        ) {
            setError(
                "Category, value and event date are required."
            );
            return;
        }

        setSaving(true);
        setError("");

        try {
            const response =
                await fetch(
                    `/api/events/${eventId}`,
                    {
                        method: "PUT",

                        headers: {
                            "Content-Type":
                                "application/json",
                        },

                        body: JSON.stringify({
                            category,
                            value:
                                value.trim(),

                            /*
                             * `category` is already a string.
                             */
                            moodScore:
                                category === "Mood"
                                    ? moodScore
                                    : null,

                            triggerIds:
                                selectedTriggers,

                            notes:
                                notes.trim(),

                            eventDate,
                        }),
                    }
                );

            const data =
                await readJsonResponse(
                    response
                );

            if (!response.ok) {
                throw new Error(
                    getErrorMessage(
                        data,
                        "Failed to update event."
                    )
                );
            }

            alert("Changes saved!");

            router.push(
                "/events-list"
            );

            router.refresh();
        } catch (saveError) {
            setError(
                saveError instanceof Error
                    ? saveError.message
                    : "Failed to update event."
            );
        } finally {
            setSaving(false);
        }
    }

    function toggleTrigger(
        triggerId: number,
        checked: boolean
    ) {
        setSelectedTriggers(
            current =>
                checked
                    ? Array.from(
                        new Set([
                            ...current,
                            triggerId,
                        ])
                    )
                    : current.filter(
                        id =>
                            id !== triggerId
                    )
        );
    }

    if (loading) {
        return (
            <main className="p-8 max-w-xl mx-auto">
                <p>Loading...</p>
            </main>
        );
    }

    if (
        error &&
        !category
    ) {
        return (
            <main className="p-8 max-w-xl mx-auto">
                <Link href="/events-list">
                    &larr; Back to Event History
                </Link>

                <p
                    role="alert"
                    className="mt-6 text-red-700"
                >
                    {error}
                </p>
            </main>
        );
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
                {error && (
                    <p
                        role="alert"
                        className="text-red-700"
                    >
                        {error}
                    </p>
                )}

                <div>
                    <label
                        htmlFor="category"
                        className="block mb-2 font-medium"
                    >
                        Category
                    </label>

                    <select
                        id="category"
                        className="border p-2 w-full"
                        value={category}
                        onChange={event =>
                            setCategory(
                                event.target.value
                            )
                        }
                    >
                        {categories.map(
                            categoryOption => (
                                <option
                                    key={
                                        categoryOption.id
                                    }
                                    value={
                                        categoryOption.name
                                    }
                                >
                                    {
                                        categoryOption.name
                                    }
                                </option>
                            )
                        )}
                    </select>
                </div>

                <div>
                    <label
                        htmlFor="value"
                        className="block mb-2 font-medium"
                    >
                        Value
                    </label>

                    <input
                        id="value"
                        className="border p-2 w-full"
                        value={value}
                        required
                        onChange={event =>
                            setValue(
                                event.target.value
                            )
                        }
                    />
                </div>

                {category === "Mood" && (
                    <div>
                        <label
                            htmlFor="moodScore"
                            className="block mb-2 font-medium"
                        >
                            Mood Score
                        </label>

                        <input
                            id="moodScore"
                            type="number"
                            min={1}
                            max={10}
                            step={1}
                            value={moodScore}
                            required
                            onChange={event =>
                                setMoodScore(
                                    event.target.value
                                )
                            }
                            className="w-full border rounded px-3 py-2"
                        />
                    </div>
                )}

                <fieldset>
                    <legend className="mb-2 font-medium">
                        Triggers
                    </legend>

                    <div className="space-y-2">
                        {triggers.map(
                            trigger => (
                                <label
                                    key={
                                        trigger.id
                                    }
                                    className="flex items-center gap-2"
                                >
                                    <input
                                        type="checkbox"
                                        checked={
                                            selectedTriggers
                                                .includes(
                                                    trigger.id
                                                )
                                        }
                                        onChange={
                                            event =>
                                                toggleTrigger(
                                                    trigger.id,
                                                    event
                                                        .target
                                                        .checked
                                                )
                                        }
                                    />

                                    {trigger.name}
                                </label>
                            )
                        )}
                    </div>
                </fieldset>

                <div>
                    <label
                        htmlFor="notes"
                        className="block mb-2 font-medium"
                    >
                        Notes
                    </label>

                    <textarea
                        id="notes"
                        className="border p-2 w-full"
                        value={notes}
                        onChange={event =>
                            setNotes(
                                event.target.value
                            )
                        }
                    />
                </div>

                <div>
                    <label
                        htmlFor="eventDate"
                        className="block mb-2 font-medium"
                    >
                        Event Date
                    </label>

                    <input
                        id="eventDate"
                        type="datetime-local"
                        className="border p-2 w-full"
                        value={eventDate}
                        required
                        onChange={event =>
                            setEventDate(
                                event.target.value
                            )
                        }
                    />
                </div>

                <button
                    type="button"
                    onClick={updateEvent}
                    disabled={saving}
                    className="border rounded p-3 disabled:opacity-50"
                >
                    {saving
                        ? "Saving..."
                        : "Save Changes"}
                </button>
            </div>
        </main>
    );
}