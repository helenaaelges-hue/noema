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

            notes: body.notes,

            eventDate: body.eventDate
                ? new Date(body.eventDate)
                : new Date(),
        },
    });

    if (
        body.triggerIds &&
        body.triggerIds.length > 0
    ) {
        await prisma.eventTrigger.createMany({
            data: body.triggerIds.map(
                (triggerId: number) => ({
                    eventId: event.id,
                    triggerId,
                })
            ),
        });
    }
    
    return NextResponse.json(event);
}

export async function GET() {
    const events = await prisma.event.findMany({
        include: {
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

    return NextResponse.json(events);
}