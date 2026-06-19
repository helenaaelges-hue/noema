"use client";

import {useEffect, useState} from "react";
import Link from "next/link";

export default function EventsPage() {
    const [category, setCategory] = useState("");
    const [categories, setCategories] = useState<
        { id: number; name: string }[]
    >([]);
    const [value, setValue] = useState("");
    const [moodScore, setMoodScore] = useState("");
    const [trigger, setTrigger] = useState("");
    const [notes, setNotes] = useState("");

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
                        <option value="">Select trigger...</option>
                        <option value="Partner Conflict">Partner Conflict</option>
                        <option value="Work Stress">Work Stress</option>
                        <option value="Poor Sleep">Poor Sleep</option>
                        <option value="Exercise">Exercise</option>
                        <option value="Medication">Medication</option>
                        <option value="Other">Other</option>
                    </select>
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