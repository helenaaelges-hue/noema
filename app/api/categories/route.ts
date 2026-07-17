import {prisma} from "@/src/lib/prisma";
import {NextResponse} from "next/server";
import {getApiUserId} from "@/src/lib/apiAuth";
import {cleanDisplayName, normalizeName} from "@/src/lib/names";

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
            ? cleanDisplayName(
                body.name
            )
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

    const existingCategories =
        await prisma.category.findMany({
            where: {
                userId,
            },
            select: {
                id: true,
                name: true,
            },
        });

    const duplicate =
        existingCategories.find(
            category =>
                normalizeName(
                    category.name
                ) ===
                normalizeName(name)
        );

    if (duplicate) {
        return NextResponse.json(
            {
                error:
                    `A category named "${duplicate.name}" already exists.`,
            },
            {
                status: 409,
            }
        );
    }

    const category =
        await prisma.category.create({
            data: {
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