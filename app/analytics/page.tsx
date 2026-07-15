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
import {filterEvents} from "@/src/lib/correlationExplorer";
import {generateInsights} from "@/src/lib/generateInsights";
import {getTriggerCombinations} from "@/src/lib/combinations";
import {movingAverage} from "@/src/lib/movingAverage";
import {getMoodTrend} from "@/src/lib/trends";



export default function AnalyticsPage() {
    const [events, setEvents] = useState<any[]>([]);
    const [selectedCategory, setSelectedCategory] = useState("");
    const [selectedTrigger, setSelectedTrigger] = useState<number | null>(null);
    const [timeRange, setTimeRange] = useState<TimeRange>("30d");

    useEffect(() => {
        async function loadData() {
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
                    console.error(
                        "Unexpected /api/analytics response:",
                        data
                    );

                    throw new Error(
                        "Analytics API returned an invalid response."
                    );
                }

                setEvents(data);
            } catch (error) {
                console.error(
                    "Could not load analytics:",
                    error
                );

                setEvents([]);
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
            visibleEvents,
            selectedCategory,
            selectedTrigger
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

    const topInsight =
        insights.length > 0
            ? insights[0]
            : null;

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

            <TimeRangeSelector
                value={timeRange}
                onChange={setTimeRange}
            />

            <KPICards
                averageMood={averageMood}
                moodTrend={moodTrends}
                bestTrigger={bestTrigger?.trigger ?? "-"}
                topInsight={topInsight?.title ?? "-"}
            />

            <CorrelationExplorer
                categories={categories}
                triggers={triggers}
                selectedCategory={selectedCategory}
                selectedTrigger={selectedTrigger}
                onCategoryChange={setSelectedCategory}
                onTriggerChange={setSelectedTrigger}
                filteredEvents={filteredEvents}
                selectionAverage={selectionAverage}
                difference={difference}
            />

            <InsightsLegend />

            <InsightsSection
                insights={insights}
            />

            <OverviewSection
                totalEvents={totalEvents}
                averageMood={averageMood}
                totalMoodEntries={totalMoodEntries}
                topTrigger={topTrigger}
                latestMood={latestMood}
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

            <CategoryAnalysisSection
                categoryCounts={categoryCounts}
            />

            <MoodSection
                moodData={moodData}
                moodDistribution={moodDistribution}
            />
        </main>
    );
}