"use client";

//React
import {useEffect, useState} from "react";

//Next
import Link from "next/link";

// Analytics components
import KPICards from "@/src/components/analytics/KPICards";
import TimeRangeSelector from "@/src/components/analytics/TimeRangeSelector";
import InsightsSection from "@/src/components/analytics/InsightsSection";
import MoodSection from "@/src/components/analytics/MoodSection";
import InsightsLegend from "@/src/components/analytics/InsightsLegend";
import CorrelationExplorer from "@/src/components/analytics/CorrelationExplorer";
import OverviewSection from "@/src/components/analytics/OverviewSection";
import TriggerAnalysisSection from "@/src/components/analytics/TriggerAnalysisSection";
import TriggerCombinationsSection from "@/src/components/analytics/TriggerCombinationsSection";
import CategoryAnalysisSection from "@/src/components/analytics/CategoryAnalysisSection";

//Analytics helpers
import {getAverageMood, getLatestMood, getCategoryCounts, getTriggerMoodAverages, confidenceLabel} from "@/src/lib/insights";
import {getMoodPerTrigger, getOverallAverageMood} from "@/src/lib/correlations";
import {getSelectionAverageMood, moodDifferenceFromBaseLine} from "@/src/lib/selectionAnalytics";
import {filterByTimeRange, TimeRange} from "@/src/lib/timeFilter";
import {generateInsights} from "@/src/lib/generateInsights";
import {getTriggerCombinations} from "@/src/lib/combinations";
import {movingAverage} from "@/src/lib/movingAverage";
import {getMoodTrend} from "@/src/lib/trends";

import {EmptyState, ErrorState, LoadingState} from "@/src/components/ui/PageState";



