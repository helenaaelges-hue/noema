import { NextResponse } from "next/server";

import { prisma } from "@/src/lib/prisma";
import {getApiUserId} from "@/src/lib/apiAuth";
import {
    serializeEvent,
} from "@/src/lib/serializeEvent";

function parseTriggerIds(
    value: unknown
): number[] {
    if (!Array.isArray(value)) {
        return [];
    }

    return Array.from(
        new Set(
            value
                .map(Number)
                .filter(
                    id =>
                        Number.isInteger(id) &&
                        id > 0
                )
        )
    );
}

export async function POST(
    request: Request
) {
    const {
        userId,
        response,
    } = await getApiUserId();

    if (response) {
        return response;
    }

    const body =
        await request.json();

    const categoryName =
        typeof body.category === "string"
            ? body.category.trim()
            : "";

    const value =
        typeof body.value === "string"
            ? body.value.trim()
            : "";

    if (!categoryName || !value) {
        return NextResponse.json(
            {
                error:
                    "Category and value are required.",
            },
            {
                status: 400,
            }
        );
    }

    const category =
        await prisma.category.findUnique({
            where: {
                userId_name: {
                    userId,
                    name: categoryName,
                },
            },
        });

    if (!category) {
        return NextResponse.json(
            {
                error:
                    "The selected category does not exist.",
            },
            {
                status: 400,
            }
        );
    }

    const moodScore =
        body.moodScore === "" ||
        body.moodScore === null ||
        body.moodScore === undefined
            ? null
            : Number(body.moodScore);

    const normalizedMoodScore =
        category.name === "Mood"
            ? moodScore
            : null;

    if (
        category.name === "Mood" &&
        normalizedMoodScore === null
    ) {
        return NextResponse.json(
            {
                error:
                    "A mood score is required for mood events.",
            },
            {
                status: 400,
            }
        );
    }

    if (
        normalizedMoodScore !== null &&
        (
            !Number.isInteger(normalizedMoodScore) ||
            normalizedMoodScore < 1 ||
            normalizedMoodScore > 10
        )
    ) {
        return NextResponse.json(
            {
                error:
                    "Mood score must be a whole number from 1 to 10.",
            },
            {
                status: 400,
            }
        );
    }

    const eventDate =
        body.eventDate
            ? new Date(body.eventDate)
            : new Date();

    if (
        Number.isNaN(
            eventDate.getTime()
        )
    ) {
        return NextResponse.json(
            {
                error:
                    "The event date is invalid.",
            },
            {
                status: 400,
            }
        );
    }

    const requestedTriggerIds =
        parseTriggerIds(
            body.triggerIds
        );

    const ownedTriggers =
        requestedTriggerIds.length > 0
            ? await prisma.trigger.findMany({
                where: {
                    userId,
                    id: {
                        in: requestedTriggerIds,
                    },
                },
                select: {
                    id: true,
                },
            })
            : [];

    if (
        ownedTriggers.length !==
        requestedTriggerIds.length
    ) {
        return NextResponse.json(
            {
                error:
                    "One or more selected triggers are invalid.",
            },
            {
                status: 400,
            }
        );
    }

    const event =
        await prisma.event.create({
            data: {
                userId,
                categoryId:
                    category.id,
                value,
                moodScore:
                    normalizedMoodScore,
                notes:
                    typeof body.notes ===
                        "string" &&
                    body.notes.trim()
                        ? body.notes.trim()
                        : null,
                eventDate,

                ...(ownedTriggers.length > 0
                    ? {
                        triggers: {
                            create:
                                ownedTriggers.map(
                                    trigger => ({
                                        triggerId:
                                            trigger.id,
                                    })
                                ),
                        },
                    }
                    : {}),
            },

            include: {
                category: true,
                triggers: {
                    include: {
                        trigger: true,
                    },
                },
            },
        });

    return NextResponse.json(
        serializeEvent(event),
        {
            status: 201,
        }
    );
}

export async function GET() {
    const {
        userId,
        response,
    } = await getApiUserId();

    if (response) {
        return response;
    }

    const events =
        await prisma.event.findMany({
            where: {
                userId,
            },

            include: {
                category: true,
                triggers: {
                    include: {
                        trigger: true,
                    },
                },
            },

            orderBy: {
                eventDate: "desc",
            },
        });

    return NextResponse.json(
        events.map(
            serializeEvent
        )
    );
}