import {prisma} from "@/src/lib/prisma";
import {NextResponse} from "next/server";

export async function GET() {
    const triggers =
        await prisma.trigger.findMany({
            orderBy: {
                name: "asc",
            },
        });

    return NextResponse.json(triggers);
}

export async function POST(request: Request) {
    const body = await request.json();

    const trigger =
        await prisma.trigger.create({
            data: {
                name: body.name,
            },
        });

    return NextResponse.json(trigger);
}