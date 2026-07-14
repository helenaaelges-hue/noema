import { NextResponse } from "next/server";

import { prisma } from "@/src/lib/prisma";
import {
    requireUserId,
} from "@/src/lib/currentUser";
import {
    serializeEvent,
} from "@/src/lib/serializeEvent";

export async function GET() {
    const userId =
        await requireUserId();

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
                eventDate: "asc",
            },
        });

    return NextResponse.json(
        events.map(
            serializeEvent
        )
    );
}