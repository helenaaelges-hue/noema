"use client";

//React
import {useEffect, useState} from "react";

// Analytics components
import KPICards from "@/src/components/analytics/KPICards";
import TimeRangeSelector from "@/src/components/analytics/TimeRangeSelector";
import InsightsSection from "@/src/components/analytics/InsightsSection";
import MoodSection from "@/src/components/analytics/MoodSection";
import CorrelationExplorer from "@/src/components/analytics/CorrelationExplorer";
import OverviewSection from "@/src/components/analytics/OverviewSection";
import TriggerAnalysisSection from "@/src/components/analytics/TriggerAnalysisSection";
import TriggerCombinationsSection from "@/src/components/analytics/TriggerCombinationsSection";
import CategoryAnalysisSection from "@/src/components/analytics/CategoryAnalysisSection";

//Analytics helpers
import {getAverageMood, getLatestMood, getCategoryCounts, getTriggerMoodAverages, confidenceLabel} from "@/src/lib/insights";
import type {AnalyticsEvent} from "@/src/lib/insights";
import {getMoodPerTrigger, getOverallAverageMood} from "@/src/lib/correlations";
import {getSelectionAverageMood, moodDifferenceFromBaseLine} from "@/src/lib/selectionAnalytics";
import {filterByTimeRange, TimeRange} from "@/src/lib/timeFilter";
import {generateInsights} from "@/src/lib/generateInsights";
import {getTriggerCombinations} from "@/src/lib/combinations";
import {movingAverage} from "@/src/lib/movingAverage";
import {getMoodTrend} from "@/src/lib/trends";

import {EmptyState, ErrorState, LoadingState} from "@/src/components/ui/PageState";



export default function AnalyticsPage() {
    const [events, setEvents] = useState<AnalyticsEvent[]>([]);
    const [selectedTrigger, setSelectedTrigger] = useState<number | null>(null);
    const [timeRange, setTimeRange] = useState<TimeRange>("30d");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    function handleTimeRangeChange(
        nextTimeRange: TimeRange
    ) {
        setTimeRange(
            nextTimeRange
        );

        setSelectedTrigger(null);
    }

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

                setEvents(data as AnalyticsEvent[]);
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
                visibleEvents
                    .flatMap(event => event.triggers)
                    .map(relation => [
                        relation.trigger.id,
                        relation.trigger,
                    ])
            ).values()
        ).sort((first, second) =>
            first.name.localeCompare(
                second.name,
                undefined,
                {
                    sensitivity: "base",
                }
            )  
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
        <main className="page-shell">
            <div className="mb-8">
                <h1 className="page-heading">
                    Analytics
                </h1>

                <p className="page-description">
                    Mood trends based on recorded events.
                </p>
            </div>

            <div className="mt-8 space-y-4">
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
                    <div className="surface-card">
                        <TimeRangeSelector
                            value={timeRange}
                            onChange={handleTimeRangeChange}
                        />
                    </div>

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
                            <div className="space-y-4">

                                {totalMoodEntries > 0 && (
                                    <InsightsSection
                                        insights={insights}
                                    />
                                )}

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
                            </div>
                        </>
                    )}
                    </>
                )}
            </div>
        </main>
    );
}