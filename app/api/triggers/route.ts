import { NextResponse } from "next/server";

import { prisma } from "@/src/lib/prisma";
import {
    getApiUserId,
} from "@/src/lib/apiAuth";
import {cleanDisplayName, normalizeName} from "@/src/lib/names";
import {readRequestBody} from "@/src/lib/readRequestBody";

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

    const {
        body,
        error: bodyError,
    } = await readRequestBody(
        request
    );

    if (bodyError || !body) {
        return NextResponse.json(
            {
                error:
                    bodyError ??
                    "Invalid request body.",
            },
            {
                status: 400,
            }
        );
    }

    const name =
        typeof body.name === "string"
            ? cleanDisplayName(
                body.name
            )
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

    if (
            typeof body.name !== "string"
        ) {
            return NextResponse.json(
                {
                    error:
                        "Name is required.",
                },
                {
                    status: 400,
                }
            );
        }

    const displayName =
        cleanDisplayName(
            body.name
        );

    const normalizedName =
        normalizeName(
            displayName
        );

    const existingTriggers =
        await prisma.trigger.findMany({
            where: {
                userId,
            },
            select: {
                id: true,
                name: true,
            },
        });

    const duplicate =
        existingTriggers.some(
            trigger =>
                normalizeName(
                    trigger.name
                ) ===
                normalizedName
        );

    if (duplicate) {
        return NextResponse.json(
            {
                error:
                    "A trigger with this name already exists.",
            },
            {
                status: 409,
            }
        );
    }

    const trigger =
        await prisma.trigger.create({
            data: {
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