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
                    day: new Date(event.eventDate)
                        .toLocaleDateString(),
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

    const triggerMoodAverages = Object.entries(
        events.reduce(
            (
                acc: Record<
                    string,
                    { total: number; count: number }
                >,
                event: any
            ) => {
                if (
                    event.category !== "Mood" ||
                    event.moodScore === null ||
                    !event.trigger
                ) {
                    return acc;
                }

                if (!acc[event.trigger]) {
                    acc[event.trigger] = {
                        total: 0,
                        count: 0,
                    };
                }

                acc[event.trigger].total += event.moodScore;
                acc[event.trigger].count++;

                return acc;
            },
            {}
        )
    ).map(([trigger, values]) => ({
        trigger,
        average:
            values.total / values.count,
    }));

    triggerMoodAverages.sort(
        (a, b) => b.average - a.average
    );

    const bestTrigger =
        triggerMoodAverages.length
            ? triggerMoodAverages[0]
            : null;

    const worstTrigger =
        triggerMoodAverages.length
            ? triggerMoodAverages[
                triggerMoodAverages.length - 1
            ]
            : null;

    const categoryStatistics = Object.entries(
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
        )
    ).sort((a, b) => b[1] - a[1]);

    const latestMood = moodEvents.length
        ? moodEvents[moodEvents.length - 1]
        : null;

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

                <div className="border rounded-lg p-6 mb-8">
                    <h2 className="text-xl font-semibold mb-4">
                        Latest Mood
                    </h2>

                    {latestMood ? (
                        <>
                            <p>
                                <strong>Value:</strong> {latestMood.value}
                            </p>

                            <p>
                                <strong>Score:</strong> {latestMood.moodScore}
                            </p>

                            <p>
                                <strong>Date:</strong>{" "}
                                {new Date(
                                    latestMood.eventDate
                                ).toLocaleString()}
                            </p>
                        </>
                    ) : (
                        <p>No mood entries yet.</p>
                    )}
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

            <div className="border rounded-lg p-6 mb-8">
                <h2 className="text-xl font-semibold mb-4">
                    Trigger Insights
                </h2>

                {triggerMoodAverages.length === 0 ? (
                    <p>No mood data yet.</p>
                ) : (
                    triggerMoodAverages.map((item) => (
                        <div
                            key={item.trigger}
                            className="mb-3"
                        >
                            <strong>
                                {item.trigger}
                            </strong>

                            <p>
                                Average mood:{" "}
                                {item.average.toFixed(1)}
                            </p>
                        </div>
                    ))
                )}
            </div>

            <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="border rounded-lg p-4">
                    <h3 className="font-semibold">
                        Best Trigger
                    </h3>

                    {bestTrigger ? (
                        <>
                            <p>{bestTrigger.trigger}</p>

                            <p>{bestTrigger.average.toFixed(1)}</p>
                        </>
                    ) : (
                        <p>No data</p>
                    )}
                </div>

                <div className="border rounded-lg p-4">
                    <h3 className="font-semibold">
                        Lowest Mood Trigger
                    </h3>

                    {worstTrigger ? (
                        <>
                            <p>{worstTrigger.trigger}</p>

                            <p>{worstTrigger.average.toFixed(1)}</p>
                        </>
                    ) : (
                        <p>No data</p>
                    )}
                </div>
            </div>

            <div className="border rounded-lg p-6 mb-8">
                <h2 className="text-xl font-semibold mb-4">
                    Category Statistics
                </h2>

                {categoryStatistics.map(([category, count]) => (
                    <div
                        key={category}
                        className="flex justify-between mb-2"
                    >
                        <span>{category}</span>

                        <span>{count}</span>
                    </div>
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