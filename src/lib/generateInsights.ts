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
            });
        }

        if (
            Math.abs(best.difference) >= 1
        ) {
        
            insights.push({

                title:
                    "Biggest Positive Influence",

                description:
                    `${best.label} is associated with an average mood that is ${best.difference > 0 ? "+" : ""}${best.difference} points higher than your usual mood.`,

                confidence:
                    confidence(best.entries),

                impact:
                    best.difference,
                
                strength:
                    Math.abs(best.difference),
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
                    "Biggest Negative Influence",

                description:
                    `${worst.label} is associated with an average mood that is ${worst.difference} points lower than your usual mood.`,

                confidence:
                    confidence(worst.entries),

                impact:
                    worst.difference,
            
                strength:
                Math.abs(worst.difference),
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
            Math.abs(worstDay.difference) >= 1
        ) {
            insights.push({
                title: "Most Challenging Day",
                description:
                    `Your mood tends to be lowest on ${worstDay.label}.`,
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
            });
        }

        insights.push({

            title:
                "Best Day",

            description:
                `Your mood tends to be highest on ${bestDay.label}.`,

            confidence:
                confidence(bestDay.entries),

            impact:
                bestDay.difference,
        
            strength:
            Math.abs(bestDay.difference),
        });
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
            Math.abs(worst.difference) >= 1
        ) {
            insights.push({
                title: "Most Challenging Time",
                description: `Your mood tends to be lowest in the ${worst.label.toLowerCase()}.`,
                confidence: confidence(worst.entries),
                impact: worst.difference,
                strength: Math.abs(worst.difference),
            });
        }

        insights.push({

            title:
                "Best Time",

            description:
                `Your mood tends to be highest in the ${best.label.toLowerCase()}.`,

            confidence:
                confidence(best.entries),

            impact:
                best.difference,
        
            strength:
            Math.abs(best.difference),
        });
    }

    return insights
        .sort(
            (a, b) =>
                b.strength - a.strength
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