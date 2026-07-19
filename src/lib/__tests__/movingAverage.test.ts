import {
    describe,
    expect,
    test,
} from "vitest";

import {
    movingAverage
} from "@/src/lib/movingAverage";

describe("movingAverage", () => {
    test(
        "returns an empty array for empty input",
        () => {
            expect(
                movingAverage([], 3)
            ).toEqual([]);
        }
    );

    test(
        "returns the original value for one entry",
        () => {
            expect(
                movingAverage([6], 7)
            ).toEqual([6]);
        }
    );

    test(
        "uses available entries before the full window is reached",
        () => {
            expect(
                movingAverage(
                    [2, 4, 6],
                    3
                )
            ).toEqual([
                2,
                3,
                4,
            ]);
        }
    );

    test(
        "uses a rolling window after the window is full",
        () => {
            expect(
                movingAverage(
                    [1, 2, 3, 4, 5],
                    3
                )
            ).toEqual([
                1,
                1.5,
                2,
                3,
                4,
            ]);
        }
    );
});