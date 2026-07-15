import {prisma} from "@/src/lib/prisma";
import {NextResponse} from "next/server";
import {getApiUserId} from "@/src/lib/apiAuth";

export async function GET() {
    const {
        userId,
        response,
    } = await getApiUserId();

    if (response) {
        return response;
    }
    
    const categories =
        await prisma.category.findMany({
            where: {
                userId,
            },
            orderBy: {
                name: "asc",
            },
        });

    return NextResponse.json(categories);
}

export async function POST(request: Request) {
    const {
        userId,
        response,
    } = await getApiUserId();

    if (response) {
        return response;
    }

    const body = await request.json();

    const name =
        typeof body.name === "string"
            ? body.name.trim()
            : "";

    if (!name) {
        return NextResponse.json(
            {
                error:
                    "Category name is required.",
            },
            {
                status: 400,
            }
        );
    }

    const category =
        await prisma.category.upsert({
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
        category,
        {
            status: 201,
        }
    );
}