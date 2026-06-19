"use client";

import {useEffect, useState} from "react";
import Link from "next/link";
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

export default function AnalyticsPage() {
    const [moodData, setMoodData] = useState<
        { day: number; mood: number }[]
    >([]);

    const [averageMood, setAverageMood] = useState(0);
    const [totalMoodEntries, setTotalMoodEntries] = useState(0);
    const [topTrigger, setTopTrigger] = useState("None");

    useEffect(() => {
        async function loadData() {
            const response = await fetch("/api/analytics");
            const data = await response.json();

            const moodEvents = data.filter(
                (event: any) =>
                    event.category === "Mood" &&
                    event.moodScore !== null
            );

            const average =
                moodEvents.reduce(
                    (sum: number, event: any) =>
                        sum + event.moodScore,
                    0
                ) / moodEvents.length;

            setAverageMood(
                Number(average.toFixed(1))
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

            const chartData = data.map((event: any, index: number) => ({
                day: index + 1,
                mood: event.moodScore,
            }))
            .filter(
                (item: { day: number; mood: number | null }) =>
                    item.mood !== null
            );

            setMoodData(chartData);
        }

        loadData();
    }, []);

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

            <div className="grid grid-cols-3 gap-4 mb-8">
                <div className="border rounded-lg p-4">
                    <h3 className="font-semibold">
                        Average Mood
                    </h3>

                    <p>{averageMood}</p>
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