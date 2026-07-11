import {AnalyticsEvent} from "./insights";

export function getMoodTrend(
    events: AnalyticsEvent[]
) {
    const moodEvents = events
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

    if (moodEvents.length < 10) {
        return {
            label: "Not enough data",
            value: 0
        };
    }

    const recent =
        moodEvents.slice(-7);

    const previous =
        moodEvents.slice(-14, -7);

    const average = (
        array: typeof moodEvents
    ) =>
        array.reduce(
            (sum, event) =>
                sum + event.moodScore!,
            0
        ) / array.length;

    const recentAverage =
        average(recent);

    const previousAverage =
        average(previous);

    const difference =
        Number(
            (
                recentAverage -
                previousAverage
            ).toFixed(1)
        );

    if (difference > 0.3) {
        return {
            label: "Improving",
            value: difference,
        };
    }

    if (difference < -0.3) {
        return {
            label: "Declining",
            value: difference,
        };
    }

    return {
        label: "Stable",
        value: difference,
    };
}