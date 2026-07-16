"use client";

import {useEffect, useState} from "react";
import Link from "next/link";

export default function EventsPage() {
    const [category, setCategory] = useState("");
    const [categories, setCategories] = useState<
        { id: number; name: string }[]
    >([]);
    const [newCategory, setNewCategory] = useState("");
    const [showCategoryForm, setShowCategoryForm] = useState(false);
    const [value, setValue] = useState("");
    const [moodScore, setMoodScore] = useState("");
    const [triggers, setTriggers] = useState<
        {id: number, name: string}[]
    >([]);
    const [selectedTriggers, setSelectedTriggers] = useState<number[]>([]);
    const [newTrigger, setNewTrigger] = useState("");
    const [showTriggerForm, setShowTriggerForm] = useState(false);
    const [notes, setNotes] = useState("");
    const now = new Date();
    const localDateTime =
        new Date(
            now.getTime() -
            now.getTimezoneOffset() * 60000
        )
            .toISOString()
            .slice(0, 16);
    
    const [eventDate, setEventDate] = useState(localDateTime);

    async function addCategory() {
        const name =
            newCategory.trim();

        if (!name) {
            return;
        }

        const response =
            await fetch(
                "/api/categories",
                {
                    method: "POST",
                    headers: {
                        "Content-Type":
                            "application/json",
                    },
                    body: JSON.stringify({
                        name,
                    }),
                }
            );

        const data =
            await response.json();

        if (!response.ok) {
            alert(
                data.error ??
                "Failed to create category."
            );
            return;
        }

        const createdCategory: {
            id: number;
            name: string;
        } = data;

        setCategories(current =>
            [
                ...current,
                createdCategory,
            ].sort((a, b) =>
                a.name.localeCompare(
                    b.name,
                    undefined,
                    {
                        sensitivity: "base",
                    }
                )
            )
        );

        setCategory(
            createdCategory.name
        );

        setNewCategory("");
        setShowCategoryForm(false);
    }

    async function addTrigger() {
        const name =
            newTrigger.trim();

        if (!name) {
            return;
        }

        const response =
            await fetch(
                "/api/triggers",
                {
                    method: "POST",
                    headers: {
                        "Content-Type":
                            "application/json",
                    },
                    body: JSON.stringify({
                        name,
                    }),
                }
            );

        const data =
            await response.json();

        if (!response.ok) {
            alert(
                data.error ??
                "Failed to create trigger."
            );
            return;
        }

        const createdTrigger: {
            id: number;
            name: string;
        } = data;

        setTriggers(current =>
            [
                ...current,
                createdTrigger,
            ].sort((a, b) =>
                a.name.localeCompare(
                    b.name,
                    undefined,
                    {
                        sensitivity: "base",
                    }
                )
            )
        );

        setSelectedTriggers(current =>
            Array.from(
                new Set([
                    ...current,
                    createdTrigger.id,
                ])
            )
        );

        setNewTrigger("");
        setShowTriggerForm(false);
    }

    async function saveEvent() {

           if (!category || !value) {
            alert("Please select a category and enter a value.");
            return;
        }

        const response = await fetch("/api/events", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                eventDate,
                category,
                value,
                moodScore,
                triggerIds: selectedTriggers,
                notes,
            }),
        });

        if (response.ok) {
            alert("Event saved!");
            setCategory("");
            setValue("");
            setMoodScore("");
            setSelectedTriggers([]);
            setNotes("");
            const now = new Date();
            setEventDate(
                new Date(
                    now.getTime() -
                    now.getTimezoneOffset() * 60000
                )
                .toISOString()
                .slice(0, 16)   
            );
        }
    }

    useEffect(() => {
        async function loadCategories() {
            const response = await fetch(
                "/api/categories"
            );

            const data = await response.json();
            
            setCategories(data);
        }

        loadCategories();

            async function loadTriggers() {
                const response = await fetch(
                    "/api/triggers"
                );

                const data = await response.json();

                setTriggers(data);
            }

            loadTriggers();
    }, []);

    useEffect(() => {
        if (
            category &&
            category !== "Mood"
        ) {
            setMoodScore("");
        }
    }, [category]);


    return (
        <main className="p-8 max-w-xl mx-auto">
           <Link href="/">&larr; Home</Link>
           
            <h1 className="text-3xl font-bold mt-4 mb-6">Event Entry</h1>

            <form className="flex flex-col gap-4">

                <div>
                    <label>Date & Time</label>

                    <input
                        type="datetime-local"
                        className="border p-2 w-full"
                        value={eventDate}
                        onChange={(e) =>
                            setEventDate(e.target.value)
                        }
                    />
                </div>
                
                <div>
                    <label>Category</label>

                    <select
                        className="border p-2 w-full"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                    >
                        <option value="">
                            Select Category
                        </option>

                        {categories.map((category) => (
                            <option
                                key={category.id}
                                value={category.name}
                            >
                                {category.name}
                            </option>
                        ))}
                    </select>

                    <button
                        type="button"
                        className="mt-2 text-sm underline"
                        onClick={() =>
                            setShowCategoryForm(
                                !showCategoryForm
                            )
                        }
                    >
                        + New Category
                    </button>

                    {showCategoryForm && (
                        <div className="mt-3">
                            <input
                                type="text"
                                className="border p-2 w-full"
                                placeholder="Category name"
                                value={newCategory}
                                onChange={(e) =>
                                    setNewCategory(
                                        e.target.value
                                    )
                                }
                            />

                            <button
                                type="button"
                                onClick={addCategory}
                                className="border rounded p-2 mt-2"
                            >
                                Save Category
                            </button>
                        </div>
                    )}
                </div>

                <div>
                    <label>Value</label>

                    <input
                        type="text"
                        className="border p-2 w-full"
                        placeholder="e.g. Happy, 8 hours, Gym"
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                    />
                </div>

                {category === "Mood" && (
                    <div>
                        <label>Mood Score (1-10)</label>
                        
                        <input
                            type="number"
                            min="1"
                            max="10"
                            className="border p-2 w-full"
                            value={moodScore}
                            onChange={(e) => setMoodScore(e.target.value)}
                        />
                    </div>
                )}

                <div>
                    <label className="font-medium">
                        Triggers
                    </label>

                    <div className="space-y-2 mt-2">
                        {triggers.map((trigger) => (
                            <label
                                key={trigger.id}
                                className="flex items-center gap-2"
                            >
                                <input
                                    type="checkbox"
                                    checked={selectedTriggers.includes(trigger.id)}
                                    onChange={(e) => {
                                        if (e.target.checked) {
                                            setSelectedTriggers([
                                                ...selectedTriggers,
                                                trigger.id,
                                            ]);
                                        } else {
                                            setSelectedTriggers(
                                                selectedTriggers.filter((id) => id !== trigger.id)
                                            );
                                        }
                                    }}
                                />
                                {trigger.name}
                            </label>
                        ))}
                    </div>

                    <button
                        type="button"
                        className="mt-2 text-sm underline"
                        onClick={() =>
                            setShowTriggerForm(!showTriggerForm)
                        }
                    >
                        + New Trigger
                    </button>

                    {showTriggerForm && (
                        <div className="mt-3">

                            <input
                                type="text"
                                className="border p-2 w-full"
                                placeholder="Trigger name"
                                value={newTrigger}
                                onChange={(e) => setNewTrigger(e.target.value)}
                            />

                            <button
                                type="button"
                                className="border rounded p-2 mt-2"
                                onClick={addTrigger}
                            >
                                Save Trigger
                            </button>

                        </div>
                    )}
                </div>

                <div>
                    <label>Notes</label>

                    <textarea
                        className="border p-2 w-full"
                        rows={4}
                        placeholder="Additional details..."
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                    />
                </div>

                <button
                    type="button"
                    onClick={saveEvent}
                >
                    Save Event
                </button>
            </form>
        </main>
    );
}