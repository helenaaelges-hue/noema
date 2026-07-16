import { NextResponse } from "next/server";

import { prisma } from "@/src/lib/prisma";
import {getApiUserId} from "@/src/lib/apiAuth";
import {
    serializeEvent,
} from "@/src/lib/serializeEvent";

type RouteContext = {
    params: Promise<{
        id: string;
    }>;
};

async function parseEventId(
    context: RouteContext
): Promise<number | null> {
    const {id} = await context.params;

    const eventId =
        Number(id);

    if (
        !Number.isInteger(eventId) ||
        eventId <= 0
    ) {
        return null;
    }

    return eventId;
}

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

export async function GET(
       request: Request,
       context: RouteContext
) {
    const {
        userId,
        response,
    } = await getApiUserId();

    if (response) {
        return response;
    }

    const eventId =
        await parseEventId(context);

    if (eventId === null) {
        return NextResponse.json(
            {
                error: "Invalid event ID.",
            },
            {
                status: 400,
            }
        );
    }

    const event =
        await prisma.event.findFirst({
            where: {
                id: eventId,
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
        });

    if (!event) {
        return NextResponse.json(
            {
                error:
                    "Event not found.",
            },
            {
                status: 404,
            }
        );
    }

    return NextResponse.json(
        serializeEvent(event)
    );
}

export async function PUT(
    request: Request,
    context: RouteContext
) {
    const {
        userId,
        response,
    } = await getApiUserId();

    if (response) {
        return response;
    }

    const eventId =
        await parseEventId(context);

    if (eventId === null) {
        return NextResponse.json(
            {
                error: "Invalid event ID.",
            },
            {
                status: 400,
            }
        );
    }

    const existingEvent =
        await prisma.event.findFirst({
            where: {
                id: eventId,
                userId,
            },
            select: {
                id: true,
            },
        });

    if (!existingEvent) {
        return NextResponse.json(
            {
                error:
                    "Event not found.",
            },
            {
                status: 404,
            }
        );
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

    if (
        moodScore !== null &&
        (
            !Number.isInteger(moodScore) ||
            moodScore < 1 ||
            moodScore > 10
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
                error: "A mood score is required for mood events.",
            },
            {
                status: 400,
            }
        );
    }

    if (
        normalizedMoodScore !== null &&
        (
            !Number.isInteger(
                normalizedMoodScore
            ) ||
            normalizedMoodScore < 1 ||
            normalizedMoodScore > 10
        )
    ) {
        return NextResponse.json(
            {
                error: "Mood score must be a whole number from 1 to 10.",
            },
            {
                status: 400,
            }
        );
    }

    const eventDate =
        new Date(
            body.eventDate
        );

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

    const updatedEvent =
        await prisma.$transaction(
            async transaction => {
                await transaction
                    .eventTrigger
                    .deleteMany({
                        where: {
                            eventId,
                        },
                    });

                await transaction.event.update({
                    where: {
                        id: eventId,
                    },

                    data: {
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
                    },
                });

                if (
                    ownedTriggers.length > 0
                ) {
                    await transaction
                        .eventTrigger
                        .createMany({
                            data:
                                ownedTriggers.map(
                                    trigger => ({
                                        eventId,
                                        triggerId:
                                            trigger.id,
                                    })
                                ),
                        });
                }

                return transaction
                    .event.findUniqueOrThrow({
                        where: {
                            id: eventId,
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
            }
        );

    return NextResponse.json(
        serializeEvent(
            updatedEvent
        )
    );
}

export async function DELETE(
    request: Request,    
    context: RouteContext
) {
    const {
        userId,
        response,
    } = await getApiUserId();

    if (response) {
        return response;
    }

    const eventId =
        await parseEventId(context);

    if (eventId === null) {
        return NextResponse.json(
            {
                error: "Invalid event ID.",
            },
            {
                status: 400,
            }
        );
    }

    const event =
        await prisma.event.findFirst({
            where: {
                id: eventId,
                userId,
            },
            select: {
                id: true,
            },
        });

    if (!event) {
        return NextResponse.json(
            {
                error:
                    "Event not found.",
            },
            {
                status: 404,
            }
        );
    }

    await prisma.$transaction([
        prisma.eventTrigger.deleteMany({
            where: {
                eventId,
            },
        }),

        prisma.event.delete({
            where: {
                id: eventId,
            },
        }),
    ]);

    return NextResponse.json({
        success: true,
    });
}