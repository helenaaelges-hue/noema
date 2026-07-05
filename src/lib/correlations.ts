import {AnalyticsEvent} from "./insights";

export type CorrelationResult = {
    label: string;
    averageMood: number;
    entries: number;
    difference: number;
};

export function calculateCorrelation(
    events: AnalyticsEvent[],
    getLabel: (event: AnalyticsEvent) => string | null
): CorrelationResult[] {
    const moodEvents = events.filter(
        (event) =>
            event.category === "Mood" &&
            event.moodScore !== null
    );

    if (moodEvents.length === 0) {
        return [];
    }

    const overallAverage =
        moodEvents.reduce(
            (sum, event) => sum + (event.moodScore ?? 0),
            0
        ) / moodEvents.length;

    const totals: Record<
        string,
        {
            total: number;
            count: number;
        }
    > = {};

    moodEvents.forEach((event) => {
        const label = getLabel(event);

        if (!label) {
            return;
        }

        if (!totals[label]) {
            totals[label] = {
                total: 0,
                count: 0,
            };
        }

        totals[label].total += event.moodScore!;
        totals[label].count++;
    });

    return Object.entries(totals)
        .map(([label, values]) => {
            const average = values.total / values.count;

        return {
            label,
            averageMood: Number(
                average.toFixed(1)
            ),
            entries: values.count,
            difference: Number(
                (
                    average -
                    overallAverage
                ).toFixed(1)
            ),
        };
    })
    .sort(
        (a, b) =>
            b.averageMood - a.averageMood
    );
}

export function getWeekdayCorrelation(
    events: AnalyticsEvent[]
) {
    return calculateCorrelation(
        events,
        (event) => {
            return new Date(
                event.eventDate
            ).toLocaleDateString(
                "en-US",
                {
                    weekday: "long"
                }
            );
        }
    );
}

export function getTimeOfDayCorrelation(
    events: AnalyticsEvent[]
) {
    return calculateCorrelation(
        events,
        (event) => {
            const hour =
                new Date(
                    event.eventDate
                ).getHours();

            if (hour < 6) return "Night";
            if (hour < 12) return "Morning";
            if (hour < 18) return "Afternoon";

            return "Evening";
        }
    );
}

export function getTriggerCorrelation(
    events: AnalyticsEvent[]
): CorrelationResult[] {

    const expanded: AnalyticsEvent[] = [];

    events.forEach((event) => {

        if (!event.triggers?.length) {
            return;
        }

        event.triggers.forEach((t) => {
            expanded.push({
                ...event,
                triggers: [
                    {
                        trigger: t.trigger,
                    },
                ],
            });
        });
    });

    return calculateCorrelation(
        expanded,
        (event) =>
            event.triggers[0]?.trigger.name ??
            null
    );
}

export function getMoodByCategory(
    events: AnalyticsEvent[]
) {
    const results: Record<
        string,
        {
            total: number;
            count: number;
        }
    > = {};

    events.forEach((event) => {
        if (
            event.category !== "Mood" ||
            event.moodScore === null
        ) {
            return;
        }

        const moodName = event.value;

        if (!results[moodName]) {
            results[moodName] = {
                total: 0,
                count: 0,
            };
        }

        results[moodName].total += event.moodScore!;
        results[moodName].count++;
    });

    return Object.entries(results)
        .map(([name, values]) => ({
            mood: name,
            average:
                values.total /
                values.count,
            entries: values.count,
        }))
        .sort(
            (a, b) =>
                    b.average - a.average
        );
}

export function getMoodPerTrigger(
    events: AnalyticsEvent[]
) {
    const triggerTotals: Record<
        string,
        {
            total: number;
            count: number;
        }
    > = {};

    events.forEach((event) => {
        if (
            event.category !== "Mood" ||
            event.moodScore === null
        ) {
            return;
        }

        (event.triggers ?? []).forEach((trigger) => {

            const name =
                trigger.trigger.name;

            if (!triggerTotals[name]) {

                triggerTotals[name] = {
                    total: 0,
                    count: 0,
                };
            }

            triggerTotals[name].total += event.moodScore!;
            triggerTotals[name].count++;
        });
    });

    return Object.entries(triggerTotals)
        .map(([trigger, values]) => ({
            trigger,
            average:
                values.total /
                values.count,
            entries: values.count,
        }))
        .sort(
            (a, b) =>
                    b.average - a.average
        );
}

export function getOverallAverageMood(
    events: AnalyticsEvent[]
) {

    const moods =
        events.filter(
            e =>
                e.category === "Mood" &&
                e.moodScore !== null
        );

    if (moods.length === 0)
        return 0;

    return (
        moods.reduce(
            (sum, e) =>
                sum + e.moodScore!,
            0
        ) /
        moods.length
    );
}