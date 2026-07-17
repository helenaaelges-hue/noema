import {
    NextResponse,
} from "next/server";

import {
    prisma,
} from "@/src/lib/prisma";

import {
    getApiUserId,
} from "@/src/lib/apiAuth";

type RouteContext = {
    params: Promise<{
        id: string;
    }>;
};

async function parseId(
    context: RouteContext
): Promise<number | null> {
    const {
        id,
    } = await context.params;

    const triggerId =
        Number(id);

    if (
        !Number.isInteger(
            triggerId
        ) ||
        triggerId <= 0
    ) {
        return null;
    }

    return triggerId;
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

    const triggerId =
        await parseId(context);

    if (triggerId === null) {
        return NextResponse.json(
            {
                error:
                    "Invalid trigger ID.",
            },
            {
                status: 400,
            }
        );
    }

    const trigger =
        await prisma.trigger.findFirst({
            where: {
                id: triggerId,
                userId,
            },
            select: {
                id: true,
                name: true,
            },
        });

    if (!trigger) {
        return NextResponse.json(
            {
                error:
                    "Trigger not found.",
            },
            {
                status: 404,
            }
        );
    }

    const eventCount =
        await prisma.eventTrigger.count({
            where: {
                triggerId,
            },
        });

    if (eventCount > 0) {
        return NextResponse.json(
            {
                error:
                    `"${trigger.name}" is used by ${eventCount} event${eventCount === 1 ? "" : "s"}. Remove it from those events first.`,
            },
            {
                status: 409,
            }
        );
    }

    await prisma.trigger.delete({
        where: {
            id: triggerId,
        },
    });

    return NextResponse.json({
        success: true,
    });
}