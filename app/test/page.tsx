"use client";

export default function TestPage() {
    async function createEvent() {
        const response = await fetch("/api/events", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                category: "Mood",
                value: "Happy",
                trigger: "Exercise",
                notes: "Went for a walk",
            }),
        });

        const data = await response.json();

        console.log(data);
        alert("Event saved!");
    }

    return (
        <main className="p-8">
            <button
                onClick={createEvent}
                className="border p-3 rounded"
            >
                Create Test Event
            </button>
        </main>
    );
}