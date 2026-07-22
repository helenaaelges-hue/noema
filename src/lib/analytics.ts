export type AnalyticsRecord = {
    category: string;
    moodScore: number | null;
    trigger?: string | null;
};

export type TriggerCorrelation = {
    trigger: string;
    average: number;
    difference: number;
    entries: number;
};

export function calculateAverageMood(
    events: AnalyticsRecord[]
): number {
    const moodEvents =
        events.filter(
            event =>
                event.category === "Mood" &&
                event.moodScore !== null
        );

    if (moodEvents.length === 0) {
        return 0;
    }

    const average =
        moodEvents.reduce(
            (sum, event) =>
                sum +
                (
                    event.moodScore ??
                    0
                ),
            0
        ) / moodEvents.length;

    return Number(
        average.toFixed(1)
    );
}

export function calculateCategoryStatistics(
    events: AnalyticsRecord[]
): [string, number][] {
    const totals =
        events.reduce<
            Record<string, number>
        >(
            (accumulator, event) => {
                accumulator[
                    event.category
                ] =
                    (
                        accumulator[
                            event.category
                        ] ?? 0
                    ) + 1;

                return accumulator;
            },
            {}
        );

    return Object.entries(
        totals
    ).sort(
        (
            first,
            second
        ) =>
            second[1] -
            first[1]
    );
}

export function calculateTriggerCorrelations(
    events: AnalyticsRecord[]
): TriggerCorrelation[] {
    const moodEvents =
        events.filter(
            (
                event
            ): event is AnalyticsRecord & {
                moodScore: number;
                trigger: string;
            } =>
                event.category ===
                    "Mood" &&
                event.moodScore !==
                    null &&
                typeof event.trigger ===
                    "string" &&
                event.trigger.length > 0
        );

    const overallAverage =
        calculateAverageMood(
            events
        );

    const triggerMap:
        Record<string, number[]> =
        {};

    moodEvents.forEach(
        event => {
            if (
                !triggerMap[
                    event.trigger
                ]
            ) {
                triggerMap[
                    event.trigger
                ] = [];
            }

            triggerMap[
                event.trigger
            ].push(
                event.moodScore
            );
        }
    );

    return Object.entries(
        triggerMap
    )
        .map(
            ([
                trigger,
                scores,
            ]) => {
                const average =
                    scores.reduce(
                        (
                            sum,
                            score
                        ) =>
                            sum +
                            score,
                        0
                    ) /
                    scores.length;

                return {
                    trigger,
                    average:
                        Number(
                            average.toFixed(
                                1
                            )
                        ),
                    difference:
                        Number(
                            (
                                average -
                                overallAverage
                            ).toFixed(1)
                        ),
                    entries:
                        scores.length,
                };
            }
        )
        .sort(
            (
                first,
                second
            ) =>
                second.difference -
                first.difference
        );
}