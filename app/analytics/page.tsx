"use client";

import {useEffect, useState} from "react";
import Link from "next/link";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import {
    getAverageMood,
    getLatestMood,
    getCategoryCounts,
    getTriggerMoodAverages,
} from "@/src/lib/insights";
import {
    getMoodPerTrigger,
    getOverallAverageMood,
} from "@/src/lib/correlations";
import Accordion from "@/src/components/Accordion";

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
                        .toLocaleDateString(
                            "de-DE",
                            {
                                month: "short",
                                day: "numeric",
                            }
                        ),
                    mood: event.moodScore,
                }));

            setMoodData(chartData);
        }

        loadData();
    }, []);

    const totalEvents = events.length;

    const averageMood =
        getAverageMood(events);

    const latestMood =
        getLatestMood(events);

    const categoryCounts =
        getCategoryCounts(events);

    const triggerMoodAverages =
        getTriggerMoodAverages(events);

    const bestTrigger =
        triggerMoodAverages[0] ?? null;

    const worstTrigger =
        triggerMoodAverages.length
            ? triggerMoodAverages[
                triggerMoodAverages.length - 1
            ]
            : null;

    const moodEvents = events.filter(
        (event) =>
            event.category === "Mood" &&
            event.moodScore !== null
    );

    const moodDistribution = Array.from(
        {length: 10},
        (_, index) => ({
            score: index +1,
            count: moodEvents.filter(
                (event) =>
                    event.moodScore === index + 1
            ).length,
        })
    );

    const overallAverage =
        getOverallAverageMood(events);

    const triggerCorrelations =
        getMoodPerTrigger(events);

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

        <Accordion
            title="Overview"
            defaultOpen
        >
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
                        {averageMood ?? "-"}
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
            </Accordion>

            <Accordion
                title="Trigger Analysis"
            >
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
                                {item.average}
                            </p>

                            <p>
                                Difference from Overall Average:
                                {" "}
                                {(item.average - overallAverage).toFixed(1)}
                            </p>

                            <p>
                                Entries: {" "}
                                {item.entries}
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
                            <p className="font-semibold">
                                {bestTrigger.trigger}
                            </p>

                            <p>
                                {bestTrigger.difference > 0 ? "+" : ""}
                                {bestTrigger.difference} above average
                            </p>

                            <p>
                                Average Mood: {bestTrigger.average}/10
                            </p>

                            <p>
                                Based on {bestTrigger.entries} entries
                            </p>
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
                            <p className="font-semibold">
                                {worstTrigger.trigger}
                            </p>

                            <p>
                                {worstTrigger.difference}
                                {" "}below average
                            </p>

                            <p>
                                Average Mood: {worstTrigger.average}/10
                            </p>

                            <p>
                                Based on {worstTrigger.entries} entries
                            </p>
                        </>
                    ) : (
                        <p>No data</p>
                    )}
                </div>
            </div>
        </Accordion>

        <Accordion
            title="Category Analysis"
        >
            <div className="border rounded-lg p-6 mb-8">
                <h2 className="text-xl font-semibold mb-4">
                    Category Statistics
                </h2>

                {Object.entries(categoryCounts).map(
                    ([category, count]) => (
                        <div
                            key={category}
                            className="flex justify-between mb-2"
                        >
                            <span>{category}</span>
                            <span>{count}</span>
                        </div>
                    )
                )}
            </div>
        </Accordion>

        <Accordion
            title="Mood Analysis"
        >
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

            <div className="border rounded-lg p-6 mt-8">
                <h2 className="text-xl font-semibold mb-4">
                    Mood Distribution
                </h2>

                <BarChart
                    width={700}
                    height={300}
                    data={moodDistribution}
                >

                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="score" />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Bar dataKey="count" />
                </BarChart>
            </div>
        </Accordion>
        </main>
    );
}