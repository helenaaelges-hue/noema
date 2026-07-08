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

        for (const trigger of triggerData) {

            if (trigger.entries >= 5) {
                continue;
            }

            insights.push({
                title: "More Data Needed",
                description:
                    `${trigger.label} only has ${trigger.entries} recorded ${
                        trigger.entries === 1
                            ? "entry"
                            : "entries"
                    }. More data is needed before reliable conclusions can be drawn.`,
                confidence: "Low",
                impact: 0,
                strength: 0, 
            });
        }

        if (
            Math.abs(best.difference) >= 0.5
        ) {
        
            insights.push({

                title:
                    "Strongest Positive Trigger",

                description:
                    `${best.label} is associated with moods ${best.difference > 0 ? "+" : ""}${best.difference} above your average.`,

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
            Math.abs(worst.difference) >= 0.5
        ) {

            insights.push({

                title:
                    "Strongest Negative Trigger",

                description:
                    `${worst.label} is associated with moods ${worst.difference} below your average.`,

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