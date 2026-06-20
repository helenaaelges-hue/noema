"use client";

import {useEffect, useState} from "react";
import Link from "next/link";
import { Trigger } from ".prisma/client/wasm";

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
        Trigger[]
    >([]);
    const [trigger, setTrigger] = useState("");
    const [newTrigger, setNewTrigger] = useState("");
    const [showTriggerForm, setShowTriggerForm] = useState(false);
    const [notes, setNotes] = useState("");

    async function addCategory() {
        if (!newCategory.trim()) return;

        const response = await fetch(
            "/api/categories",
            {
                method: "POST",
                headers: {
                    "Content-Type":
                        "application/json",
                },
                body: JSON.stringify({
                    name: newCategory,
                }),
            }
        );

        if (response.ok) {
            const created =
                await response.json();

            setCategories([
                ...categories,
                created,
            ]);

            setNewCategory("");
            setShowCategoryForm(false);
        }
    }

    async function addTrigger() {
        if (!newTrigger.trim()) return;

        const response = await fetch(
            "/api/triggers",
            {
                method: "POST",
                headers: {
                    "Content-Type":
                        "application/json",
                },
                body: JSON.stringify({
                    name: newTrigger,
                }),
            }
        );

        if (response.ok) {
            const created =
                await response.json();

            setTriggers([
                ...triggers,
                created,
            ]);

            setNewTrigger("");
            setShowTriggerForm(false);
        }
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
                category,
                value,
                moodScore,
                trigger,
                notes,
            }),
        });

        if (response.ok) {
            alert("Event saved!");
            setCategory("");
            setValue("");
            setMoodScore("");
            setTrigger("");
            setNotes("");
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


    return (
        <main className="p-8 max-w-xl mx-auto">
           <Link href="/">&larr; Home</Link>
           
            <h1 className="text-3xl font-bold mt-4 mb-6">Event Entry</h1>

            <form className="flex flex-col gap-4">

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
                        <label>Mood Score (0-10)</label>
                        
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
                    <label>Trigger</label>

                    <select className="border p-2 w-full" value={trigger} onChange={(e) => setTrigger(e.target.value)}>
                        <option value="">Select trigger</option>
                       {triggers.map((trigger: { id: number; name: string }) => (
                            <option
                                key={trigger.id}
                                value={trigger.name}
                            >
                                {trigger.name}
                            </option>
                        ))}
                    </select>

                    <button
                        type="button"
                        className="mt-2 text-sm underline"
                        onClick={() =>
                            setShowTriggerForm(
                                !showTriggerForm
                            )
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
                                onChange={(e) =>
                                    setNewTrigger(
                                        e.target.value
                                    )
                                }
                            />

                            <button
                                type="button"
                                onClick={addTrigger}
                                className="border rounded p-2 mt-2"
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