import { AnalyticsEvent } from "./insights";

import {
    getTriggerCorrelation,
    getWeekdayCorrelation,
    getTimeOfDayCorrelation,
} from "./correlations";

export type Insight = {
    title: string;
    description: string;
    confidence: "Low" | "Medium" | "High";
    impact: number;
    strength: number;
    score: number;
};

export function generateInsights(
    events: AnalyticsEvent[]
): Insight[] {

    const insights: Insight[] = [];


    const triggerData =
        getTriggerCorrelation(events);

        if (triggerData.length > 0) {

        const best = triggerData[0];

        const weakTriggers =
            triggerData.filter(
                t => t.entries < 5
            );

        if (weakTriggers.length > 0) {
            insights.push({
                title: "Collect More Data",
                description:
                    `${weakTriggers.length} trigger${
                        weakTriggers.length === 1
                            ? ""
                            : "s"
                    } still need more observation before reliable conclusions can be drawn.`,
                confidence: "Low",
                impact: 0,
                strength: 0,
                score: 0,
            });
        }

        if (
            Math.abs(best.difference) >= 1
        ) {
        
            insights.push({

                title:
                    "💚 Biggest Positive Influence",

                description:
                    `${best.label} consistently coincides with better moods than your personal average. It may be worth making this a regular part of your routine.`,

                confidence:
                    confidence(best.entries),

                impact:
                    best.difference,
                
                strength:
                    Math.abs(best.difference),

                score:
                    insightScore(
                        best.difference,
                        best.entries
                    ),
            });
        }
    }

    if (triggerData.length > 1) {

        const worst =
            triggerData[
                triggerData.length - 1
            ];

        if (
            Math.abs(worst.difference) >= 1
        ) {

            insights.push({

                title:
                    "⚠️ Biggest Negative Influence",

                description:
                    `${worst.label} frequently appears before lower mood ratings. Consider whether there are ways to reduce or prepare for this trigger. `,

                confidence:
                    confidence(worst.entries),

                impact:
                    worst.difference,
            
                strength:
                    Math.abs(worst.difference),

                score:
                    insightScore(
                        worst.difference,
                        worst.entries
                    ),
            });
        }
    }

    const weekdays =
        getWeekdayCorrelation(events);

    if (weekdays.length > 0) {

        const bestDay =
            weekdays[0];

        const worstDay =
            weekdays[
                weekdays.length - 1
            ];

        if (
            Math.abs(worstDay.difference) >= 0.5
        ) {
            insights.push({
                title: "🫩 Most Challenging Day",
                description:
                    `You consistently report your lowest moods on ${worstDay.label}. This may be worth paying attention to over the coming weeks.`,
                confidence:
                    confidence(
                        worstDay.entries
                    ),
                impact:
                    worstDay.difference,
                strength:
                    Math.abs(
                        worstDay.difference
                    ),

                score:
                    insightScore(
                        worstDay.difference,
                        worstDay.entries
                    ),
            });
        }

        if (Math.abs(bestDay.difference) >= 0.5) {
            
            insights.push({

                title:
                    "📆 Best Day",

                description:
                    `You consistently report your highest moods on ${bestDay.label}. Think about what makes that day different from the rest of your week.`,

                confidence:
                    confidence(bestDay.entries),

                impact:
                    bestDay.difference,
            
                strength:
                    Math.abs(bestDay.difference),

                score:
                    insightScore(
                        bestDay.difference,
                        bestDay.entries
                    ),
            });
        }
    }

    const times =
        getTimeOfDayCorrelation(events);

    if (times.length > 0) {

        const best =
            times[0];

        const worst =
            times[
                times.length - 1
            ];

        if (
            Math.abs(worst.difference) >= 0.5
        ) {
            insights.push({
                title: "⛈️ Most Challenging Time",
                description: `Your ${worst.label.toLowerCase()}s tend to have lower mood ratings than the rest of your day.`,
                confidence: confidence(worst.entries),
                impact: worst.difference,
                strength: Math.abs(worst.difference),
                score: insightScore(worst.difference, worst.entries),
            });
        }

        if (Math.abs(best.difference) >= 0.5) {

                insights.push({

                    title:
                        "🌞 Best Time",

                    description:
                        `Your ${best.label.toLowerCase()}s appear noticeably better than other times of day. If possible, schedule important activities then.`,

                    confidence:
                        confidence(best.entries),

                    impact:
                        best.difference,
                
                    strength:
                        Math.abs(best.difference),

                    score:
                        insightScore(
                            best.difference,
                            best.entries
                        ),
            });
        }
    }

    return insights
        .sort(
            (a, b) =>
                b.score - a.score
        )
        .slice(0, 5);
}

function confidence(
    entries: number
): "Low" | "Medium" | "High" {

    if (entries >= 20)
        return "High";

    if (entries >= 8)
        return "Medium";

    return "Low";
}

function insightScore(
    difference: number,
    entries: number
) {
    const confidenceMultiplier =
        entries >= 20
            ? 1
            : entries >= 8
                ? 0.7
                : 0.4;

    return (
        Math.abs(difference) *
        confidenceMultiplier
    );
}