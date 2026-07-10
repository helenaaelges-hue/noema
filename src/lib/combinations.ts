import {AnalyticsEvent} from "./insights";

export type CombinationResult = {
    label: string;
    averageMood: number;
    entries: number;
    difference: number;
};

export function getTriggerCombinations(
    events: AnalyticsEvent[]
) {
    const moodEvents =
    events.filter(
        event =>
            event.category === "Mood" &&
            event.moodScore !== null
    );

    const overallAverage =
        moodEvents.reduce(
            (sum, event) =>
                sum + event.moodScore!,
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
        if ((event.triggers ?? []).length < 2) {
            return;
        }

        const combination =
            event.triggers
                .map((t) => t.trigger.name)
                .sort()
                .join(" + ");

        if (!totals[combination]) {
            totals[combination] = {
                total: 0,
                count: 0,
            };
        }

        totals[combination].total +=
            event.moodScore!;
        totals[combination].count++;
    });

    return Object.entries(totals)
        .map(([label, values]) => {

            const average =
                values.total / values.count;

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
                b.averageMood -
                a.averageMood
        );
}

