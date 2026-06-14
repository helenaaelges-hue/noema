"use client";

import { LineChart, Line, XAxis, YAxis, Tooltip } from "recharts";

const data = [
    { day: "Mon", mood: 6},
    { day: "Tue", mood: 7},
    { day: "Wed", mood: 5},
    { day: "Thu", mood: 8},
    { day: "Fri", mood: 6},
];

export default function AnalyticsPage() {
    return (
        <main className="p-8">
            <h1 className="text-3xl font-bold mb-6">Analytics</h1>

            <LineChart width={500} height={300} data={data}>
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="mood" />
            </LineChart>
        </main>
    );
}