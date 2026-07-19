import {
    describe,
    expect,
    test,
} from "vitest";

import {
    cleanDisplayName,
    normalizeName,
    sortByName,
} from "@/src/lib/names";

describe("normalizeName", () => {
    test(
        "ignores capitalization",
        () => {
            expect(
                normalizeName("STUDY")
            ).toBe(
                normalizeName("study")
            );
        }
    );

    test(
        "trims and collapses whitespace",
        () => {
            expect(
                normalizeName(
                    "  Medical   Appointment "
                )
            ).toBe(
                "medical appointment"
            );
        }
    );
});

describe("cleanDisplayName", () => {
    test(
        "preserves capitalization while cleaning whitespace",
        () => {
            expect(
                cleanDisplayName(
                    "  Medical   Appointment "
                )
            ).toBe(
                "Medical Appointment"
            );
        }
    );
});

describe("sortByName", () => {
    test(
        "sorts names without treating lowercase as a separate group",
        () => {
            const values = [
                {
                    id: 1,
                    name: "work",
                },
                {
                    id: 2,
                    name: "Exercise",
                },
                {
                    id: 3,
                    name: "study",
                },
                {
                    id: 4,
                    name: "Health",
                },
            ];

            expect(
                sortByName(values)
                    .map(
                        item =>
                            item.name
                    )
            ).toEqual([
                "Exercise",
                "Health",
                "study",
                "work",
            ]);
        }
    );
});