export default function AnalyticsPage() {
    const [events, setEvents] = useState<any[]>([]);
    const [selectedTrigger, setSelectedTrigger] = useState<number | null>(null);
    const [timeRange, setTimeRange] = useState<TimeRange>("30d");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        async function loadData() {
            setLoading(true);
            setError("");

            try {
                const response =
                    await fetch(
                        "/api/analytics"
                    );

                const data: unknown =
                    await response.json();

                if (!response.ok) {
                    const message =
                        data &&
                        typeof data === "object" &&
                        "error" in data &&
                        typeof data.error === "string"
                            ? data.error
                            : "Failed to load analytics.";

                    throw new Error(message);
                }

                if (!Array.isArray(data)) {
                    throw new Error(
                        "The analytics API returned an invalid response."
                    );
                }

                setEvents(data);
            } catch (loadError) {
                setEvents([]);

                setError(
                    loadError instanceof Error
                        ? loadError.message
                        : "Failed to load analytics."
                );
            } finally {
                setLoading(false);
            }
        }

        loadData();
    }, []);

    const visibleEvents =
        filterByTimeRange(
            events,
            timeRange
        );

    const totalEvents = visibleEvents.length;

    const totalMoodEntries =
        visibleEvents.filter(
            event =>
                event.category === "Mood" &&
                event.moodScore !== null
        ).length;

    const moodEntries =
        visibleEvents
            .filter(
                event =>
                    event.category === "Mood" &&
                    event.moodScore !== null
            )
            .sort(
                (a, b) =>
                    new Date(a.eventDate).getTime() -
                    new Date(b.eventDate).getTime()
            );

    const smoothedMood =
            movingAverage(
                moodEntries.map(
                    entry => entry.moodScore!
                ),
                7
            );

    const moodData =
            moodEntries.map(
                (entry, index) => ({
                    day:
                        new Date(
                            entry.eventDate
                        ).toLocaleDateString(
                            "de-DE",
                            {
                                month: "short",
                                day: "numeric",
                            }
                        ),
                    mood:
                        smoothedMood[index],
                    actual:
                        entry.moodScore,
                })
            );

    const averageMood =
        getAverageMood(visibleEvents);

    const latestMood =
        getLatestMood(visibleEvents);

    const categoryCounts =
        getCategoryCounts(visibleEvents);

    const triggerMoodAverages =
        getTriggerMoodAverages(visibleEvents);

    const bestTrigger =
        triggerMoodAverages[0] ?? null;

    const worstTrigger =
        triggerMoodAverages.length
            ? triggerMoodAverages[
                triggerMoodAverages.length - 1
            ]
            : null;

    const moodEvents = visibleEvents.filter(
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
        getOverallAverageMood(visibleEvents);

    const triggerCorrelations =
        getMoodPerTrigger(visibleEvents);

    const topTrigger =
        triggerCorrelations.length
            ? triggerCorrelations.reduce(
                (best, current) =>
                    current.entries > best.entries
                        ? current
                        : best
            ).trigger
            : "None";

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
        visibleEvents.filter(
            event =>
                event.category === "Mood" &&
                event.moodScore !== null &&
                (
                    selectedTrigger === null ||
                    event.triggers.some(
                        eventTrigger =>
                            eventTrigger
                                .trigger
                                .id ===
                            selectedTrigger
                    )
                )
        );

    const selectionAverage =
        getSelectionAverageMood(filteredEvents);

    const difference =
        moodDifferenceFromBaseLine(
            visibleEvents,
            filteredEvents
        );

    const insights =
        generateInsights(visibleEvents);

    const triggerCombinations =
        getTriggerCombinations(visibleEvents);

    const moodTrends =
        getMoodTrend(visibleEvents);

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

            {loading ? (
                <LoadingState message="Calculating your analytics..." />
            ) : error ? (
                <ErrorState message={error} />
            ) : events.length === 0 ? (
                <EmptyState
                    title="No analytics yet"
                    description="Record some events to begin building your analytics dashboard."
                    actionHref="/events"
                    actionLabel="Record an event"
                />
            ) : (
                <>
                <TimeRangeSelector
                    value={timeRange}
                    onChange={setTimeRange}
                />

                {visibleEvents.length === 0 ? (
                    <EmptyState
                        title="No data for this period"
                        description="There are no recorded events within the selected time range."
                    />
                ) : (
                    <>
                        <KPICards
                            averageMood={averageMood}
                            moodTrend={moodTrends}
                            bestTrigger={bestTrigger?.trigger ?? "-"}
                        />

                        <OverviewSection
                            totalEvents={totalEvents}
                            averageMood={averageMood}
                            totalMoodEntries={totalMoodEntries}
                            topTrigger={topTrigger}
                            latestMood={latestMood}
                        />

                        <CategoryAnalysisSection
                            categoryCounts={categoryCounts}
                        />

                        {totalMoodEntries === 0 ? (
                            <EmptyState
                                title="No mood data yet"
                                description="Record mood events to unlock trends, trigger associations, and personalized insights."
                                actionHref="/events"
                                actionLabel="Record a mood event"
                            />
                        ) : (
                            <>
                                <InsightsLegend />

                                <InsightsSection
                                    insights={insights}
                                />

                                <CorrelationExplorer
                                    triggers={triggers}
                                    selectedTrigger={selectedTrigger}
                                    onTriggerChange={setSelectedTrigger}
                                    filteredEvents={filteredEvents}
                                    selectionAverage={selectionAverage}
                                    difference={difference}
                                />

                                <TriggerCombinationsSection
                                    combinations={triggerCombinations}
                                    confidenceLabel={confidenceLabel}
                                />

                                <TriggerAnalysisSection
                                    triggerMoodAverages={triggerMoodAverages}
                                    overallAverage={overallAverage}
                                    bestTrigger={bestTrigger}
                                    worstTrigger={worstTrigger}
                                    confidenceLabel={confidenceLabel}
                                />

                                <MoodSection
                                    moodData={moodData}
                                    moodDistribution={moodDistribution}
                                />
                            </>
                        )}
                    </>
                )}
                </>
            )}
        </main>
    );
}