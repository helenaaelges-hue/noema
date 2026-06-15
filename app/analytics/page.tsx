"use client";

import Link from "next/link";
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

const moodData = [
    { day: "Mon", mood: 6},
    { day: "Tue", mood: 7},
    { day: "Wed", mood: 5},
    { day: "Thu", mood: 8},
    { day: "Fri", mood: 6},
];

export default function AnalyticsPage() {
    return (
        <main className="p-8 max-w-4xl mx-auto">
            <Link href="/">&larr; Back to Home</Link>

            <h1 className="text-3xl font-bold mt-4mb-2">
                Analytics
            </h1>

            <p className="mb-8">
                Example visualization of mood data over time.
            </p>

            <div className="border rounded-lg p-6">
                <h2 className="text-xl font-semibold mb-4">Mood Trend</h2>

                <LineChart
                    width={700}
                    height={350}
                    data={moodData}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis domain={[0, 10]} />
                    <Tooltip />
                    <Line type="monotone" dataKey="mood" />
                </LineChart>
            </div>
            
            <div className="mt-8 border rounded-lg p-6">
                <h2 className="text-xl font-semibold mb-2">
                    Example Insight
                </h2>

                <p>
                    Average mood was higher on days following exercise activities.
                </p>
            </div>
        </main>
    );
}