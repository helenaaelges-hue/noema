"use client";

import {useEffect, useState} from "react";
import Link from "next/link";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import {
    getAverageMood,
    getLatestMood,
    getCategoryCounts,
    getTriggerMoodAverages,
    confidenceLabel,
} from "@/src/lib/insights";
import {
    getMoodPerTrigger,
    getOverallAverageMood,
    getWeekdayCorrelation,
    getTimeOfDayCorrelation,
} from "@/src/lib/correlations";
import Accordion from "@/src/components/Accordion";
import {filterEvents} from "@/src/lib/correlationExplorer";
import {getSelectionAverageMood, moodDifferenceFromBaseLine} from "@/src/lib/selectionAnalytics";
import ConfidenceBadge from "@/src/components/ConfidenceBadge";
import {generateInsights} from "@/src/lib/generateInsights";
import InsightCard from "@/src/components/InsightCard";
import {getTriggerCombinations} from "@/src/lib/combinations";

export default function AnalyticsPage() {
    const [moodData, setMoodData] = useState<any[]>([]);
    const [events, setEvents] = useState<any[]>([]);
    const [totalMoodEntries, setTotalMoodEntries] = useState(0);
    const [selectedCategory, setSelectedCategory] = useState("");
    const [selectedTrigger, setSelectedTrigger] = useState<number | null>(null);

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

    const topTrigger =
        triggerCorrelations.length
            ? triggerCorrelations.reduce(
                (best, current) =>
                    current.entries > best.entries
                        ? current
                        : best
            ).trigger
            : "None";

    const categories =
        Array.from(
            new Set(
                events.map((e) => e.category)
            )
        );

    const triggers =
        Array.from(
            new Map(
                events
                    .flatMap((e) => e.triggers)
                    .map((t) => [
                        t.trigger.id,
                        t.trigger,
                    ])
            ).values()
        );

    const filteredEvents =
        filterEvents(
            events,
            selectedCategory,
            selectedTrigger
        );

    const selectionAverage =
        getSelectionAverageMood(filteredEvents);

    const difference =
        moodDifferenceFromBaseLine(
            events,
            filteredEvents
        );

    const weekdayData =
        getWeekdayCorrelation(events);

    const timeData =
        getTimeOfDayCorrelation(events);

    const insights =
        generateInsights(events);

    const triggerCombinations =
        getTriggerCombinations(events);

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


        <Accordion title="Correlation Explorer">
            <select
                className="border p-2 w-full mb-4"
                value={selectedCategory}
                onChange={(e)=>
                    setSelectedCategory(e.target.value)
                }
            >
                <option value="">
                    All Categories
                </option>

                {categories.map((category)=>(
                    <option
                        key={category}
                        value={category}
                    >
                        {category}
                    </option>
                ))}
            </select>

            <select
                className="border p-2 w-full mb-4"
                value={selectedTrigger ?? ""}
                onChange={(e)=>
                    setSelectedTrigger(
                        e.target.value
                            ? Number(e.target.value)
                            : null
                    )
                }
            >
                <option value="">
                    All Triggers
                </option>

                {triggers.map((trigger)=>(

                    <option
                        key={trigger.id}
                        value={trigger.id}
                    >
                        {trigger.name}
                    </option>
                ))}
            </select>

            <p className="mb-4">
                Matching Events:

                <strong>
                    {" "}
                    {filteredEvents.length}
                </strong>
            </p>

            <p>
                Average Mood:
                {" "}
                {selectionAverage ?? "-"}
            </p>

            <p>
                Difference from Overall Average Mood:{" "}
                {difference === null
                    ? "-"
                    : difference > 0
                        ? `+${difference}`
                        : difference}
            </p>
        </Accordion>

        <div className="mb-4 rounded-lg border bg-gray-50 p-4 text-sm">
            <p className="font-semibold mb-2">
                How To Read These Insights
            </p>

            <ul className="space-y-1">
                <li>
                    🟩 Positive = associated with a higher mood
                </li>

                <li>
                    ⬜ Neutral = close to your average
                </li>

                <li>
                    🟥 Negative = associated with a lower mood
                </li>

                <li>
                    ⭐ Confidence increases with more recorded events.
                </li>
            </ul>
        </div>

        <Accordion
            title="💡 Did You Know?"
            defaultOpen
        >
            <div className="space-y-4">
                {insights.length === 0 ? (
                    <p>
                        Not enough data yet.
                    </p>
                ) : (
                    insights.map((insight) => (
                        <InsightCard
                            key={insight.title}
                            title={insight.title}
                            description={insight.description}
                            confidence={insight.confidence}
                            impact={insight.impact}
                        />
                    ))
                )}
            </div>
        </Accordion>

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

                            <ConfidenceBadge
                                level={confidenceLabel(item.entries)}
                            />
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
                                Entries:{" "}
                                {bestTrigger.entries}
                            </p>

                            <ConfidenceBadge
                                level={confidenceLabel(bestTrigger.entries)}
                            />
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
                                Entries:{" "}
                                {worstTrigger.entries}
                            </p>

                            <ConfidenceBadge
                                level={confidenceLabel(worstTrigger.entries)}
                            />
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