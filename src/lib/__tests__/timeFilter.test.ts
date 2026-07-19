import {
    afterEach,
    describe,
    expect,
    test,
    vi,
} from "vitest";

import {
    filterByTimeRange,
} from "@/src/lib/timeFilter";

import {
    makeEvent,
} from "@/src/test/analyticsEventFactory";

afterEach(() => {
    vi.useRealTimers();
});

describe("filterByTimeRange", () => {
    test(
        "returns every event for all time",
        () => {
            const events = [
                makeEvent({
                    id: 1,
                    eventDate:
                        "2024-01-01T12:00:00.000Z",
                }),

                makeEvent({
                    id: 2,
                    eventDate:
                        "2026-07-01T12:00:00.000Z",
                }),
            ];

            expect(
                filterByTimeRange(
                    events,
                    "all"
                )
            ).toHaveLength(2);
        }
    );

    test(
        "includes recent events in the seven-day period",
        () => {
            vi.useFakeTimers();

            vi.setSystemTime(
                new Date(
                    "2026-07-19T12:00:00.000Z"
                )
            );

            const events = [
                makeEvent({
                    id: 1,
                    eventDate:
                        "2026-07-18T12:00:00.000Z",
                }),

                makeEvent({
                    id: 2,
                    eventDate:
                        "2026-07-14T12:00:00.000Z",
                }),
            ];

            expect(
                filterByTimeRange(
                    events,
                    "7d"
                ).map(
                    event =>
                        event.id
                )
            ).toEqual([
                1,
                2,
            ]);
        }
    );

    test(
        "excludes events older than the seven-day period",
        () => {
            vi.useFakeTimers();

            vi.setSystemTime(
                new Date(
                    "2026-07-19T12:00:00.000Z"
                )
            );

            const events = [
                makeEvent({
                    id: 1,
                    eventDate:
                        "2026-07-18T12:00:00.000Z",
                }),

                makeEvent({
                    id: 2,
                    eventDate:
                        "2026-07-01T12:00:00.000Z",
                }),
            ];

            expect(
                filterByTimeRange(
                    events,
                    "7d"
                ).map(
                    event =>
                        event.id
                )
            ).toEqual([
                1,
            ]);
        }
    );
});