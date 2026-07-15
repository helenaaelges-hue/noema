import { NextResponse } from "next/server";

import { prisma } from "@/src/lib/prisma";
import {
    serializeEvent,
} from "@/src/lib/serializeEvent";
import {
    getApiUserId,
} from "@/src/lib/apiAuth";

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
                eventDate: "asc",
            },
        });

    return NextResponse.json(
        events.map(
            serializeEvent
        )
    );
}