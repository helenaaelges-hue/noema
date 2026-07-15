import { NextResponse } from "next/server";

import {
    requireUserId,
    UnauthorizedError,
} from "@/src/lib/currentUser";

export async function getApiUserId():
    Promise<
        | {
            userId: number;
            response: null;
        }
        | {
            userId: null;
            response: NextResponse;
        }
    > {
    try {
        return {
            userId:
                await requireUserId(),
            response: null,
        };
    } catch (error) {
        if (
            error instanceof
            UnauthorizedError
        ) {
            return {
                userId: null,
                response:
                    NextResponse.json(
                        {
                            error:
                                "Authentication required.",
                        },
                        {
                            status: 401,
                        }
                    ),
            };
        }

        throw error;
    }
}