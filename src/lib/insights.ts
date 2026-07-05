export type AnalyticsEvent = {
    id: number;
    category: string;
    value: string;
    moodScore: number | null;
    notes: string | null;
    eventDate: string;
    createdAt: string;
    triggers: {
        trigger: {
            id: number;
            name: string;
        };
    }[];
};

export function getAverageMood(
    events: AnalyticsEvent[]
) {
    const moodEvents = events.filter(
        (event) =>
            event.category === "Mood" &&
            event.moodScore !== null
    );

    if (moodEvents.length === 0) {
        return null;
    }

    const average =
        moodEvents.reduce(
            (sum, event) => sum + (event.moodScore ?? 0),
            0
        ) / moodEvents.length;

    return Number(average.toFixed(1));
}

export function getLatestMood(
    events: AnalyticsEvent[]
) {
    const moodEvents = events.filter(
        (event) =>
            event.category === "Mood"
    );

    if (moodEvents.length === 0) {
        return null;
    }

    moodEvents.sort(
        (a, b) =>
            new Date(b.eventDate).getTime() -
            new Date(a.eventDate).getTime()
    );

    return moodEvents[0];
}

export function getCategoryCounts(
    events: AnalyticsEvent[]
) {
    return events.reduce(
        (
            acc: Record<string, number>,
            event
        ) => {
            acc[event.category] =
                (acc[event.category] || 0) + 1;

            return acc;
        },
        {}
    );
}

export function getTriggerMoodAverages(
    events: AnalyticsEvent[]
) {
    const overallAverage =
        getAverageMood(events) ?? 0;

    const totals: Record<
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

        (event.triggers ?? []).forEach((t) => {
            const name = t.trigger.name;

            if (!totals[name]) {
                totals[name] = {
                    total: 0,
                    count: 0,
                };
            }

            totals[name].total += event.moodScore!;
            totals[name].count++;
        });
    });

    return Object.entries(totals)
        .map(([trigger, values]) => {
            const average = values.total / values.count;

            return {
                trigger,
                average: Number(
                    average.toFixed(1)
                ),

                difference: Number(
                    (
                        average -
                        overallAverage
                    ).toFixed(1)
                ),

                entries: values.count,
            }
        })
        .sort(
            (a, b) =>
                b.average - a.average
        );
}

export function confidenceLabel(
    entries: number
) {
    if (entries >= 30) {
        return "High";
    }

    if (entries >= 10) {
        return "Moderate";
    }

    return "Low";
}