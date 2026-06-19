import {prisma} from "@/src/lib/prisma";
import {NextResponse} from "next/server";

export async function GET() {
    const categories =
        await prisma.category.findMany({
            orderBy: {
                name: "asc",
            },
        });

    return NextResponse.json(categories);
}