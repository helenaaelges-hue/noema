import {
    NextResponse,
} from "next/server";

import {
    prisma,
} from "@/src/lib/prisma";

import {
    getApiUserId,
} from "@/src/lib/apiAuth";

type RouteContext = {
    params: Promise<{
        id: string;
    }>;
};

async function parseId(
    context: RouteContext
): Promise<number | null> {
    const {
        id,
    } = await context.params;

    const categoryId =
        Number(id);

    if (
        !Number.isInteger(
            categoryId
        ) ||
        categoryId <= 0
    ) {
        return null;
    }

    return categoryId;
}

export async function DELETE(
    request: Request,
    context: RouteContext
) {
    const {
        userId,
        response,
    } = await getApiUserId();

    if (response) {
        return response;
    }

    const categoryId =
        await parseId(context);

    if (categoryId === null) {
        return NextResponse.json(
            {
                error:
                    "Invalid category ID.",
            },
            {
                status: 400,
            }
        );
    }

    const category =
        await prisma.category.findFirst({
            where: {
                id: categoryId,
                userId,
            },
            select: {
                id: true,
                name: true,
            },
        });

    if (!category) {
        return NextResponse.json(
            {
                error:
                    "Category not found.",
            },
            {
                status: 404,
            }
        );
    }

    const eventCount =
        await prisma.event.count({
            where: {
                userId,
                categoryId,
            },
        });

    if (eventCount > 0) {
        return NextResponse.json(
            {
                error:
                    `"${category.name}" is used by ${eventCount} event${eventCount === 1 ? "" : "s"}. Reassign or delete those events first.`,
            },
            {
                status: 409,
            }
        );
    }

    await prisma.category.delete({
        where: {
            id: categoryId,
        },
    });

    return NextResponse.json({
        success: true,
    });
}