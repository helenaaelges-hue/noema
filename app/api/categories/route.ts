import {prisma} from "@/src/lib/prisma";
import {NextResponse} from "next/server";
import {getApiUserId} from "@/src/lib/apiAuth";
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
                    "Category name is required.",
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

    if (!displayName) {
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
        existingCategories.some(
            category =>
                normalizeName(
                    category.name
                ) ===
                normalizedName
        );

    if (duplicate) {
        return NextResponse.json(
            {
                error:
                    "A category with this name already exists.",
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
                name: displayName,
            },

            select: {
                id: true,
                name: true,
            },
        });

    return NextResponse.json(
        category,
        {
            status: 201,
        }
    );
}