export function calculateAverageMood(events: any[]) {

    const moodEvents = events.filter(
        (event) =>
            event.category === "Mood" &&
            event.moodScore !== null
    );

    if (moodEvents.length === 0) {
        return 0;
    }

    const average =
        moodEvents.reduce(
            (sum, event) =>
                sum + event.moodScore,
            0
        ) / moodEvents.length;

    return Number(average.toFixed(1));
}

export function calculateCategoryStatistics(
    events: any[]
) {
    return Object.entries(
        events.reduce(
            (
                acc: Record<string, number>,
                event: any
            ) => {

                acc[event.category] =
                    (acc[event.category] || 0) + 1;

                return acc;

            },
            {}
        )
    ).sort(
        (a, b) =>
            Number(b[1]) - Number(a[1])
    );
}