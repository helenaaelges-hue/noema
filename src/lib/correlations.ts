import {AnalyticsEvent} from "./insights";

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