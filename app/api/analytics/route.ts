import {prisma} from "@/src/lib/prisma";
import {NextResponse} from "next/server";

export async function GET() {
    const events = await prisma.event.findMany({
        where: {
            category: "Mood",
        },
        orderBy: {
            createdAt: "asc",
        },
    });

    return NextResponse.json(events);
}