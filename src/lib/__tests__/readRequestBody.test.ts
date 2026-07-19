import {
    describe,
    expect,
    test,
} from "vitest";

import {
    readRequestBody,
} from "@/src/lib/readRequestBody";

describe("readRequestBody", () => {
    test(
        "returns a valid object body",
        async () => {
            const request =
                new Request(
                    "http://localhost/test",
                    {
                        method: "POST",
                        headers: {
                            "Content-Type":
                                "application/json",
                        },
                        body:
                            JSON.stringify({
                                name: "Study",
                            }),
                    }
                );

            await expect(
                readRequestBody(
                    request
                )
            ).resolves.toEqual({
                body: {
                    name: "Study",
                },
                error: null,
            });
        }
    );

    test(
        "rejects malformed JSON",
        async () => {
            const request =
                new Request(
                    "http://localhost/test",
                    {
                        method: "POST",
                        headers: {
                            "Content-Type":
                                "application/json",
                        },
                        body:
                            "{invalid-json",
                    }
                );

            await expect(
                readRequestBody(
                    request
                )
            ).resolves.toEqual({
                body: null,
                error:
                    "Invalid request body.",
            });
        }
    );

    test(
        "rejects arrays",
        async () => {
            const request =
                new Request(
                    "http://localhost/test",
                    {
                        method: "POST",
                        headers: {
                            "Content-Type":
                                "application/json",
                        },
                        body:
                            JSON.stringify([
                                "invalid",
                            ]),
                    }
                );

            await expect(
                readRequestBody(
                    request
                )
            ).resolves.toEqual({
                body: null,
                error:
                    "Invalid request body.",
            });
        }
    );
});