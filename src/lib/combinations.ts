import type {
    AnalyticsEvent,
} from "./insights";

export type CombinationResult = {
    label: string;
    averageMood: number;
    entries: number;
    difference: number;
};

type CombinationTotal = {
    total: number;
    count: number;
};

function createTriggerPairs(
    triggerNames: string[]
): string[] {
    const uniqueNames =
        Array.from(
            new Set(triggerNames)
        ).sort((a, b) =>
            a.localeCompare(
                b,
                undefined,
                {
                    sensitivity: "base",
                }
            )
        );

    const pairs: string[] = [];

    for (
        let firstIndex = 0;
        firstIndex <
        uniqueNames.length - 1;
        firstIndex++
    ) {
        for (
            let secondIndex =
                firstIndex + 1;
            secondIndex <
            uniqueNames.length;
            secondIndex++
        ) {
            pairs.push(
                `${uniqueNames[firstIndex]} + ${uniqueNames[secondIndex]}`
            );
        }
    }

    return pairs;
}

export function getTriggerCombinations(
    events: AnalyticsEvent[]
): CombinationResult[] {
    const moodEvents =
        events.filter(
            event =>
                event.category ===
                    "Mood" &&
                event.moodScore !==
                    null
        );

    if (moodEvents.length === 0) {
        return [];
    }

    const overallAverage =
        moodEvents.reduce(
            (sum, event) =>
                sum +
                event.moodScore!,
            0
        ) / moodEvents.length;

    const totals:
        Record<
            string,
            CombinationTotal
        > = {};

    for (const event of moodEvents) {
        const triggerNames =
            (event.triggers ?? [])
                .map(
                    relation =>
                        relation.trigger.name
                );

        const pairs =
            createTriggerPairs(
                triggerNames
            );

        for (const pair of pairs) {
            if (!totals[pair]) {
                totals[pair] = {
                    total: 0,
                    count: 0,
                };
            }

            totals[pair].total +=
                event.moodScore!;

            totals[pair].count += 1;
        }
    }

    return Object.entries(totals)
        .map(
            ([label, values]) => {
                const average =
                    values.total /
                    values.count;

                return {
                    label,
                    averageMood:
                        Number(
                            average.toFixed(
                                1
                            )
                        ),
                    entries:
                        values.count,
                    difference:
                        Number(
                            (
                                average -
                                overallAverage
                            ).toFixed(1)
                        ),
                };
            }
        )
        .filter(
            item =>
                item.entries >= 3
        )
        .sort((first, second) => {
            const effectDifference =
                Math.abs(
                    second.difference
                ) -
                Math.abs(
                    first.difference
                );

            if (
                effectDifference !== 0
            ) {
                return effectDifference;
            }

            return (
                second.entries -
                first.entries
            );
        });
}