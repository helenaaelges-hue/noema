import { prisma } from "@/src/lib/prisma";
import { NextResponse } from "next/server";

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;

    await prisma.event.delete({
        where: {
            id: Number(id),
        },
    });

    return NextResponse.json({
        success: true,
    });
}

export async function GET(
    request: Request,
    { params }: {
        params: Promise<{ id: string }>
    }
) {
    const { id } = await params;

    const event =
        await prisma.event.findUnique({
            where: {
                id: Number(id),
            },
        });

    return NextResponse.json(event);
}

export async function PUT(
    request: Request,
    { params }: {
        params: Promise<{ id: string }>
    }
) {
    const body =
        await request.json();

    const { id } =
        await params;

    const event =
        await prisma.event.update({
            where: {
                id: Number(id),
            },

            data: {
                category: body.category,
                value: body.value,

                moodScore:
                    body.moodScore
                        ? Number(
                            body.moodScore
                        )
                        : null,

                trigger:
                    body.trigger,

                notes:
                    body.notes,

                eventDate:
                    new Date(
                        body.eventDate
                    ),
            },
        });

    return NextResponse.json(event);
}