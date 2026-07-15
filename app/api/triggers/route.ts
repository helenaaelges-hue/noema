import { NextResponse } from "next/server";

import { prisma } from "@/src/lib/prisma";
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

    const triggers =
        await prisma.trigger.findMany({
            where: {
                userId,
            },
            orderBy: {
                name: "asc",
            },
        });

    return NextResponse.json(
        triggers
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

    const name =
        typeof body.name === "string"
            ? body.name.trim()
            : "";

    if (!name) {
        return NextResponse.json(
            {
                error:
                    "Trigger name is required.",
            },
            {
                status: 400,
            }
        );
    }

    const trigger =
        await prisma.trigger.upsert({
            where: {
                userId_name: {
                    userId,
                    name,
                },
            },
            update: {},
            create: {
                userId,
                name,
            },
        });

    return NextResponse.json(
        trigger,
        {
            status: 201,
        }
    );
}