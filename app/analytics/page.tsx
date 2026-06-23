"use client";

import {useEffect, useState} from "react";
import Link from "next/link";
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

export default function AnalyticsPage() {
    const [moodData, setMoodData] = useState<any[]>([]);
    const [events, setEvents] = useState<any[]>([]);
    const [totalMoodEntries, setTotalMoodEntries] = useState(0);
    const [topTrigger, setTopTrigger] = useState("None");

    useEffect(() => {
        async function loadData() {
            const response = await fetch("/api/analytics");
            const data = await response.json();

            setEvents(data);

            const moodEvents = data.filter(
                (event: any) =>
                    event.category === "Mood" &&
                    event.moodScore !== null
            );

            setTotalMoodEntries(
                moodEvents.length
            );

            const triggerCounts: Record<string, number> = {};

            moodEvents.forEach((event: any) => {
                if (!event.trigger) return;

                triggerCounts[event.trigger] =
                    (triggerCounts[event.trigger] || 0) + 1;
            });

            const mostCommonTrigger =
                Object.entries(triggerCounts)
                    .sort((a, b) => b[1] - a[1])[0];

            if (mostCommonTrigger) {
                setTopTrigger(mostCommonTrigger[0]);
            }

            const chartData = data
                .filter(
                    (event: any) =>
                        event.category === "Mood" &&
                        event.moodScore !== null
                )
                .map((event: any, index: number) => ({
                    day: index + 1,
                    mood: event.moodScore,
                }));

            setMoodData(chartData);
        }

        loadData();
    }, []);

    const totalEvents = events.length;

    const moodEvents =
        events.filter(
            (event) =>
                event.moodScore !== null
        );

    const averageMood =
        moodEvents.length > 0
            ? (
                moodEvents.reduce(
                    (sum: number, event: any) =>
                        sum + event.moodScore,
                    0
                ) /
                moodEvents.length
            ).toFixed(1)
            : "-";

    const categoryCounts: Record<string, number> =
            events.reduce(
                (
                    acc: Record<string, number>,
                    event: any
                ) => {
                    acc[event.category] =
                        (acc[event.category] || 0) + 1;

                    return acc;
                },
                {}
            );

    return (
        <main className="p-8 max-w-4xl mx-auto">
            <Link href="/">
                &larr; Home
            </Link>

            <h1 className="text-3xl font-bold mt-4 mb-2">
                Analytics
            </h1>

            <p className="mb-8">
                Mood trends based on recorded events.
            </p>

            <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="border rounded p-4">
                    <h2 className="font-semibold">
                        Total Events
                    </h2>

                    <p className="text-3xl">
                        {totalEvents}
                    </p>
                </div>

                <div className="border rounded p-4">
                    <h2 className="font-semibold">
                     Average Mood
                    </h2>

                    <p className="text-3xl">
                        {averageMood}
                    </p>
                </div>
            
                <div className="border rounded-lg p-4">
                    <h3 className="font-semibold">
                        Total Mood Entries
                    </h3>

                    <p>{totalMoodEntries}</p>
                </div>

                <div className="border rounded-lg p-4">
                    <h3 className="font-semibold">
                        Top Trigger
                    </h3>

                    <p>{topTrigger}</p>
                </div>
            </div>


            <div className="border rounded-lg p-6 mb-8">

                <h2 className="text-xl font-semibold mb-4">
                    Categories
                 </h2>

                {Object.entries(categoryCounts)
                    .map(([name, count]) => (
                        <p key={name}>
                            {name}: {count}
                        </p>
                ))}
            </div>

            <div className="border rounded-lg p-6">
                <h2 className="text-xl font-semibold mb-4">
                    Mood Trend
                </h2>

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
        </main>
    );
}