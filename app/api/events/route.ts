import {prisma} from "@/src/lib/prisma";
import {NextResponse} from "next/server";

export async function POST(request: Request) {
    const body = await request.json();

    const event = await prisma.event.create({
        data: {
            category: body.category,
            value: body.value,
            moodScore: body.moodScore
                ? Number(body.moodScore)
                : null,
            trigger: body.trigger,
            notes: body.notes,
        },
    });
    
    return NextResponse.json(event);
}

export async function GET() {
    const events = await prisma.event.findMany({
        orderBy: {
            createdAt: "desc",
        },
    });

    return NextResponse.json(events);
}

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