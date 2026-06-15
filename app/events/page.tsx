import Link from "next/link";

export default function EventsPage() {
    return (
        <main className="p-8 max-w-xl mx-auto">
           <Link href="/">&larr; Back to Home</Link>
           
            <h1 className="text-3xl font-bold mt-4 mb-6">Event Entry</h1>

            <form className="flex felx-col gap-4">

                <div>
                    <label>Category</label>

                    <select className="border p-2 w-full">
                        <option>Mood</option>
                        <option>Sleep</option>
                        <option>Exercise</option>
                        <option>Medication</option>
                        <option>Work</option>
                        <option>Social</option>
                    </select>

                    <h2 className="text-xl font-semibold mt-8">
                        Custom Categories
                    </h2>

                    <input
                        type="text"
                        className="border p-2 w-full"
                        placeholder="Create a new category"
                    />

                    <button
                        type="button"
                        className="border rounded p-2 mt-2"
                    >
                        Add Category
                    </button>
                </div>

                <div>
                    <label>Value</label>

                    <input
                        type="text"
                        className="border p-2 w-full"
                        placeholder="e.g. Happy, 8 hours, Gym"
                    />
                </div>

                <div>
                    <label>Trigger</label>

                    <select className="border p-2 w-full">
                        <option>Partner Conflict</option>
                        <option>Work Stress</option>
                        <option>Poor Sleep</option>
                        <option>Exercise</option>
                        <option>Medication</option>
                        <option>Other</option>
                    </select>
                </div>

                <div>
                    <label>Notes</label>

                    <textarea
                        className="border p-2 w-full"
                        rows={4}
                        placeholder="Additional details..."
                    />
                </div>

                <button
                    type="submit"
                    className="border rounded p-2"
                >
                    Save Event
                </button>
            </form>
        </main>
    );
}