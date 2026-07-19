export type RequestBodyResult =
    | {
        body: Record<string, unknown>;
        error: null;
    }
    | {
        body: null;
        error: string;
    };

export async function readRequestBody(
    request: Request
): Promise<RequestBodyResult> {
    try {
        const body: unknown =
            await request.json();

        if (
            !body ||
            typeof body !== "object" ||
            Array.isArray(body)
        ) {
            return {
                body: null,
                error:
                    "Invalid request body.",
            };
        }

        return {
            body:
                body as Record<
                    string,
                    unknown
                >,
            error: null,
        };
    } catch {
        return {
            body: null,
            error:
                "Invalid request body.",
        };
    }
}