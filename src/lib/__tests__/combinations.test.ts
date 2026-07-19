import {
    describe,
    expect,
    test,
} from "vitest";

import {
    getTriggerCombinations,
} from "@/src/lib/combinations";

import {
    makeEvent,
} from "@/src/test/analyticsEventFactory";

describe(
    "getTriggerCombinations",
    () => {
        test(
            "returns no results without mood events",
            () => {
                const events = [
                    makeEvent({
                        category:
                            "Sleep",
                        moodScore:
                            null,
                    }),
                ];

                expect(
                    getTriggerCombinations(
                        events
                    )
                ).toEqual([]);
            }
        );

        test(
            "hides pairs with fewer than three entries",
            () => {
                const events = [
                    makeEvent({
                        id: 1,
                        moodScore: 8,
                        triggerNames: [
                            "Exercise",
                            "Friends",
                        ],
                    }),

                    makeEvent({
                        id: 2,
                        moodScore: 7,
                        triggerNames: [
                            "Exercise",
                            "Friends",
                        ],
                    }),
                ];

                expect(
                    getTriggerCombinations(
                        events
                    )
                ).toEqual([]);
            }
        );

        test(
            "calculates a pair after three matching entries",
            () => {
                const events = [
                    makeEvent({
                        id: 1,
                        moodScore: 8,
                        triggerNames: [
                            "Exercise",
                            "Friends",
                        ],
                    }),

                    makeEvent({
                        id: 2,
                        moodScore: 6,
                        triggerNames: [
                            "Exercise",
                            "Friends",
                        ],
                    }),

                    makeEvent({
                        id: 3,
                        moodScore: 7,
                        triggerNames: [
                            "Exercise",
                            "Friends",
                        ],
                    }),

                    makeEvent({
                        id: 4,
                        moodScore: 3,
                        triggerNames: [],
                    }),
                ];

                const results =
                    getTriggerCombinations(
                        events
                    );

                expect(results).toHaveLength(
                    1
                );

                expect(
                    results[0]
                ).toMatchObject({
                    label:
                        "Exercise + Friends",
                    averageMood: 7,
                    entries: 3,
                    difference: 1,
                });
            }
        );

        test(
            "creates every pair from an event containing three triggers",
            () => {
                const events =
                    [6, 7, 8].map(
                        (
                            moodScore,
                            index
                        ) =>
                            makeEvent({
                                id:
                                    index +
                                    1,
                                moodScore,
                                triggerNames:
                                    [
                                        "Coffee",
                                        "Exercise",
                                        "Friends",
                                    ],
                            })
                    );

                const labels =
                    getTriggerCombinations(
                        events
                    )
                        .map(
                            result =>
                                result.label
                        )
                        .sort();

                expect(
                    labels
                ).toEqual([
                    "Coffee + Exercise",
                    "Coffee + Friends",
                    "Exercise + Friends",
                ]);
            }
        );
    }
);