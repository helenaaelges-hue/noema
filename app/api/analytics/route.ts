import {prisma} from "@/src/lib/prisma";
import {NextResponse} from "next/server";

export async function GET() {
    const events = await prisma.event.findMany({
        orderBy: {
            eventDate: "asc",
        },
        include: {
            triggers: {
                include: {
                    trigger: true,
                },
            },
        },
    });

    return NextResponse.json(events);
}