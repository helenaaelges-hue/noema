import {
    describe,
    expect,
    test,
} from "vitest";

import {
    confidenceLabel,
    getAverageMood,
    getTriggerMoodAverages,
} from "@/src/lib/insights";

import {
    makeEvent,
} from "@/src/test/analyticsEventFactory";

describe("confidenceLabel", () => {
    test(
        "returns Low below ten entries",
        () => {
            expect(
                confidenceLabel(9)
            ).toBe("Low");
        }
    );

    test(
        "returns Moderate from ten entries",
        () => {
            expect(
                confidenceLabel(10)
            ).toBe("Moderate");
        }
    );

    test(
        "returns High from thirty entries",
        () => {
            expect(
                confidenceLabel(30)
            ).toBe("High");
        }
    );
});

describe("getAverageMood", () => {
    test(
        "uses only Mood events with a mood score",
        () => {
            const events = [
                makeEvent({
                    id: 1,
                    moodScore: 8,
                }),

                makeEvent({
                    id: 2,
                    moodScore: 4,
                }),

                makeEvent({
                    id: 3,
                    category: "Sleep",
                    moodScore: null,
                }),

                makeEvent({
                    id: 4,
                    category: "Mood",
                    moodScore: null,
                }),
            ];

            expect(
                getAverageMood(events)
            ).toBe(6);
        }
    );
});

describe("getTriggerMoodAverages", () => {
    test(
        "groups mood scores by trigger",
        () => {
            const events = [
                makeEvent({
                    id: 1,
                    moodScore: 8,
                    triggerNames: [
                        "Exercise",
                    ],
                }),

                makeEvent({
                    id: 2,
                    moodScore: 6,
                    triggerNames: [
                        "Exercise",
                    ],
                }),

                makeEvent({
                    id: 3,
                    moodScore: 4,
                    triggerNames: [],
                }),
            ];

            const results =
                getTriggerMoodAverages(
                    events
                );

            const exercise =
                results.find(
                    item =>
                        item.trigger ===
                        "Exercise"
                );

            expect(
                exercise
            ).toBeDefined();

            expect(
                exercise?.entries
            ).toBe(2);

            expect(
                exercise?.average
            ).toBe(7);
        }
    );
});